package com.vitalmedic.VitalMedic.domain.entity;

import com.vitalmedic.VitalMedic.domain.enums.IdentifierSystem;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "patient_identifiers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientIdentifier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IdentifierSystem system;

    @Column(nullable = false, unique = true)
    private String value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;
}

