package com.yugaplus.backend;

import org.springframework.web.bind.annotation.RestController;

import com.yugaplus.backend.api.Status;
import com.yugaplus.backend.model.User;

import jakarta.servlet.http.HttpServletResponse;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private JdbcClient jdbcClient;

    private record UserResponse(Status status, User user) {
    }

    @Autowired
    public UserController(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    @GetMapping("/authenticated")
    public UserResponse getUserById() {
        Optional<String> user = SecurityConfig.getAuthenticatedUser();

        if (user.isEmpty()) {
            return new UserResponse(new Status(false, HttpServletResponse.SC_UNAUTHORIZED), null);
        }

        String email = user.get();

        User currentUser = jdbcClient.sql(
                "SELECT full_name, user_location FROM user_account WHERE email = ?")
                .param(email).query(User.class).single();

        currentUser.setEmail(email);

        return new UserResponse(new Status(true, HttpServletResponse.SC_OK), currentUser);
    }
}
