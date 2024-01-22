package com.yugaplus.backend.controller;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yugaplus.backend.api.MovieResponse;
import com.yugaplus.backend.api.Status;
import com.yugaplus.backend.api.UserLibraryResponse;
import com.yugaplus.backend.config.SecurityConfig;
import com.yugaplus.backend.config.UserRecord;
import com.yugaplus.backend.model.Movie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/library")
public class UserLibraryController {
    private JdbcClient jdbcClient;

    @Autowired
    public UserLibraryController(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    @GetMapping("/load")
    public UserLibraryResponse getUserLibrary() {
        UserRecord authUser = SecurityConfig.getAuthenticatedUser().get();

        List<Movie> movies = jdbcClient.sql("""
                SELECT id, title, vote_average, release_date
                FROM movie JOIN user_history ON movie.id = user_history.movie_id
                WHERE user_id = ?
                ORDER BY added_time DESC
                """).param(authUser.getUserId()).query(Movie.class).list();

        return new UserLibraryResponse(new Status(true, HttpServletResponse.SC_OK), movies);
    }

    @PutMapping("/add/{movieId}")
    public UserLibraryResponse addMovieToLibrary(@PathVariable Integer movieId) {
        UserRecord authUser = SecurityConfig.getAuthenticatedUser().get();

        try {
            jdbcClient.sql("""
                    INSERT INTO user_history (user_id, movie_id) VALUES (?, ?)
                    """).params(authUser.getUserId(), movieId).update();
            return new UserLibraryResponse(new Status(true, HttpServletResponse.SC_OK), null);
        } catch (Exception e) {
            return new UserLibraryResponse(new Status(false, HttpServletResponse.SC_INTERNAL_SERVER_ERROR), null);
        }
    }

    @DeleteMapping("/remove/{movieId}")
    public UserLibraryResponse removeMovieFromLibrary(@PathVariable Integer movieId) {
        UserRecord authUser = SecurityConfig.getAuthenticatedUser().get();

        try {
            jdbcClient.sql("""
                    DELETE FROM user_history WHERE user_id = ? AND movie_id = ?
                    """).params(authUser.getUserId(), movieId).update();
            return new UserLibraryResponse(new Status(true, HttpServletResponse.SC_OK), null);
        } catch (Exception e) {
            return new UserLibraryResponse(new Status(true, HttpServletResponse.SC_INTERNAL_SERVER_ERROR), null);
        }
    }
}
