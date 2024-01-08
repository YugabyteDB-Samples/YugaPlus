package com.yugaplus.backend;

import org.springframework.web.bind.annotation.RestController;

import com.yugaplus.backend.model.Movie;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.ai.embedding.EmbeddingClient;

@RestController
@RequestMapping("/api/movie")
public class MovieController {
    JdbcClient jdbcClient;

    private EmbeddingClient aiClient;

    private boolean enableAiSearch;

    @Autowired
    public MovieController(
            @Value("${spring.ai.openai.api-key}") String openAiApiKey,
            EmbeddingClient aiClient,
            JdbcClient jdbcClient) {

        enableAiSearch = openAiApiKey != null && !openAiApiKey.isBlank()
                && !openAiApiKey.equals("your-api-key");

        this.aiClient = aiClient;
        this.jdbcClient = jdbcClient;
    }

    @GetMapping("/{id}")
    public Movie getMovieById(@PathVariable Integer id) {
        return jdbcClient.sql(
                "SELECT * FROM movie WHERE id = ?")
                .param(id).query(Movie.class).single();
    }

    @GetMapping("/search")
    public List<Movie> searchMovies(@RequestParam("prompt") String prompt) {
        if (enableAiSearch) {
            List<Double> promptEmbedding = aiClient.embed(prompt);

            return jdbcClient.sql(
                    "SELECT id,title, overview,popularity,vote_average,release_date " +
                            "FROM movie WHERE 1 - (overview_vector <=> :prompt_vector::vector) >= 0.7 " +
                            "ORDER BY overview_vector <=> :prompt_vector::vector LIMIT 3")
                    .param("prompt_vector", promptEmbedding.toString()).query(Movie.class).list();
        } else {
            return jdbcClient.sql(
                    "SELECT id,title, overview,popularity,vote_average,release_date " +
                            "FROM movie WHERE overview LIKE ?")
                    .param('%' + prompt + '%').query(Movie.class).list();
        }
    }
}
