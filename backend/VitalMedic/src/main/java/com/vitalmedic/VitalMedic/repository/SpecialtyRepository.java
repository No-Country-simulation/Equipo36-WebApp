package com.vitalmedic.VitalMedic.repository;

import com.vitalmedic.VitalMedic.domain.entity.Specialty;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpecialtyRepository extends JpaRepository<Specialty,Long> {
}
