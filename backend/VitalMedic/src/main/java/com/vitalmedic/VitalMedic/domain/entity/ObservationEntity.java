package com.vitalmedic.VitalMedic.domain.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@Data
@Entity
@Table(name = "observations")
public class ObservationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fhirId;
    private String code;        // Ej. "Heart rate", "Glucose"
    private String value;       // Ej. "120/80 mmHg", "90 mg/dL"
    private String unit;        // Ej. "mmHg", "mg/dL"
    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private PatientEntity patient;
}
