/*
 Create PostgreSQL tablespaces for the US East, Central and West regions.
 The region names in the tablespaces definition correspond to the names of the regions
 that you selected for the database nodes in the previous chapter of the tutorial.
 As a result, data belonging to a specific tablespace will be stored on database nodes from the same region.
 */
CREATE TABLESPACE usa_east_ts WITH (
    replica_placement = '{"num_replicas": 1, "placement_blocks":
    [{"cloud":"gcp","region":"us-east1","zone":"us-east1-a","min_num_replicas":1}]}'
);

CREATE TABLESPACE usa_central_ts WITH (
    replica_placement = '{"num_replicas": 1, "placement_blocks":
    [{"cloud":"gcp","region":"us-central1","zone":"us-central1-a","min_num_replicas":1}]}'
);

CREATE TABLESPACE usa_west_ts WITH (
    replica_placement = '{"num_replicas": 1, "placement_blocks":
    [{"cloud":"gcp","region":"us-west2","zone":"us-west2-a","min_num_replicas":1}]}'
);


/*
 For the demo purpose, drop the existing table.
 In a production environment, you can use one of the techniques to move data between old and new tables.
 */
DROP TABLE user_library;


/*
 Create a geo-partitioned version of the table partitioning the data by the "user_location" column.
 */
CREATE TABLE user_library(
    user_id uuid NOT NULL,
    movie_id integer NOT NULL,
    start_watch_time int NOT NULL DEFAULT 0,
    added_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_location text
)
PARTITION BY LIST (user_location);


/*
 Create partitions for each cloud region mapping the values of the "user_location" column
 to a respective geo-aware tablespace.
 */
CREATE TABLE user_library_usa_east PARTITION OF user_library(user_id, movie_id, start_watch_time, added_time, user_location, PRIMARY KEY (user_id, movie_id, user_location))
FOR VALUES IN ('New York', 'Boston') TABLESPACE usa_east_ts;

CREATE TABLE user_library_usa_central PARTITION OF user_library(user_id, movie_id, start_watch_time, added_time, user_location, PRIMARY KEY (user_id, movie_id, user_location))
FOR VALUES IN ('Chicago', 'Kansas City') TABLESPACE usa_central_ts;

CREATE TABLE user_library_usa_west PARTITION OF user_library(user_id, movie_id, start_watch_time, added_time, user_location, PRIMARY KEY (user_id, movie_id, user_location))
FOR VALUES IN ('San Francisco', 'Los Angeles') TABLESPACE usa_west_ts;

