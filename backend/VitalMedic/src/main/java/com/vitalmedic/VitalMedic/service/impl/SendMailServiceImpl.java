package com.vitalmedic.VitalMedic.service.impl;

import com.vitalmedic.VitalMedic.service.SendMailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.Map;

/**
 * Servicio para el envío de correos electrónicos mediante la API de Resend.
 * Renderiza plantillas HTML con Thymeleaf y maneja reintentos automáticos en caso de fallos de red.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SendMailServiceImpl implements SendMailService {

    private final TemplateEngine templateEngine;

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${resend.from-email}")
    private String fromEmail;

    @Value("${resend.from-name}")
    private String fromName;

    private final WebClient client = WebClient.builder()
            .baseUrl("https://api.resend.com")
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();

    /**
     * Envía un correo electrónico renderizando una plantilla HTML con Thymeleaf.
     *
     * @param to           Dirección de correo del destinatario
     * @param subject      Asunto del correo
     * @param templateName Nombre del archivo HTML (ubicado en templates/emails/)
     * @param variables    Variables dinámicas para la plantilla
     * @return Mono<Void> reactivo que completa al enviar el correo
     */
    @Override
    public Mono<Void> sendEmailTemplate(String to, String subject, String templateName, Map<String, Object> variables) {
        // Renderizar HTML con Thymeleaf
        String htmlContent = renderTemplate(templateName, variables);

        // Crear cuerpo del correo
        Map<String, Object> body = Map.of(
                "from", String.format("%s <%s>", fromName, fromEmail),
                "to", to,
                "subject", subject,
                "html", htmlContent
        );

        // Enviar correo con manejo de errores y reintentos
        return client.post()
                .uri("/emails")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .bodyValue(body)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class).flatMap(errorBody -> {
                            log.error("❌ Error HTTP al enviar correo con Resend: {}", errorBody);
                            return Mono.error(new RuntimeException("Resend API error: " + errorBody));
                        })
                )
                .toBodilessEntity()
                .doOnSubscribe(sub -> log.info("📨 Enviando correo a {}", to))
                .doOnSuccess(resp -> log.info("✅ Correo enviado correctamente a {}", to))
                .doOnError(e -> log.warn("⚠️ Error al contactar con Resend: {}", e.getMessage()))
                .retryWhen(
                        Retry.backoff(3, Duration.ofSeconds(2))
                                .maxBackoff(Duration.ofSeconds(8))
                                .filter(ex -> ex instanceof java.net.UnknownHostException ||
                                        ex instanceof org.springframework.web.reactive.function.client.WebClientRequestException)
                                .onRetryExhaustedThrow((retrySpec, retrySignal) ->
                                        new RuntimeException("❌ Fallaron todos los reintentos al enviar correo con Resend", retrySignal.failure()))
                )
                .then();
    }

    /**
     * Renderiza una plantilla HTML usando Thymeleaf.
     *
     * @param templateName Nombre de la plantilla (sin ruta base)
     * @param variables    Variables a inyectar en el contexto
     * @return HTML renderizado
     */
    private String renderTemplate(String templateName, Map<String, Object> variables) {
        Context context = new Context();
        context.setVariables(variables);
        return templateEngine.process("emails/" + templateName, context);
    }
}

