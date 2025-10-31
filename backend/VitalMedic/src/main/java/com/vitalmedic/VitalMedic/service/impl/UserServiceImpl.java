package com.vitalmedic.VitalMedic.service.impl;

import com.vitalmedic.VitalMedic.domain.dto.keycloak.PayloadDto;
import com.vitalmedic.VitalMedic.domain.entity.User;
import com.vitalmedic.VitalMedic.domain.enums.Role;
import com.vitalmedic.VitalMedic.domain.mapper.UserMapper;
import com.vitalmedic.VitalMedic.repository.UserRepository;
import com.vitalmedic.VitalMedic.service.KeycloakAuthService;
import com.vitalmedic.VitalMedic.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    private final KeycloakAuthService keycloakAuthService;

    @Transactional
    @Override
    public void syncUserFromKeycloak(PayloadDto payload) {
        Optional<User> optionalUser = userRepository.findByEmail(payload.email());

        if(optionalUser.isEmpty()){
            User newUser = userMapper.toUser(payload);
            newUser.setRole(Role.PATIENT);
            userRepository.save(newUser);
            keycloakAuthService.assignRoleToExistingUser(payload.id().toString(),Role.ONBOARDING_PENDING.name()).block();

        }
        else {
            User existingUser = optionalUser.get();
            existingUser.setKeycloakId(payload.id());
            userRepository.save(existingUser);
        }

    }
}
