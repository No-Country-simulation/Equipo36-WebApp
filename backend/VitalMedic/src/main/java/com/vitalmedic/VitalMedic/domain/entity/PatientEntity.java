package com.vitalmedic.VitalMedic.domain.entity;

import com.vitalmedic.VitalMedic.domain.enums.Gender;
import com.vitalmedic.VitalMedic.domain.enums.OnboardingStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@Data
@Entity
@Table(name = "patients")
public class PatientEntity {

    @Id
    private UUID id;

    @Column(length = 100)
    private String firstName;

    @Column(length = 100)
    private String lastName;

    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    Gender gender;

    @Column(length = 20)
    private String phone;

    private String address;

    private String photoPublicId;
    private String photoUrl;

    @Enumerated(EnumType.STRING)
    private OnboardingStatus onboardingStatus = OnboardingStatus.PENDING_IDENTIFIER;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PatientIdentifierEntity> identifiers;

    private Boolean importedFromFhir;
    private String fhirId;

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
