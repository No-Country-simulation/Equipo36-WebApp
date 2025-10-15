package com.vitalmedic.VitalMedic.domain.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@NoArgsConstructor
@Data
@Entity
@Table(name = "medications")
public class MedicationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fhirId;
    private String medicationName;       // Ej. "Paracetamol 500mg"
    private String dosage;     // Ej. "1 tableta cada 8 horas"
    private String status;     // active, stopped
    private Date effectiveDate;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private PatientEntity patient;

}
