package com.vitalmedic.VitalMedic.domain.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@Data
@Entity
@Table(name = "appointments")
public class AppointmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fhirId;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
    private String status; // booked, arrived, fulfilled
    private String reason;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private PatientEntity patient;
}
