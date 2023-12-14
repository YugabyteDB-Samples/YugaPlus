package com.yugaplus.backend;

import org.springframework.web.bind.annotation.RestController;

import com.yugaplus.backend.model.Movie;

import jakarta.websocket.server.PathParam;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/movie")
public class MovieController {
    @Autowired
    JdbcClient jdbcClient;

    @Value("${spring.ai.openai.api-key}")
    private String openAiApiKey;

    private boolean enableAiSearch = openAiApiKey != null && !openAiApiKey.isBlank()
            && !openAiApiKey.equals("your-api-key");

    @GetMapping("/{id}")
    public Movie getMovieById(@PathVariable Integer id) {
        return jdbcClient.sql(
                "SELECT * FROM movie WHERE id = ?")
                .param(id).query(Movie.class).single();
    }

    @GetMapping("/search")
    public List<Movie> searchMovies(@RequestParam("prompt") String prompt) {
        if (enableAiSearch) {
            return jdbcClient.sql(
                    "SELECT * FROM movie WHERE overview LIKE ?")
                    .param('%' + prompt + '%').query(Movie.class).list();
        } else {
            return jdbcClient.sql(
                    "SELECT * FROM movie WHERE overview LIKE ?")
                    .param('%' + prompt + '%').query(Movie.class).list();
        }
    }
}
