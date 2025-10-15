package com.vitalmedic.VitalMedic.repository;

import com.vitalmedic.VitalMedic.domain.entity.PatientEntity;
import com.vitalmedic.VitalMedic.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PatientRepository extends JpaRepository<PatientEntity, UUID> {

    Optional<PatientEntity> findByUser(User user);
}
