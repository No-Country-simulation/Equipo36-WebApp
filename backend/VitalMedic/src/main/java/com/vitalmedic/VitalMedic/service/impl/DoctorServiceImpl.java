package com.vitalmedic.VitalMedic.service.impl;

import com.vitalmedic.VitalMedic.domain.dto.appointment.AvailableDateResponse;
import com.vitalmedic.VitalMedic.domain.dto.doctor.*;
import com.vitalmedic.VitalMedic.domain.entity.AppointmentEntity;
import com.vitalmedic.VitalMedic.domain.entity.DoctorEntity;
import com.vitalmedic.VitalMedic.domain.entity.DoctorSchedule;
import com.vitalmedic.VitalMedic.domain.entity.Specialty;
import com.vitalmedic.VitalMedic.domain.enums.AppointmentStatus;
import com.vitalmedic.VitalMedic.domain.enums.AvailabilityStatus;
import com.vitalmedic.VitalMedic.domain.enums.WeekDay;
import com.vitalmedic.VitalMedic.domain.mapper.DoctorMapper;
import com.vitalmedic.VitalMedic.exception.ResourceNotFoundException;
import com.vitalmedic.VitalMedic.repository.AppointmentRepository;
import com.vitalmedic.VitalMedic.repository.DoctorRepository;
import com.vitalmedic.VitalMedic.repository.DoctorScheduleRepository;
import com.vitalmedic.VitalMedic.repository.SpecialtyRepository;
import com.vitalmedic.VitalMedic.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final DoctorMapper doctorMapper;

    private final SpecialtyRepository specialtyRepository;

    private final AppointmentRepository appointmentRepository;

    private final DoctorScheduleRepository scheduleRepository;

    @Override
    public DoctorEntity createDoctor(DoctorEntity doctor) {
        return doctorRepository.save(doctor);
    }

    @Override
    public DoctorEntity getDoctorById(UUID id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor no encontrado con id: " + id));
    }

    @Override
    public List<DoctorEntity> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public DoctorEntity updateDoctor(UUID id, DoctorUpdateDTO dto) {
        DoctorEntity existingDoctor = getDoctorById(id);
        // 🧠 Aquí usamos MapStruct en lugar de setters manuales
        doctorMapper.updateDoctorFromDto(dto, existingDoctor);

        Specialty specialty = specialtyRepository.findById(dto.specialty())
                .orElseThrow(()->new ResourceNotFoundException("Especialidad con id "+ dto.specialty() + " no encontrado"));
        existingDoctor.setSpecialty(specialty);

        return doctorRepository.save(existingDoctor);
    }

    @Override
    public void deleteDoctor(UUID id) {
        DoctorEntity doctor = getDoctorById(id);
        doctorRepository.delete(doctor);
    }

    @Override
    public DoctorAvailabilityResponse getDoctorAvailability(UUID doctorId, LocalDate date) {
        DoctorEntity doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor no encontrado"));

        int duration = doctor.getSpecialty().getAverageDurationMinutes();
        WeekDay dayOfWeek = WeekDay.fromJavaWeekDay(date.getDayOfWeek());

        List<DoctorSchedule> schedules = scheduleRepository
                .findByDoctorIdAndDayOfWeekAndActive(doctorId, dayOfWeek, true);

        List<AppointmentEntity> appointments = appointmentRepository
                .findByDoctorIdAndDateAndStatusIn(
                        doctorId,
                        date,
                        List.of(AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED)
                );

        List<DoctorSlotResponse> slots = new ArrayList<>();

        for (DoctorSchedule schedule : schedules) {
            LocalTime slotStart = schedule.getStartTime();
            LocalTime scheduleEnd = schedule.getEndTime();

            while (!slotStart.plusMinutes(duration).isAfter(scheduleEnd)) {
                LocalTime currentStart = slotStart;
                LocalTime currentEnd = slotStart.plusMinutes(duration);

                boolean isTaken = appointments.stream().anyMatch(appt ->
                        currentStart.isBefore(appt.getEndTime()) &&
                                currentEnd.isAfter(appt.getStartTime())
                );

                slots.add(new DoctorSlotResponse(currentStart, currentEnd, !isTaken));
                slotStart = slotStart.plusMinutes(duration);
            }
        }

        slots.sort(Comparator.comparing(DoctorSlotResponse::startTime));

        return new DoctorAvailabilityResponse(date, slots);
    }

    @Override
    public List<DoctorSimpleResponse> getDoctorsBySpecialty(Long id) {
        Specialty specialty = specialtyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró alguna especialidad con id " + id));

        List<DoctorEntity> doctors = doctorRepository.findBySpecialty(specialty);

        return doctorMapper.toDoctorSimpleRequestList(doctors);
    }

    @Override
    public List<AvailableDateResponse> getAvailableDates(UUID doctorId, int daysAhead) {
        DoctorEntity doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor no encontrado"));

        List<AvailableDateResponse> result = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 0; i < daysAhead; i++) {
            LocalDate date = today.plusDays(i);
            WeekDay weekDay = WeekDay.fromJavaWeekDay(date.getDayOfWeek());

            List<DoctorSchedule> schedules = scheduleRepository.findByDoctorIdAndDayOfWeekAndActive(doctorId, weekDay, true);

            if (schedules.isEmpty()) {
                // No trabaja ese día, lo saltamos
                continue;
            }

            // Obtenemos todas las citas del doctor en esa fecha
            List<AppointmentEntity> appointments = appointmentRepository.findByDoctorIdAndDateAndStatusIn(
                    doctorId,
                    date,
                    List.of(AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED)
            );

            int totalSlots = 0;
            int occupiedSlots = 0;

            for (DoctorSchedule schedule : schedules) {
                int durationMinutes = doctor.getSpecialty().getAverageDurationMinutes();
                LocalTime slotStart = schedule.getStartTime();
                LocalTime scheduleEnd = schedule.getEndTime();

                while (!slotStart.plusMinutes(durationMinutes).isAfter(scheduleEnd)) {
                    LocalTime slotEnd = slotStart.plusMinutes(durationMinutes);
                    totalSlots++;

                    final LocalTime slotStartFinal = slotStart;
                    boolean isOccupied = appointments.stream().anyMatch(a ->
                            !(slotEnd.isBefore(a.getStartTime()) || slotStartFinal.isAfter(a.getEndTime()))
                    );

                    if (isOccupied) occupiedSlots++;

                    slotStart = slotEnd; // siguiente bloque
                }
            }

            AvailabilityStatus status;
            if (occupiedSlots == 0) {
                status = AvailabilityStatus.AVAILABLE;
            } else if (occupiedSlots >= totalSlots) {
                status = AvailabilityStatus.FULL;
            } else {
                status = AvailabilityStatus.PARTIAL;
            }

            result.add(new AvailableDateResponse(date, status));
        }

        return result;
    }


    //------------ Metodos Auxiliares----------------
    private List<LocalTime> generateTimeSlots(LocalTime start, LocalTime end, int durationMinutes) {
        List<LocalTime> slots = new ArrayList<>();
        LocalTime current = start;
        while (!current.plusMinutes(durationMinutes).isAfter(end)) {
            slots.add(current);
            current = current.plusMinutes(durationMinutes);
        }
        return slots;
    }

    private boolean isSlotTaken(LocalTime slotStart, int durationMinutes, List<DoctorSchedule> appointments) {
        LocalTime slotEnd = slotStart.plusMinutes(durationMinutes);
        for (DoctorSchedule appt : appointments) {
            if (!slotEnd.isBefore(appt.getStartTime()) && !slotStart.isAfter(appt.getEndTime())) {
                return true; // se solapa con cita existente
            }
        }
        return false;
    }
}
