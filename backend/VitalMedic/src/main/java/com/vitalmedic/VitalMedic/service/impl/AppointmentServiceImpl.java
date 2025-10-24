package com.vitalmedic.VitalMedic.service.impl;

import com.vitalmedic.VitalMedic.domain.dto.appointment.AppointmentRequest;
import com.vitalmedic.VitalMedic.domain.dto.appointment.AppointmentResponse;
import com.vitalmedic.VitalMedic.domain.dto.appointment.AppointmentWithDoctorResponse;
import com.vitalmedic.VitalMedic.domain.dto.appointment.AppointmentWithPatientResponse;
import com.vitalmedic.VitalMedic.domain.entity.AppointmentEntity;
import com.vitalmedic.VitalMedic.domain.entity.DoctorEntity;
import com.vitalmedic.VitalMedic.domain.entity.PatientEntity;
import com.vitalmedic.VitalMedic.domain.entity.User;
import com.vitalmedic.VitalMedic.domain.enums.AppointmentStatus;
import com.vitalmedic.VitalMedic.domain.enums.WeekDay;
import com.vitalmedic.VitalMedic.domain.mapper.AppointmentMapper;
import com.vitalmedic.VitalMedic.exception.ResourceNotFoundException;
import com.vitalmedic.VitalMedic.repository.AppointmentRepository;
import com.vitalmedic.VitalMedic.repository.DoctorRepository;
import com.vitalmedic.VitalMedic.repository.DoctorScheduleRepository;
import com.vitalmedic.VitalMedic.repository.PatientRepository;
import com.vitalmedic.VitalMedic.service.AppointmentService;
import com.vitalmedic.VitalMedic.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorScheduleRepository scheduleRepository;

    private final AuthService authService;

    private final AppointmentMapper appointmentMapper;
    private final PatientRepository patientRepository;

    public AppointmentResponse createAppointment(AppointmentRequest request) {
        DoctorEntity doctor = doctorRepository.findById(request.doctorId())
                .orElseThrow(() -> new RuntimeException("Doctor no encontrado"));

        User user = authService.getAuthenticatedUser();

        PatientEntity patient = patientRepository.findByUser(user)
                .orElseThrow(()-> new ResourceNotFoundException("El usuario autenticado no se encuentra como Paciente"));

        int duration = doctor.getSpecialty().getAverageDurationMinutes();
        LocalTime endTime = request.startTime().plusMinutes(duration);

        WeekDay dayOfWeek = WeekDay.fromJavaWeekDay(request.date().getDayOfWeek());
        boolean inSchedule = scheduleRepository
                .findByDoctorIdAndDayOfWeekAndActive(doctor.getId(), dayOfWeek, true)
                .stream()
                .anyMatch(s -> !request.startTime().isBefore(s.getStartTime()) &&
                        !endTime.isAfter(s.getEndTime()));

        if (!inSchedule) {
            throw new IllegalArgumentException("El horario seleccionado no pertenece al horario laboral del doctor");
        }

        boolean isTaken = appointmentRepository
                .findByDoctorIdAndDateAndStatusIn(
                        doctor.getId(),
                        request.date(),
                        List.of(AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED)
                ).stream()
                .anyMatch(a ->
                        !(endTime.isBefore(a.getStartTime()) || request.startTime().isAfter(a.getEndTime()))
                );

        if (isTaken) {
            throw new IllegalStateException("El horario seleccionado ya está ocupado");
        }

        // ✅ Crear usando MapStruct
        AppointmentEntity appointment = appointmentMapper.toEntity(request, patient, doctor, duration);
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


}
