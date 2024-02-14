package com.yugaplus.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import jakarta.servlet.http.HttpServletResponse;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.sql.DataSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    UserDetailsManager users(DataSource dataSource) {
        JdbcUserDetailsManager jdbcManager = new JdbcUserDetailsManager(dataSource) {
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                try (Connection connection = dataSource.getConnection()) {
                    PreparedStatement userStatement = connection.prepareStatement(
                            "SELECT id, password, user_location FROM user_account WHERE email = ?");
                    userStatement.setString(1, username);

                    ResultSet rs = userStatement.executeQuery();

                    if (rs.next()) {
                        List<GrantedAuthority> authorities = Collections
                                .singletonList(new SimpleGrantedAuthority("USER"));

                        return new UserRecord(
                                username,
                                rs.getString("password"),
                                rs.getString("user_location"),
                                true,
                                true,
                                true,
                                true,
                                authorities,
                                (UUID) rs.getObject("id"));
                    } else {
                        throw new UsernameNotFoundException("User not found");
                    }
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
            }
        };

        return jdbcManager;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests((authorizeRequests) -> authorizeRequests
                .anyRequest().permitAll())
                .formLogin(formLogin -> formLogin
                        .loginPage("/api/login")
                        .usernameParameter("username")
                        .passwordParameter("password")
                        .successHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);

                            PrintWriter writer = response.getWriter();
                            response.setContentType("application/json");
                            response.setCharacterEncoding("UTF-8");
                            writer.print("{\"success\": true, \"message\": \"Login successful\"}");
                            writer.flush();
                        })
                        .failureHandler((request, response, exception) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

                            PrintWriter writer = response.getWriter();
                            response.setContentType("application/json");
                            response.setCharacterEncoding("UTF-8");
                            writer.print("{\"success\": false, \"message\": \"Login failed\"}");
                            writer.flush();
                        }))
                .logout(logout -> logout
                        .logoutUrl("/api/logout") // The URL that triggers logout
                        .invalidateHttpSession(true) // Invalidates the HttpSession
                        .deleteCookies("JSESSIONID") // Deletes the JSESSIONID cookie
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);

                            PrintWriter writer = response.getWriter();
                            response.setContentType("application/json");
                            response.setCharacterEncoding("UTF-8");
                            writer.print("{\"success\": true, \"message\": \"Logout successful\"}");
                            writer.flush();
                        }))
                .cors(cors -> {
                })
                .csrf(crsf -> crsf.disable());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public static Optional<UserRecord> getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication instanceof AnonymousAuthenticationToken) {
            return Optional.empty();
        }

        return Optional.of((UserRecord) authentication.getPrincipal());
    }
}