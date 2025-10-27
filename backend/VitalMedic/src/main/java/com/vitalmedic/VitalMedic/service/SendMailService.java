package com.vitalmedic.VitalMedic.service;

import reactor.core.publisher.Mono;

import java.util.Map;

public interface SendMailService {
    Mono<Void> sendEmailTemplate(String to, String subject, String templateName, Map<String, Object> variables);
}
