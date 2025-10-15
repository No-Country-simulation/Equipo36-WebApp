package com.vitalmedic.VitalMedic.service;

import com.vitalmedic.VitalMedic.domain.dto.admin.RegisterDoctorRequest;
import com.vitalmedic.VitalMedic.domain.dto.admin.RegisterDoctorResponse;

public interface AdminService {

    RegisterDoctorResponse createDoctor(RegisterDoctorRequest request);
}
