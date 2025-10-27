package com.vitalmedic.VitalMedic.service;

import com.vitalmedic.VitalMedic.domain.dto.chat.ChatMessage;
import com.vitalmedic.VitalMedic.domain.entity.DoctorEntity;
import com.vitalmedic.VitalMedic.domain.entity.PatientEntity;
import com.vitalmedic.VitalMedic.domain.entity.User;
import com.vitalmedic.VitalMedic.repository.DoctorRepository;
import com.vitalmedic.VitalMedic.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatAccessService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public record Room(UUID patientId, UUID doctorId) {}

    public Room parseRoom(String roomId) {
        if (roomId == null || !roomId.contains("_")) {
            throw new IllegalArgumentException("roomId must be 'patientUUID_doctorUUID'");
        }
        String[] parts = roomId.split("_", 2);
        try {
            return new Room(UUID.fromString(parts[0]), UUID.fromString(parts[1]));
        } catch (Exception e) {
            throw new IllegalArgumentException("roomId must contain valid UUIDs");
        }
    }

    public ChatMessage validateAndEnrich(ChatMessage message, User currentUser) {
        Room room = parseRoom(message.getRoomId());

        PatientEntity patient = patientRepository.findById(room.patientId())
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));
        DoctorEntity doctor = doctorRepository.findById(room.doctorId())
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        UUID currentId = currentUser.getId();
        boolean isPatient = patient.getUser() != null && currentId.equals(patient.getUser().getId());
        boolean isDoctor = doctor.getUser() != null && currentId.equals(doctor.getUser().getId());
        if (!isPatient && !isDoctor) {
            throw new SecurityException("User not allowed in this room");
        }

        message.setSenderId(currentId.toString());
        if (isPatient) {
            message.setSenderName(safeFullName(patient.getFirstName(), patient.getLastName()));
        } else {
            message.setSenderName(safeFullName(doctor.getFirstName(), doctor.getLastName()));
        }
        return message;
    }

    private String safeFullName(String first, String last) {
        String f = first == null ? "" : first.trim();
        String l = last == null ? "" : last.trim();
        return (f + " " + l).trim();
    }
}

