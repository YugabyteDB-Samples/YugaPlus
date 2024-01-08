package com.yugaplus.backend.model;

import java.sql.Date;

public record Movie(
        Integer id, String title,
        String overview, Date releaseDate,
        Number popularity, Number voteAverage) {
}
