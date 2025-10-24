package com.vitalmedic.VitalMedic.repository;

import com.vitalmedic.VitalMedic.domain.entity.AppointmentEntity;
import com.vitalmedic.VitalMedic.domain.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Long> {

    List<AppointmentEntity> findByDoctorIdAndDateAndStatusIn(UUID doctorId, LocalDate date, List<AppointmentStatus> statuses);

    List<AppointmentEntity> findByDoctorIdAndDate(UUID id, LocalDate date);

    List<AppointmentEntity> findByPatientIdAndDate(UUID patientId, LocalDate date);

}
