package com.vitalmedic.VitalMedic.service;

import com.vitalmedic.VitalMedic.domain.dto.admin.RegisterDoctorRequest;
import com.vitalmedic.VitalMedic.domain.dto.admin.UserResponse;
import com.vitalmedic.VitalMedic.domain.entity.User;
import reactor.core.publisher.Mono;

public interface KeycloakAuthService {

    Mono<UserResponse> createUser(User user);

    Mono<Void> assignRoleToExistingUser(String userId, String roleName);

    Mono<Void> removeRoleFromUser(String keycloakId, String roleName);
}
