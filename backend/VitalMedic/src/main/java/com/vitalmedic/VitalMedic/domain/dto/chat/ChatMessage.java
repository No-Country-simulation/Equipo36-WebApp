package com.vitalmedic.VitalMedic.domain.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    public enum Type { CHAT, JOIN, LEAVE }

    private String roomId;        // Identifier for doctor-patient room
    private String senderId;      // User ID of sender
    private String senderName;    // Optional display name
    private String content;       // Message text
    private Instant timestamp;    // Server timestamp
    private Type type;            // Message type
}

