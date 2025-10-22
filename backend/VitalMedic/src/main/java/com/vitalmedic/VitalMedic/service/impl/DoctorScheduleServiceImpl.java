package com.vitalmedic.VitalMedic.service.impl;

import com.vitalmedic.VitalMedic.domain.dto.doctorSchedule.*;
import com.vitalmedic.VitalMedic.domain.entity.DoctorEntity;
import com.vitalmedic.VitalMedic.domain.entity.DoctorSchedule;
import com.vitalmedic.VitalMedic.domain.enums.WeekDay;
import com.vitalmedic.VitalMedic.domain.mapper.DoctorScheduleMapper;
import com.vitalmedic.VitalMedic.exception.ScheduleConflictException;
import com.vitalmedic.VitalMedic.repository.DoctorRepository;
import com.vitalmedic.VitalMedic.repository.DoctorScheduleRepository;
import com.vitalmedic.VitalMedic.service.DoctorScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorScheduleServiceImpl implements DoctorScheduleService {

    private final DoctorScheduleRepository scheduleRepository;
    private final DoctorScheduleMapper scheduleMapper;

    private final DoctorRepository doctorRepository;


    @Override
    public DoctorSchedulesResponse getDoctorSchedules(UUID doctorId) {
        DoctorEntity doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor no encontrado"));

        // Obtenemos los horarios activos del doctor
        List<DoctorSchedule> schedules = scheduleRepository.findByDoctorId(doctor.getId()).stream()
                .filter(DoctorSchedule::isActive)
                .toList();

        // Agrupamos por día y convertimos al formato esperado
        List<DoctorScheduleResponse> grouped = schedules.stream()
                .collect(Collectors.groupingBy(DoctorSchedule::getDayOfWeek))
                .entrySet().stream()
                .map(entry -> new DoctorScheduleResponse(
                        entry.getKey(),
                        entry.getValue().stream()
                                .map(scheduleMapper::toTimeBlockResponse)
                                .toList()
                ))
                .sorted(Comparator.comparing(r -> r.weekDay().ordinal()))
                .toList();

        return new DoctorSchedulesResponse(grouped);
    }

    @Override
    public DoctorSchedulesResponse createDoctorSchedules(UUID doctorId, DoctorSchedulesRequest request) {
        DoctorEntity doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor no encontrado"));

        validateNoOverlaps(doctorId ,request);

        List<DoctorSchedule> schedulesToSave = request.weeklySchedules().stream()
                .flatMap(day -> day.timeBlocks().stream()
                        .map(block -> scheduleMapper.toEntity(day, block, doctor)))
                .toList();

        List<DoctorSchedule> savedSchedules = scheduleRepository.saveAll(schedulesToSave);

        List<DoctorScheduleResponse> grouped = savedSchedules.stream()
                .collect(Collectors.groupingBy(DoctorSchedule::getDayOfWeek))
                .entrySet().stream()
                .map(entry -> new DoctorScheduleResponse(
                        entry.getKey(),
                        entry.getValue().stream()
                                .map(scheduleMapper::toTimeBlockResponse)
                                .toList()
                ))
                .toList();

        return new DoctorSchedulesResponse(grouped);
    }

    @Override
    public DoctorSchedulesResponse updateDoctorSchedules(UUID doctorId, DoctorSchedulesRequest request) {
        DoctorEntity doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor no encontrado"));

        // 1️⃣ Validar que no haya solapamientos internos ni con BD
        validateNoOverlaps(doctorId, request);

        // 2️⃣ Desactivar horarios actuales (en lugar de borrarlos)
        List<DoctorSchedule> currentSchedules = scheduleRepository.findByDoctorId(doctorId);
        currentSchedules.forEach(schedule -> schedule.setActive(false));
        scheduleRepository.saveAll(currentSchedules);

        // 3️⃣ Crear los nuevos horarios desde el request
        List<DoctorSchedule> newSchedules = request.weeklySchedules().stream()
                .flatMap(day -> day.timeBlocks().stream()
                        .map(block -> scheduleMapper.toEntity(day, block, doctor)))
                .toList();

        List<DoctorSchedule> savedSchedules = scheduleRepository.saveAll(newSchedules);

        // 4️⃣ Armar la respuesta agrupada como en create
        List<DoctorScheduleResponse> grouped = savedSchedules.stream()
                .collect(Collectors.groupingBy(DoctorSchedule::getDayOfWeek))
                .entrySet().stream()
                .map(entry -> new DoctorScheduleResponse(
                        entry.getKey(),
                        entry.getValue().stream()
                                .map(scheduleMapper::toTimeBlockResponse)
                                .toList()
                ))
                .sorted(Comparator.comparing(r -> r.weekDay().ordinal()))
                .toList();

        return new DoctorSchedulesResponse(grouped);
    }




// ------------------ Metodos auxiliares ------------------------------
    private void validateNoOverlaps(UUID doctorId, DoctorSchedulesRequest request) {
        // 1️⃣ Obtenemos todos los horarios actuales del doctor
        List<DoctorSchedule> existingSchedules = scheduleRepository.findByDoctorId(doctorId);

        for (DoctorScheduleRequest daySchedule : request.weeklySchedules()) {
            WeekDay day = daySchedule.weekDay();

            // Filtramos los ya existentes para ese día
            List<DoctorSchedule> existingDaySchedules = existingSchedules.stream()
                    .filter(s -> s.getDayOfWeek() == day && s.isActive())
                    .toList();

            // 🔹 Validar entre los bloques nuevos
            List<TimeBlockRequest> newBlocks = daySchedule.timeBlocks().stream()
                    .sorted(Comparator.comparing(TimeBlockRequest::startTime))
                    .toList();

            for (int i = 0; i < newBlocks.size() - 1; i++) {
                LocalTime currentEnd = newBlocks.get(i).endTime();
                LocalTime nextStart = newBlocks.get(i + 1).startTime();

                if (!nextStart.isAfter(currentEnd)) {
                    throw new ScheduleConflictException(String.format(
                            "Conflicto interno en %s: %s-%s se solapa con %s-%s",
                            day,
                            newBlocks.get(i).startTime(),
                            newBlocks.get(i).endTime(),
                            nextStart,
                            newBlocks.get(i + 1).endTime()
                    ));
                }
            }

            // 🔹 Validar contra los bloques existentes en BD
            for (TimeBlockRequest newBlock : newBlocks) {
                for (DoctorSchedule existing : existingDaySchedules) {
                    if (blocksOverlap(existing.getStartTime(), existing.getEndTime(),
                            newBlock.startTime(), newBlock.endTime())) {
                        throw new ScheduleConflictException(String.format(
                                "Conflicto con horario existente en %s: el nuevo bloque %s-%s se solapa con el existente %s-%s",
                                day,
                                newBlock.startTime(),
                                newBlock.endTime(),
                                existing.getStartTime(),
                                existing.getEndTime()
                        ));
                    }
                }
            }
        }
    }

    private boolean blocksOverlap(LocalTime start1, LocalTime end1, LocalTime start2, LocalTime end2) {
        return !start2.isAfter(end1) && !end2.isBefore(start1);
    }

}
