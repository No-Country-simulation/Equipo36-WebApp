package com.vitalmedic.VitalMedic.domain.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@NoArgsConstructor
@Data
@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(length = 100)
    private String firstName;

    @Column(length = 100)
    private String lastName;

    @Column(length = 100, nullable = false)
    private String specialty;

    @Column(length = 50, nullable = false)
    private String licenseNumber;

    @Column(columnDefinition = "TEXT")
    private String experience;

    @Column(length = 20)
    private String phone;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

}
