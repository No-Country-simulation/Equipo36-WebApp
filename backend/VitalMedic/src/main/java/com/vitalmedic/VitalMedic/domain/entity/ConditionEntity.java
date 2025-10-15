package com.vitalmedic.VitalMedic.domain.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@Data
@Entity
@Table(name = "conditions")
public class ConditionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fhirId;
    private String code;       // Código CIE10 o SNOMED
    private String description;
    private Date startDate;
    private String clinicalStatus; // active, resolved, etc.

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private PatientEntity patient;

}
