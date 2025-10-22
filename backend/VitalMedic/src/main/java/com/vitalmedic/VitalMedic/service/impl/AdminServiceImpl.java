package com.vitalmedic.VitalMedic.service.impl;

import com.vitalmedic.VitalMedic.domain.dto.admin.RegisterDoctorRequest;
import com.vitalmedic.VitalMedic.domain.dto.admin.RegisterDoctorResponse;
import com.vitalmedic.VitalMedic.domain.entity.DoctorEntity;
import com.vitalmedic.VitalMedic.domain.entity.Specialty;
import com.vitalmedic.VitalMedic.domain.entity.User;
import com.vitalmedic.VitalMedic.domain.enums.Role;
import com.vitalmedic.VitalMedic.domain.mapper.DoctorMapper;
import com.vitalmedic.VitalMedic.domain.mapper.UserMapper;
import com.vitalmedic.VitalMedic.exception.ResourceNotFoundException;
import com.vitalmedic.VitalMedic.repository.DoctorRepository;
import com.vitalmedic.VitalMedic.repository.SpecialtyRepository;
import com.vitalmedic.VitalMedic.repository.UserRepository;
import com.vitalmedic.VitalMedic.service.AdminService;
import com.vitalmedic.VitalMedic.service.KeycloakAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    private final DoctorRepository doctorRepository;
    private final DoctorMapper doctorMapper;

    private final SpecialtyRepository specialtyRepository;

    private final KeycloakAuthService keycloakAuthService;

    @Override
    @Transactional
    public RegisterDoctorResponse createDoctor(RegisterDoctorRequest request) {

        User user = userMapper.toUser(request);
        user.setRole(Role.DOCTOR);
        user.setUsername(request.email());
        userRepository.save(user);

        Specialty specialty = specialtyRepository.findById(request.specialty())
                .orElseThrow(()->new ResourceNotFoundException("Especialidad con id "+ request.specialty() + " no encontrado"));

        DoctorEntity doctorEntity = doctorMapper.toDoctor(request);
        doctorEntity.setSpecialty(specialty);
        doctorEntity.setUser(user);

        doctorRepository.save(doctorEntity);

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                keycloakAuthService.createUser(user).block();
            }
        });

        return doctorMapper.toRegisterDoctorResponse(doctorEntity);

    }

}
