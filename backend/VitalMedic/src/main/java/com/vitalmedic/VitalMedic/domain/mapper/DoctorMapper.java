package com.vitalmedic.VitalMedic.domain.mapper;

import com.vitalmedic.VitalMedic.domain.dto.doctor.DoctorResponseDTO;
import com.vitalmedic.VitalMedic.domain.dto.doctor.DoctorSimpleResponse;
import com.vitalmedic.VitalMedic.domain.dto.doctor.DoctorUpdateDTO;
import com.vitalmedic.VitalMedic.domain.dto.admin.RegisterDoctorRequest;
import com.vitalmedic.VitalMedic.domain.dto.admin.RegisterDoctorResponse;
import com.vitalmedic.VitalMedic.domain.dto.doctorSchedule.DoctorScheduleResponse;
import com.vitalmedic.VitalMedic.domain.dto.doctorSchedule.TimeBlockResponse;
import com.vitalmedic.VitalMedic.domain.entity.DoctorEntity;
import com.vitalmedic.VitalMedic.domain.entity.DoctorSchedule;
import com.vitalmedic.VitalMedic.domain.enums.WeekDay;
import org.mapstruct.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface DoctorMapper {

    // Mapeo de request de creación a entidad
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "specialty", ignore = true)
    DoctorEntity toDoctor(RegisterDoctorRequest request);

    // Mapeo de entidad a response después de crear doctor
    @Mapping(target = "specialty", source = "specialty.name")
    RegisterDoctorResponse toRegisterDoctorResponse(DoctorEntity doctor);

    //  Mapeo de entidad a DTO para retornar al frontend
    @Mapping(source = "user.email", target = "email")
    @Mapping(source = "specialty.name", target = "specialty")
    DoctorResponseDTO toDoctorResponseDTO(DoctorEntity doctor);

    // Actualizar entidad a partir del DTO de actualización
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "specialty", ignore = true)
    void updateDoctorFromDto(DoctorUpdateDTO dto, @MappingTarget DoctorEntity entity);


    @Mapping(target = "doctorId", source = "id")
    @Mapping(target = "specialty", source = "specialty.name")
    @Mapping(target = "weeklySchedules", ignore = true)
    DoctorSimpleResponse toDoctorSimpleRequest(DoctorEntity doctor);

    /**
     * Mapea una lista de entidades Doctor a una lista de DTOs DoctorSimpleRequest.
     */
    List<DoctorSimpleResponse> toDoctorSimpleRequestList(List<DoctorEntity> doctors);

    /**
     * Agrupa los horarios por día y los asigna al DTO después del mapeo.
     */
    @AfterMapping
    default void groupSchedulesByDay(DoctorEntity doctor, @MappingTarget DoctorSimpleResponse target) {
        Map<WeekDay, List<DoctorSchedule>> groupedSchedules = doctor.getSchedules()
                .stream()
                .collect(Collectors.groupingBy(DoctorSchedule::getDayOfWeek));

        List<DoctorScheduleResponse> weeklySchedules = groupedSchedules.entrySet().stream()
                .map(entry -> new DoctorScheduleResponse(
                        entry.getKey(),
                        entry.getValue().stream()
                                .map(schedule -> new TimeBlockResponse(
                                        schedule.getId(),
                                        schedule.getStartTime(),
                                        schedule.getEndTime(),
                                        schedule.isActive()
                                ))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());

        try {
            var field = DoctorSimpleResponse.class.getDeclaredField("weeklySchedules");
            field.setAccessible(true);
            field.set(target, weeklySchedules);
        } catch (Exception e) {
            throw new RuntimeException("Error setting weeklySchedules", e);
        }
    }

    /**
     * Aplica la lógica de @AfterMapping a listas completas.
     */
    @AfterMapping
    default void afterMappingList(List<DoctorEntity> doctors, @MappingTarget List<DoctorSimpleResponse> targets) {
        for (int i = 0; i < doctors.size(); i++) {
            groupSchedulesByDay(doctors.get(i), targets.get(i));
        }
    }
}
