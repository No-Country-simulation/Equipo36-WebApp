package com.vitalmedic.VitalMedic.domain.dto.doctor;

import com.vitalmedic.VitalMedic.domain.dto.doctorSchedule.DoctorScheduleResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorSimpleResponse {
    private UUID doctorId;
    private String firstName;
    private String lastName;
    private String specialty;
    private List<DoctorScheduleResponse> weeklySchedules;
}
