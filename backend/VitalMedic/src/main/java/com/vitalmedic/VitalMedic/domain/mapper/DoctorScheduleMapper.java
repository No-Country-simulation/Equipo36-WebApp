package com.vitalmedic.VitalMedic.domain.mapper;

import ch.qos.logback.core.model.ComponentModel;
import com.vitalmedic.VitalMedic.domain.dto.doctorSchedule.DoctorScheduleRequest;
import com.vitalmedic.VitalMedic.domain.dto.doctorSchedule.TimeBlockRequest;
import com.vitalmedic.VitalMedic.domain.dto.doctorSchedule.TimeBlockResponse;
import com.vitalmedic.VitalMedic.domain.entity.DoctorEntity;
import com.vitalmedic.VitalMedic.domain.entity.DoctorSchedule;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DoctorScheduleMapper {

    @Mapping(target = "doctor", source = "doctor")
    @Mapping(target = "dayOfWeek", source = "dayRequest.weekDay")
    @Mapping(target = "startTime", source = "block.startTime")
    @Mapping(target = "endTime", source = "block.endTime")
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "id", ignore = true)
    DoctorSchedule toEntity(DoctorScheduleRequest dayRequest, TimeBlockRequest block, DoctorEntity doctor);


    TimeBlockResponse toTimeBlockResponse(DoctorSchedule entity);


}
