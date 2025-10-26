package com.vitalmedic.VitalMedic.service;

import com.google.api.services.calendar.Calendar;
import com.vitalmedic.VitalMedic.domain.dto.appointment.GoogleCalendarEventRequest;
import com.vitalmedic.VitalMedic.domain.dto.appointment.GoogleCalendarEventResponse;
import reactor.core.publisher.Mono;

public interface GoogleCalendarService {

    Mono<GoogleCalendarEventResponse> createEvent(GoogleCalendarEventRequest dto);

}
