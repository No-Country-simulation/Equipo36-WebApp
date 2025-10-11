package com.vitalmedic.VitalMedic.repository;

import com.vitalmedic.VitalMedic.domain.entity.PatientIdentifier;
import com.vitalmedic.VitalMedic.domain.enums.IdentifierSystem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientIdentifierRepository extends JpaRepository<PatientIdentifier, Long> {

    Optional<PatientIdentifier> findBySystemAndValue(IdentifierSystem system, String value);
}
