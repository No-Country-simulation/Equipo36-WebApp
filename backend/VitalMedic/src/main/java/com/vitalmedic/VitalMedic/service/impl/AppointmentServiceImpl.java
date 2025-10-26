package com.vitalmedic.VitalMedic.service.impl;

import com.vitalmedic.VitalMedic.domain.dto.appointment.*;
import com.vitalmedic.VitalMedic.domain.entity.AppointmentEntity;
import com.vitalmedic.VitalMedic.domain.entity.DoctorEntity;
import com.vitalmedic.VitalMedic.domain.entity.PatientEntity;
import com.vitalmedic.VitalMedic.domain.entity.User;
import com.vitalmedic.VitalMedic.domain.enums.AppointmentStatus;
import com.vitalmedic.VitalMedic.domain.enums.WeekDay;
import com.vitalmedic.VitalMedic.domain.mapper.AppointmentMapper;
import com.vitalmedic.VitalMedic.exception.AppointmentConflictException;
import com.vitalmedic.VitalMedic.exception.DoctorNotAvailableException;
import com.vitalmedic.VitalMedic.exception.ResourceNotFoundException;
import com.vitalmedic.VitalMedic.repository.AppointmentRepository;
import com.vitalmedic.VitalMedic.repository.DoctorRepository;
import com.vitalmedic.VitalMedic.repository.DoctorScheduleRepository;
import com.vitalmedic.VitalMedic.repository.PatientRepository;
import com.vitalmedic.VitalMedic.service.AppointmentService;
import com.vitalmedic.VitalMedic.service.AuthService;
import com.vitalmedic.VitalMedic.service.KeycloakAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorScheduleRepository scheduleRepository;

    private final AuthService authService;

    private final KeycloakAuthService keycloakAuthService;

    private final GoogleCalendarServiceImpl googleCalendarService;

    private final AppointmentMapper appointmentMapper;
    private final PatientRepository patientRepository;

    public AppointmentResponse createAppointment(AppointmentRequest request) {
        DoctorEntity doctor = doctorRepository.findById(request.doctorId())
                .orElseThrow(() -> new RuntimeException("Doctor no encontrado"));

        User user = authService.getAuthenticatedUser();

        PatientEntity patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("El usuario autenticado no se encuentra como Paciente"));

        int duration = doctor.getSpecialty().getAverageDurationMinutes();
        LocalTime endTime = request.startTime().plusMinutes(duration);

        validateDoctorAvailability(doctor, request.date(), request.startTime(), endTime);

        AppointmentEntity appointment = appointmentMapper.toEntity(request, patient, doctor, duration);
        appointmentRepository.save(appointment);

        GoogleCalendarEventResponse response = keycloakAuthService.getGoogleFederatedToken(authService.getAccessToken())
                .flatMap(tokenMap -> {
                    GoogleCalendarEventRequest dto = new GoogleCalendarEventRequest();
                    dto.setPatient(patient);
                    dto.setDoctor(doctor);
                    dto.setAppointment(appointment);
                    dto.setAccessToken((String) tokenMap.get("access_token"));
                    return googleCalendarService.createEvent(dto);
                })
                .block();

        appointment.setGoogleEventId(response.getGoogleEventId());
        appointment.setMeetLink(response.getMeetLink());
        appointmentRepository.save(appointment);

        return appointmentMapper.toResponse(appointment);
    }




    @Override
    public List<AppointmentWithPatientResponse> getAppointmentsByDoctorAndDate(UUID id, LocalDate date) {
        List<AppointmentEntity> appointments = appointmentRepository.findByDoctorIdAndDate(id, date);
        return appointmentMapper.toAppointmentWithPatientResponse(appointments);
    }

    @Override
    public List<AppointmentWithDoctorResponse> getAppointmentsByPatientAndDate(UUID id, LocalDate date) {
        List<AppointmentEntity> appointments = appointmentRepository.findByPatientIdAndDate(id, date);
        return appointmentMapper.toAppointmentWithDoctorResponse(appointments);
    }




    private void validateDoctorAvailability(DoctorEntity doctor, LocalDate date, LocalTime startTime, LocalTime endTime) {
        WeekDay dayOfWeek = WeekDay.fromJavaWeekDay(date.getDayOfWeek());

        boolean inSchedule = scheduleRepository
                .findByDoctorIdAndDayOfWeekAndActive(doctor.getId(), dayOfWeek, true)
                .stream()
                .anyMatch(schedule ->
                        !startTime.isBefore(schedule.getStartTime()) &&
                                !endTime.isAfter(schedule.getEndTime())
                );

        if (!inSchedule) {
            throw new DoctorNotAvailableException("El horario seleccionado no pertenece al horario laboral del doctor");
        }

        boolean isTaken = appointmentRepository
                .findByDoctorIdAndDateAndStatusIn(
                        doctor.getId(),
                        date,
                        List.of(AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED)
                ).stream()
                .anyMatch(existing ->
                        startTime.isBefore(existing.getEndTime()) &&
                                endTime.isAfter(existing.getStartTime())
                );

        if (isTaken) {
            throw new AppointmentConflictException("El horario seleccionado ya está ocupado");
        }
    }



}
