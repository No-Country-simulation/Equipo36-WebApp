package com.vitalmedic.VitalMedic.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.*;

public class KeycloakRealmRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Map<String, Object> realmAccess = jwt.getClaim("realm_access");
        if (realmAccess == null || realmAccess.isEmpty()) {
            return Collections.emptyList();
        }

        Collection<GrantedAuthority> authorities = new ArrayList<>();
        List<String> roles = (List<String>) realmAccess.get("roles");

        roles.forEach(role -> authorities.add(new SimpleGrantedAuthority("ROLE_" + role)));

        return authorities;
    }
}

