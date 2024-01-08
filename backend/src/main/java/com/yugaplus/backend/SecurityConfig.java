package com.yugaplus.backend;

import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.provisioning.JdbcUserDetailsManager;
// import org.springframework.security.web.SecurityFilterChain;

// @Configuration
// @EnableWebSecurity
public class SecurityConfig {

    // @Bean
    // public UserDetailsService userDetailsService(DataSource dataSource) {
    // return new JdbcUserDetailsManager(dataSource);
    // }

    // https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html
    // SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    // http.authorizeHttpRequests(authz -> authz.requestMatchers("/**").permitAll())
    // .csrf(crsf -> crsf.disable())
    // .cors(cors -> cors.disable());

    // return http.build();
    // }

}
