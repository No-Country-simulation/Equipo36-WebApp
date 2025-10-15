package com.vitalmedic.VitalMedic.domain.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
@Entity
@Table(name = "allergies")
public class AllergyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fhirId;
    private String substance;  // Sustancia (ej. Penicilina)
    private String reaction;   // Reacción (ej. Rash cutáneo)
    private String severity;   // Leve, Moderada, Grave
    private String criticality;
    private String reactionDescription;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private PatientEntity patient;

}
