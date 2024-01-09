# YugaPlus
A sample streaming service with your favorite movies and series. Built on YugabyteDB.

## Set Up Environment

1. Install the latest version of Docker.
2. Create a custom network:
    ```shell
    docker network create yugaplus-network
    ```

## Start Postgres in Docker

1. Create `postgres-volume` directory for the Postgres container's volume in your home dir. The volume is handy if you'd like to access the logs easily and don't want to lose data when the container is recreated from scratch:
    ```shell
    mkdir ~/postgres-volume
    ```
2. Start the Postgres container with the pgvector extension:
    ```shell
    docker run --name postgres --net yugaplus-network \
        -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password \
        -p 5432:5432 \
        -v ~/postgresql-volume/:/var/lib/postgresql/data \
        -d ankane/pgvector:latest
    ```
3. Make sure the container is running:
    ```shell
    docker container ls -f name=postgres
    ```

## Load Application Dataset

The application uses a [movies dataset](https://huggingface.co/datasets/denismagda/movies/blob/main/README.md) comprising over 45,000 movies and 26 million ratings from more than 270,000 users. The dataset includes pre-generated embeddings for the movies' overviews, which were generated with the OpenAI `text-embedding-ada-002` model.

Load the dataset to the Postgres container:

1. Connect to the Postgres container:
    ```shell
    docker exec -it postgres /bin/bash
    ```

2. Install the `wget` tool within the container:
    ```shell
    apt update && apt-get install wget
    ```

3. Download the schema and data files from the HuggingFace to the container's `/home` directory:
    ```shell
    wget https://huggingface.co/datasets/denismagda/movies/raw/main/movie_schema.sql -P /home
    wget https://huggingface.co/datasets/denismagda/movies/resolve/main/movie_data_with_openai_embeddings.sql -P /home
    ```
    Note, it can take a minute to download the data file as long as it's size is ~ 900MB.

4. Connect to the database with `psql`:
    ```shell
    psql -U postgres
    ```

5. Enable the pgvector extension:
    ```shell
    create extension vector;
    ```

6. Load the dataset:
    ```sql
    \i /home/movie_schema.sql
    \i /home/movie_data_with_openai_embeddings.sql
    ```
    Note, it can take several minutes to load the data file.

Once the data is loaded, check that you have more than 45,000 movies in the database:
```sql
select count(*) from movie;
 count
-------
 45426
```

## Test the App

```shell
http GET :8080/api/movie/search prompt=='A movie about a space adventure.'

http GET :8080/api/movie/search rank==7 prompt=='A movie about a space adventure.'

http GET :8080/api/movie/search rank==7 category=='Science Fiction' prompt=='A movie about a space adventure.'
```