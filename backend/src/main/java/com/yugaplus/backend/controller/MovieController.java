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
				"SELECT id, title, overview, vote_average FROM movie WHERE");

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
			List<Double> promptEmbedding = aiClient.embed(prompt);

			query.append(
					" 1 - (overview_vector <=> :prompt_vector::vector) >= :similarity_threshold" +
							" ORDER BY overview_vector <=> :prompt_vector::vector LIMIT :max_results");
			params.put("prompt_vector", promptEmbedding.toString());
			params.put("similarity_threshold", SIMILARITY_THRESHOLD);
		} else {
			query.append(" overview LIKE :prompt LIMIT :max_results");
			params.put("prompt", '%' + prompt + '%');
		}

		params.put("max_results", MAX_RESULTS);

		List<Movie> movies = jdbcClient.sql(query.toString())
				.params(params)
				.query(Movie.class).list();

		return new MovieResponse(new Status(true, HttpServletResponse.SC_OK), movies);
	}
}
