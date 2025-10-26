package com.vitalmedic.VitalMedic.domain.dto.appointment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GoogleCalendarEventResponse {
        private String googleEventId;
        private String meetLink;
}
