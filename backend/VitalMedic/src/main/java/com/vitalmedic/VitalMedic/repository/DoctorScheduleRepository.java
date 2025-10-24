package com.vitalmedic.VitalMedic.repository;

import com.vitalmedic.VitalMedic.domain.entity.DoctorEntity;
import com.vitalmedic.VitalMedic.domain.entity.DoctorSchedule;
import com.vitalmedic.VitalMedic.domain.enums.WeekDay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule,Long> {

    List<DoctorSchedule> findByDoctor(DoctorEntity doctor);

    List<DoctorSchedule> findByDoctorId(UUID doctorId);

    List<DoctorSchedule> findByDoctorIdAndDayOfWeekAndActive(UUID doctorId, WeekDay dayOfWeek, boolean active);

}
