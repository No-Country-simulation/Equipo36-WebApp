package com.vitalmedic.VitalMedic.repository;

import com.vitalmedic.VitalMedic.domain.entity.PatientEntity;
import com.vitalmedic.VitalMedic.domain.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PatientRepository extends JpaRepository<PatientEntity, UUID> {

    Optional<PatientEntity> findByUser(User user);

    @Query(value = """
        SELECT p.*
        FROM patients p
        JOIN users u ON u.id = p.id
        WHERE
            unaccent(LOWER(CONCAT(p.first_name, ' ', p.last_name))) LIKE CONCAT('%', unaccent(LOWER(:search)), '%')
            OR unaccent(LOWER(u.email)) LIKE CONCAT('%', unaccent(LOWER(:search)), '%')
        """,
            countQuery = """
        SELECT COUNT(*)
        FROM patients p
        JOIN users u ON u.id = p.id
        WHERE
            unaccent(LOWER(CONCAT(p.first_name, ' ', p.last_name))) LIKE CONCAT('%', unaccent(LOWER(:search)), '%')
            OR unaccent(LOWER(u.email)) LIKE CONCAT('%', unaccent(LOWER(:search)), '%')
        """,
            nativeQuery = true)
    Page<PatientEntity> searchPatients(@Param("search") String search, Pageable pageable);
}
