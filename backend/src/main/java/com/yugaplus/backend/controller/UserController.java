package com.yugaplus.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.yugaplus.backend.api.MovieResponse;
import com.yugaplus.backend.api.Status;
import com.yugaplus.backend.api.UserResponse;
import com.yugaplus.backend.config.SecurityConfig;
import com.yugaplus.backend.config.UserRecord;
import com.yugaplus.backend.model.Movie;
import com.yugaplus.backend.model.User;

import jakarta.servlet.http.HttpServletResponse;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private JdbcClient jdbcClient;

    @Autowired
    public UserController(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    @GetMapping("/authenticated")
    public UserResponse getUserById() {
        UserRecord authUser = SecurityConfig.getAuthenticatedUser().get();

        User user = jdbcClient.sql(
                "SELECT full_name, user_location FROM user_account WHERE email = ?")
                .param(authUser.getUsername()).query(User.class).single();

        user.setEmail(authUser.getUsername());

        return new UserResponse(new Status(true, HttpServletResponse.SC_OK), user);
    }

    @GetMapping("/history")
    public MovieResponse getUserHistory() {
        UserRecord authUser = SecurityConfig.getAuthenticatedUser().get();

        List<Movie> movies = jdbcClient.sql(
                "SELECT title FROM movie WHERE id in (SELECT movie_id FROM user_history WHERE user_id = ?)")
                .param(authUser.getUserId()).query(Movie.class).list();

        return new MovieResponse(new Status(true, HttpServletResponse.SC_OK), movies);
    }
}
