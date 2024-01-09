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

## Test the App

```shell
http GET :8080/api/movie/search prompt=='A movie about a space adventure.'

http GET :8080/api/movie/search rank==7 prompt=='A movie about a space adventure.'

http GET :8080/api/movie/search rank==7 category=='Science Fiction' prompt=='A movie about a space adventure.'
```