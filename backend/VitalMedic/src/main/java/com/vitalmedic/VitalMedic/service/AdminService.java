package com.vitalmedic.VitalMedic.service;

import com.vitalmedic.VitalMedic.domain.dto.admin.RegisterDoctorRequest;
import com.vitalmedic.VitalMedic.domain.dto.admin.RegisterUserRequest;
import org.springframework.transaction.annotation.Transactional;

public interface AdminService {

    void createDoctor(RegisterDoctorRequest request);
}
