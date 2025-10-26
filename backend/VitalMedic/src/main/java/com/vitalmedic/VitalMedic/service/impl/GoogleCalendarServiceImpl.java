package com.vitalmedic.VitalMedic.service.impl;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.*;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.vitalmedic.VitalMedic.domain.dto.appointment.GoogleCalendarEventRequest;
import com.vitalmedic.VitalMedic.domain.dto.appointment.GoogleCalendarEventResponse;
import com.vitalmedic.VitalMedic.domain.enums.AppointmentType;
import com.vitalmedic.VitalMedic.service.GoogleCalendarService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.*;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleCalendarServiceImpl implements GoogleCalendarService {

    private static final String APPLICATION_NAME = "VitalMedic";
    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
    private static final List<String> SCOPES = Collections.singletonList("https://www.googleapis.com/auth/calendar");

    @Override
    public Mono<GoogleCalendarEventResponse> createEvent(GoogleCalendarEventRequest dto) {
        return Mono.fromCallable(() -> buildCalendarService(dto.getAccessToken()))
                .flatMap(service -> insertEvent(service, dto))
                .retryWhen(Retry.backoff(2, Duration.ofSeconds(1))
                        .filter(this::isRetryableException)
                        .onRetryExhaustedThrow((spec, signal) ->
                                new RuntimeException("Error creando evento después de reintentos", signal.failure())))
                .doOnSuccess(response -> log.info("✅ Evento creado en Google Calendar: {}", response.getGoogleEventId()))
                .doOnError(e -> log.error("❌ Error creando evento en Google Calendar: {}", e.getMessage(), e));
    }

    // -------------------------------------- //
    // 🧩 Crear cliente autenticado de Calendar
    // -------------------------------------- //
    private Calendar buildCalendarService(String accessToken) throws GeneralSecurityException, IOException {
        GoogleCredentials credentials = GoogleCredentials.create(
                new AccessToken(accessToken, new Date(System.currentTimeMillis() + 3600 * 1000))
        ).createScoped(SCOPES);

        return new Calendar.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JSON_FACTORY,
                new HttpCredentialsAdapter(credentials)
        ).setApplicationName(APPLICATION_NAME).build();
    }

    // -------------------------------------- //
    // 🩺 Crear y registrar el evento con Meet
    // -------------------------------------- //
    public Mono<GoogleCalendarEventResponse> insertEvent(Calendar service, GoogleCalendarEventRequest dto) {
        return Mono.fromCallable(() -> {
            log.info("🗓️ Creando evento para el doctor {} y paciente {}",
                    dto.getDoctor().getFirstName(), dto.getPatient().getFirstName());

            // 🕓 Fechas
            ZonedDateTime startZdt = LocalDateTime.of(dto.getAppointment().getDate(), dto.getAppointment().getStartTime())
                    .atZone(ZoneId.systemDefault());
            ZonedDateTime endZdt = LocalDateTime.of(dto.getAppointment().getDate(), dto.getAppointment().getEndTime())
                    .atZone(ZoneId.systemDefault());

            EventDateTime start = new EventDateTime()
                    .setDateTime(new DateTime(Date.from(startZdt.toInstant())))
                    .setTimeZone(ZoneId.systemDefault().toString());

            EventDateTime end = new EventDateTime()
                    .setDateTime(new DateTime(Date.from(endZdt.toInstant())))
                    .setTimeZone(ZoneId.systemDefault().toString());

            // 🩺 Título
            String specialtyName = dto.getDoctor().getSpecialty() != null
                    ? dto.getDoctor().getSpecialty().getName()
                    : "General";

            String title = "🏥 VitalMedic – Cita médica (" + specialtyName + ")";

            // 📍 Tipo de consulta
            boolean isVirtual = dto.getAppointment().getAppointmentType() == AppointmentType.VIRTUAL;
            String modalityText = isVirtual
                    ? "💻 <b>Modalidad:</b> Consulta virtual por Google Meet<br>"
                    : "🏥 <b>Modalidad:</b> Consulta presencial en clínica<br><b>Dirección:</b> Av. Salud #123, Ciudad Médica<br>";

            // 📝 Descripción
            String description = """
        <b>Detalles de la cita médica</b><br><br>
        👨‍⚕️ <b>Doctor:</b> %s %s<br>
        👤 <b>Paciente:</b> %s %s<br>
        📅 <b>Fecha:</b> %s<br>
        🕐 <b>Hora:</b> %s - %s<br>
        %s<br>
        <i>VitalMedic - Tu salud en buenas manos</i>
        """.formatted(
                    dto.getDoctor().getFirstName(), dto.getDoctor().getLastName(),
                    dto.getPatient().getFirstName(), dto.getPatient().getLastName(),
                    dto.getAppointment().getDate(),
                    dto.getAppointment().getStartTime(), dto.getAppointment().getEndTime(),
                    modalityText
            );

            Event event = new Event()
                    .setSummary(title)
                    .setDescription(description)
                    .setColorId(isVirtual ? "7" : "2")
                    .setStart(start)
                    .setEnd(end)
                    .setLocation(isVirtual ? "Consulta virtual (Google Meet)" : "Clínica VitalMedic, Av. Salud #123, Ciudad Médica")
                    .setAttendees(List.of(new EventAttendee()
                            .setEmail(dto.getPatient().getUser().getEmail())
                            .setDisplayName(dto.getPatient().getFirstName() + " " + dto.getPatient().getLastName())))
                    .setReminders(new Event.Reminders()
                            .setUseDefault(false)
                            .setOverrides(List.of(
                                    new EventReminder().setMethod("email").setMinutes(60),
                                    new EventReminder().setMethod("popup").setMinutes(15)
                            )));

            // 🎥 Si es virtual → crea enlace de Meet
            if (isVirtual) {
                ConferenceData conferenceData = new ConferenceData()
                        .setCreateRequest(new CreateConferenceRequest()
                                .setRequestId(UUID.randomUUID().toString())
                                .setConferenceSolutionKey(new ConferenceSolutionKey().setType("hangoutsMeet")));
                event.setConferenceData(conferenceData);
            }

            // Propiedades adicionales
            event.setExtendedProperties(new Event.ExtendedProperties()
                    .setPrivate(Map.of(
                            "appointmentId", String.valueOf(dto.getAppointment().getId()),
                            "doctorId", String.valueOf(dto.getDoctor().getId()),
                            "patientId", String.valueOf(dto.getPatient().getId()),
                            "type", dto.getAppointment().getAppointmentType().name()
                    )));

            // ✅ Crear evento
            Event createdEvent = service.events()
                    .insert("primary", event)
                    .setConferenceDataVersion(isVirtual ? 1 : 0)
                    .execute();

            // 🔁 Construir respuesta
            GoogleCalendarEventResponse response = new GoogleCalendarEventResponse();
            response.setGoogleEventId(createdEvent.getId()); // 🔑 este es el importante
            response.setMeetLink(createdEvent.getHangoutLink()); // puede ser null si es presencial

            log.info("✅ Evento creado correctamente: {}", createdEvent.getId());
            if (createdEvent.getHangoutLink() != null) {
                log.info("🔗 Enlace de Google Meet: {}", createdEvent.getHangoutLink());
            }

            return response;
        });
    }

    private boolean isRetryableException(Throwable e) {
        return e instanceof IOException || e instanceof GeneralSecurityException;
    }
}
