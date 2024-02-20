package com.yugaplus.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.yugaplus.backend.api.MovieResponse;
import com.yugaplus.backend.api.Status;
import com.yugaplus.backend.model.Movie;

import jakarta.servlet.http.HttpServletResponse;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    private static final Number SIMILARITY_THRESHOLD = 0.7;
    private static final Integer MAX_RESULTS = 3;

    private JdbcClient jdbcClient;

    private EmbeddingClient aiClient;

    private boolean enableAiSearch;

    public MovieController(
            @Value("${spring.ai.openai.api-key:#{null}}") String openAiApiKey,
            @Autowired(required = false) EmbeddingClient aiClient,
            JdbcClient jdbcClient) {

        enableAiSearch = openAiApiKey != null && !openAiApiKey.isBlank()
                && !openAiApiKey.equals("your-api-key");

        if (enableAiSearch) {
            System.out.println("Using the similarity search mode");
        } else {
            System.out.println("Using the full-text search mode");
        }

        this.aiClient = aiClient;
        this.jdbcClient = jdbcClient;
    }

    @GetMapping("/{id}")
    public MovieResponse getMovieById(@PathVariable Integer id) {
        Movie movie = jdbcClient.sql(
                "SELECT * FROM movie WHERE id = ?")
                .param(id).query(Movie.class).single();

        return new MovieResponse(new Status(true, HttpServletResponse.SC_OK), List.of(movie));
    }

    @GetMapping("/search")
    public MovieResponse searchMovies(
            @RequestParam("prompt") String prompt,
            @RequestParam(name = "rank", required = false) Integer rank,
            @RequestParam(name = "category", required = false) String category) {

        StringBuilder query = new StringBuilder(
                "SELECT id, title, overview, vote_average, release_date FROM movie WHERE");

        Map<String, Object> params = new HashMap<>();

        if (rank != null) {
            query.append(" vote_average >= :rank AND");
            params.put("rank", rank);
        }

        if (category != null) {
            query.append(" genres @> :category::jsonb AND");
            params.put("category", "[{\"name\": \"" + category + "\"}]");
        }

        if (enableAiSearch) {
            try {
                List<Double> promptEmbedding = aiClient.embed(prompt);

                query.append(
                        " 1 - (overview_vector <=> :prompt_vector::vector) >= :similarity_threshold" +
                                " ORDER BY overview_vector <=> :prompt_vector::vector LIMIT :max_results");
                params.put("prompt_vector", promptEmbedding.toString());
                params.put("similarity_threshold", SIMILARITY_THRESHOLD);
            } catch (Exception e) {
                enableAiSearch = false;

                String errorMessage = "The OpenAI API failed, switching to the full-text search mode.";
                System.err.println(errorMessage);
                e.printStackTrace();

                return new MovieResponse(
                        new Status(false, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                                errorMessage + " " + e.getMessage()),
                        null);
            }

        } else {
            query.append(" overview_lexemes @@ plainto_tsquery('english', :prompt) LIMIT :max_results");
            params.put("prompt", '%' + prompt + '%');
        }

        params.put("max_results", MAX_RESULTS);

        try {
            List<Movie> movies = jdbcClient.sql(query.toString())
                    .params(params)
                    .query(Movie.class).list();

            if (movies.isEmpty()) {
                return new MovieResponse(
                        new Status(false, HttpServletResponse.SC_NOT_FOUND, "No movies found. Try another phrase."),
                        null);
            }

            return new MovieResponse(new Status(true, HttpServletResponse.SC_OK), movies);
        } catch (Exception e) {
            e.printStackTrace();
            return new MovieResponse(
                    new Status(false, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage()), null);
        }
    }
}
