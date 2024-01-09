package com.yugaplus.backend.model;

import java.sql.Date;

public class Movie {
    private Integer id;
    private String title;
    private String overview;
    private Date releaseDate;
    private Number popularity;
    private Number voteAverage;
    private Integer voteCount;

    public Movie() {
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getOverview() {
        return overview;
    }
    public void setOverview(String overview) {
        this.overview = overview;
    }
    public Date getReleaseDate() {
        return releaseDate;
    }
    public void setReleaseDate(Date releaseDate) {
        this.releaseDate = releaseDate;
    }
    public Number getPopularity() {
        return popularity;
    }
    public void setPopularity(Number popularity) {
        this.popularity = popularity;
    }
    public Number getVoteAverage() {
        return voteAverage;
    }
    public void setVoteAverage(Number voteAverage) {
        this.voteAverage = voteAverage;
    }
    public Integer getVoteCount() {
        return voteCount;
    }
    public void setVoteCount(Integer voteCount) {
        this.voteCount = voteCount;
    }
}
