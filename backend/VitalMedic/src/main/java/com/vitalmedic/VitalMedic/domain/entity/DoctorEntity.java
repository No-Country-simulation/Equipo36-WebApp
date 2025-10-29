package com.vitalmedic.VitalMedic.domain.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@Data
@Entity
@Table(name = "doctors")
public class DoctorEntity {

    @Id
    @GeneratedValue
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(length = 100)
    private String firstName;

    @Column(length = 100)
    private String lastName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialty_id", nullable = false)
    private Specialty specialty;

    @Column(length = 50, nullable = false)
    private String licenseNumber;

    @Column(columnDefinition = "TEXT")
    private String experience;

    @Column(length = 20)
    private String phone;

    private String photoPublicId;
    private String photoUrl;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<DoctorSchedule> schedules = new ArrayList<>();

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<AppointmentEntity> appointments = new ArrayList<>();

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    public void setPhotoUrlAndPublicId(String url, String publicId) {
        this.photoUrl = url;
        this.photoPublicId = publicId;
    }

    public void clearPhoto() {
        this.photoUrl = null;
        this.photoPublicId = null;
    }

}
