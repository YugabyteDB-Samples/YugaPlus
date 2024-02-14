package com.yugaplus.backend.config;

import java.util.Collection;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

public class UserRecord extends User {
    private UUID userId;
    private String userLocation;

    public UserRecord(String username, String password, Collection<? extends GrantedAuthority> authorities,
            UUID userId) {
        super(username, password, authorities);
        this.userId = userId;
    }

    public UserRecord(String username, String password, String userLocation, boolean enabled, boolean accountNonExpired,
            boolean credentialsNonExpired, boolean accountNonLocked,
            Collection<? extends GrantedAuthority> authorities, UUID userId) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
        this.userId = userId;
        this.userLocation = userLocation;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getUserLocation() {
        return userLocation;
    }
}
