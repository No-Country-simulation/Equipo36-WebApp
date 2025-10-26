package com.vitalmedic.VitalMedic.domain.mapper;

import com.vitalmedic.VitalMedic.domain.dto.appointment.AppointmentRequest;
import com.vitalmedic.VitalMedic.domain.dto.appointment.AppointmentResponse;
import com.vitalmedic.VitalMedic.domain.dto.appointment.AppointmentWithDoctorResponse;
import com.vitalmedic.VitalMedic.domain.dto.appointment.AppointmentWithPatientResponse;
import com.vitalmedic.VitalMedic.domain.entity.AppointmentEntity;
import com.vitalmedic.VitalMedic.domain.entity.DoctorEntity;
import com.vitalmedic.VitalMedic.domain.entity.PatientEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {

    @Mapping(target = "doctor", source = "doctor")
    @Mapping(target = "date", source = "request.date")
    @Mapping(target = "startTime", source = "request.startTime")
    @Mapping(target = "endTime", expression = "java(request.startTime().plusMinutes(duration))")
    @Mapping(target = "appointmentType", source = "request.type")
    @Mapping(target = "status", expression = "java(com.vitalmedic.VitalMedic.domain.enums.AppointmentStatus.PENDING)")
    @Mapping(target = "patient", source = "patient")
    @Mapping(target = "id", ignore = true)
    AppointmentEntity toEntity(AppointmentRequest request, PatientEntity patient, DoctorEntity doctor, int duration);

    @Mapping(target = "doctorId", source = "entity.doctor.id")
    @Mapping(target = "status", expression = "java(entity.getStatus().name())")
    @Mapping(target = "type", expression = "java(entity.getAppointmentType().name())")
    @Mapping(target = "meetLink", source = "entity.meetLink")
    AppointmentResponse toResponse(AppointmentEntity entity);


    // 🔹 Mapea una sola entidad a DTO
    @Mappings({
            @Mapping(source = "id", target = "id"),
            @Mapping(source = "appointmentType", target = "type"),
            @Mapping(target = "status", expression = "java(entity.getStatus())"),
            @Mapping(source = "patient", target = "patient")
    })
    AppointmentWithPatientResponse toAppointmentWithPatientResponse(AppointmentEntity entity);

    List<AppointmentWithPatientResponse> toAppointmentWithPatientResponse(List<AppointmentEntity> entities);

    // 🔹 Método auxiliar para mapear el paciente
    @Mappings({
            @Mapping(source = "id", target = "id"),
            @Mapping(source = "firstName", target = "firstName"),
            @Mapping(source = "lastName", target = "lastName")
    })
    AppointmentWithPatientResponse.SimplePatientDto toSimplePatientDto(PatientEntity patient);


    @Mappings({
            @Mapping(source = "id", target = "id"),
            @Mapping(source = "date", target = "date"),
            @Mapping(source = "startTime", target = "startTime"),
            @Mapping(source = "appointmentType", target = "type"),
            @Mapping(target = "status", expression = "java(entity.getStatus())"),
            @Mapping(source = "doctor", target = "doctor")
    })
    AppointmentWithDoctorResponse toAppointmentWithDoctorResponse(AppointmentEntity entity);

    List<AppointmentWithDoctorResponse> toAppointmentWithDoctorResponse(List<AppointmentEntity> entities);

    // 🔹 Método auxiliar para mapear el doctor
    @Mappings({
            @Mapping(source = "id", target = "doctorId"),
            @Mapping(source = "firstName", target = "firstName"),
            @Mapping(source = "lastName", target = "lastName"),
            @Mapping(source = "specialty.name", target = "specialty")
    })
    AppointmentWithDoctorResponse.DoctorSimpleDto toDoctorSimpleDto(DoctorEntity doctor);
}
