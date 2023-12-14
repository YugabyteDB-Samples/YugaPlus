create table movie
(
    adult                 text,
    belongs_to_collection jsonb,
    budget                integer,
    genres                jsonb,
    homepage              text,
    id                    integer,
    imdb_id               text,
    original_language     text,
    original_title        text,
    overview              text,
    popularity            numeric,
    poster_path           text,
    production_companies  jsonb,
    production_countries  jsonb,
    release_date          date,
    revenue               integer,
    runtime               numeric,
    spoken_languages      jsonb,
    status                text,
    tagline               text,
    title                 text,
    video                 text,
    vote_average          numeric,
    vote_count            integer
);


