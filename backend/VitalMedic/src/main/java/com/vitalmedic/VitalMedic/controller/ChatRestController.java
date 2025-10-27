package com.vitalmedic.VitalMedic.controller;

import com.vitalmedic.VitalMedic.domain.dto.chat.ChatMessage;
import com.vitalmedic.VitalMedic.domain.entity.User;
import com.vitalmedic.VitalMedic.security.CurrentUserProvider;
import com.vitalmedic.VitalMedic.service.ChatAccessService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatRestController {

    private final SimpMessagingTemplate messagingTemplate;
    private final CurrentUserProvider currentUserProvider;
    private final ChatAccessService chatAccessService;

    @PostMapping("/send")
    public ResponseEntity<?> send(@RequestBody ChatMessage message) {
        try {
            if (message == null || message.getRoomId() == null || message.getRoomId().isBlank()) {
                return ResponseEntity.badRequest().body("roomId required");
            }

            if (message.getTimestamp() == null) {
                message.setTimestamp(Instant.now());
            }
            if (message.getType() == null) {
                message.setType(ChatMessage.Type.CHAT);
            }

            User current = currentUserProvider.getCurrentUserOrThrow();
            ChatMessage enriched = chatAccessService.validateAndEnrich(message, current);

            String destination = "/topic/chat." + enriched.getRoomId();
            messagingTemplate.convertAndSend(destination, enriched);
            return ResponseEntity.accepted().body(enriched);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
