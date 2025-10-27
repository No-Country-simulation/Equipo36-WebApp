package com.vitalmedic.VitalMedic.controller;

import com.vitalmedic.VitalMedic.domain.dto.chat.ChatMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.Instant;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    // Client sends to: /app/chat.send
    // Broadcast to room subscribers: /topic/chat.{roomId}
    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessage message) {
        if (message == null || message.getRoomId() == null || message.getRoomId().isBlank()) {
            return; // ignore invalid payloads
        }

        message.setTimestamp(Instant.now());
        String destination = "/topic/chat." + message.getRoomId();
        messagingTemplate.convertAndSend(destination, message);
    }
}

