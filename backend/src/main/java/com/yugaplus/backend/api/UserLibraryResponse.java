package com.yugaplus.backend.api;

import java.util.List;

import com.yugaplus.backend.model.Movie;

public record UserLibraryResponse(Status status, List<Movie> movies) {
}
