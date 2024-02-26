package com.yugaplus.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.yugaplus.backend.api.Status;
import com.yugaplus.backend.api.UserLibraryResponse;
import com.yugaplus.backend.config.SecurityConfig;
import com.yugaplus.backend.config.UserRecord;
import com.yugaplus.backend.model.Movie;
import com.yugaplus.backend.model.User;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/library")
public class UserLibraryController {
    private JdbcClient jdbcClient;

    @Autowired
    public UserLibraryController(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    private HashMap<String, User> users = new HashMap<>();

    @GetMapping("/load")
    public UserLibraryResponse getUserLibrary() {
        UserRecord authUser = SecurityConfig.getAuthenticatedUser().get();

        List<Movie> movies = jdbcClient.sql("""
                SELECT id, title, vote_average, release_date
                FROM movie JOIN user_library ON movie.id = user_library.movie_id
                WHERE user_id = ?
                ORDER BY added_time DESC
                """).param(authUser.getUserId()).query(Movie.class).list();

        return new UserLibraryResponse(new Status(true, HttpServletResponse.SC_OK), movies);
    }

    @PutMapping("/add/{movieId}")
    public UserLibraryResponse addMovieToLibrary(
            @PathVariable Integer movieId,
            @RequestParam(name = "user", required = false) String email) {

        Optional<UserRecord> authUser = SecurityConfig.getAuthenticatedUser();

        UUID userId;
        String userLocation;

        if (!authUser.isEmpty()) {
            userId = authUser.get().getUserId();
            userLocation = authUser.get().getUserLocation();
        } else {
            // FOR DEMO PURPOSES ONLY
            if (email == null || email.isBlank()) {
                return new UserLibraryResponse(
                        new Status(false, HttpServletResponse.SC_BAD_REQUEST,
                                "User email is missing. Pass it via the 'user' parameter. "),
                        null);
            }

            User user = loadUser(email);

            if (user == null) {
                return new UserLibraryResponse(
                        new Status(false, HttpServletResponse.SC_NOT_FOUND,
                                "User with email " + email + " not found. "),
                        null);
            }

            userId = user.getId();
            userLocation = user.getUserLocation();
        }

        try {
            long startTime = System.currentTimeMillis();

            jdbcClient.sql("""
                    INSERT INTO user_library (user_id, movie_id, user_location) VALUES (?, ?, ?)
                    """).params(userId, movieId, userLocation).update();

            long execTime = System.currentTimeMillis() - startTime;

            return new UserLibraryResponse(new Status(true, HttpServletResponse.SC_OK,
                    formatDatabaseLatency(execTime)), null);
        } catch (Exception e) {
            return new UserLibraryResponse(new Status(false, HttpServletResponse.SC_INTERNAL_SERVER_ERROR), null);
        }
    }

    @DeleteMapping("/remove/{movieId}")
    public UserLibraryResponse removeMovieFromLibrary(
            @PathVariable Integer movieId,
            @RequestParam(name = "user", required = false) String email) {
        Optional<UserRecord> authUser = SecurityConfig.getAuthenticatedUser();

        UUID userId;
        String userLocation;

        if (!authUser.isEmpty()) {
            userId = authUser.get().getUserId();
            userLocation = authUser.get().getUserLocation();
        } else {
            // FOR DEMO PURPOSES ONLY
            if (email == null || email.isBlank()) {
                return new UserLibraryResponse(
                        new Status(false, HttpServletResponse.SC_BAD_REQUEST,
                                "User email is missing. Pass it via the 'user' parameter. "),
                        null);
            }

            User user = loadUser(email);

            if (user == null) {
                return new UserLibraryResponse(
                        new Status(false, HttpServletResponse.SC_NOT_FOUND,
                                "User with email " + email + " not found. "),
                        null);
            }

            userId = user.getId();
            userLocation = user.getUserLocation();
        }

        try {
            jdbcClient.sql("""
                    DELETE FROM user_library WHERE user_id = ? AND movie_id = ? AND user_location = ?
                    """).params(userId, movieId, userLocation).update();
            return new UserLibraryResponse(new Status(true, HttpServletResponse.SC_OK), null);
        } catch (Exception e) {
            return new UserLibraryResponse(new Status(true, HttpServletResponse.SC_INTERNAL_SERVER_ERROR), null);
        }
    }

    static String formatDatabaseLatency(long execTime) {
        return String.format("latency is %.3f seconds", (float) execTime / 1000);
    }

    private User loadUser(String email) {
        if (users.isEmpty()) {
            jdbcClient.sql("""
                    SELECT id, full_name, email, user_location
                    FROM user_account
                    """).query(User.class).list().forEach(user -> {
                users.put(user.getEmail(), user);
            });
        }

        return users.get(email);
    }
}
