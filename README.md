# YugaPlus

A sample streaming service with your favorite movies and series. Built on YugabyteDB.

## Prerequisites

1. The latest version of Docker.
2. Node.js 20+
3. Java 21+. Use [sdkman](https://sdkman.io) to install it within a minute.
4. Maven 3.9+

## Start Postgres in Docker

1. Create the `postgres-volume` directory for the Postgres container's volume in your home dir. The volume is handy if you'd like to access the logs easily and don't want to lose data when the container is recreated from scratch:

    ```shell
    mkdir ~/postgres-volume
    ```

2. Create a custom Docker network:

    ```shell
    docker network create yugaplus-network
    ```

3. Start the Postgres container with the pgvector extension:

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

## Start the Backend

1. Provide your OpenAI key in the `backend/src/main/resources/application.properties` file:

    ```properties
    spring.ai.openai.api-key=sk-
    ```

2. Go to the backend directory and start the app:

    ```shell
    cd backend
    mvn spring-boot:run
    ```

## Start the Frontend

1. Go to the frontend directory:

    ```shell
    cd frontend
    ```

2. Start the app:

    ```shell
    npm install
    npm start
    ```

## Test the App

Sign in using the following credentials:

* `user1@gmail.com/password` - already has some movies in the library
* `user2@gmail.com/password` - the library is empty

Try a few prompts:
*A movie about a space adventure.*
*A kids-friendly movie with unexpected ending.*

## Run in Docker

Start the backend in Docker:

1. Create a Docker image for the backend:

    ```shell
    cd backend
    docker build -t yugaplus-backend .  
    ```

2. Start a backend container:

    ```shell
    docker run --name yugaplus-backend --net yugaplus-network -p 8080:8080 \
        -e DB_URL=jdbc:postgresql://postgres:5432/postgres \
        -e DB_USER=postgres \
        -e DB_PASSWORD=password \
        -e OPENAI_API_KEY=sk... \
        yugaplus-backend
    ```

Start the frontend in Docker:

1. Create a Docker image for the frontend:

    ```shell
    cd frontend
    docker build -t yugaplus-frontend .  
    ```

2. Start a frontend container:

    ```shell
    docker run --name yugaplus-frontend --net yugaplus-network -p 3000:3000 \
        -e REACT_APP_PROXY_URL=http://yugaplus-backend:8080 \
        yugaplus-frontend
    ```

## Run With Docker Compose

TBD

## Starting With YugabyteDB

```shell
rm -r ~/yugabyte-volume
mkdir ~/yugabyte-volume

docker run -d --name yugabytedb-node1 --net yugaplus-network \
  -p 15433:15433 -p 7001:7000 -p 9001:9000 -p 5433:5433 \
  -v ~/yugabyte-volume/node1:/home/yugabyte/yb_data --restart unless-stopped \
  yugabytedb/yugabyte:latest \
  bin/yugabyted start --base_dir=/home/yugabyte/yb_data --daemon=false
  
docker run -d --name yugabytedb-node2 --net yugaplus-network \
  -p 15434:15433 -p 7002:7000 -p 9002:9000 -p 5434:5433 \
  -v ~/yugabyte-volume/node2:/home/yugabyte/yb_data --restart unless-stopped \
  yugabytedb/yugabyte:latest \
  bin/yugabyted start --join=yugabytedb-node1 --base_dir=/home/yugabyte/yb_data --daemon=false
      
docker run -d --name yugabytedb-node3 --net yugaplus-network \
  -p 15435:15433 -p 7003:7000 -p 9003:9000 -p 5435:5433 \
  -v ~/yugabyte-volume/node3:/home/yugabyte/yb_data --restart unless-stopped \
  yugabytedb/yugabyte:latest \
  bin/yugabyted start --join=yugabytedb-node1 --base_dir=/home/yugabyte/yb_data --daemon=false
```

## GPT Store Plugin

```shell
export YUGAPLUS_BACKEND_PORT=80
export OPENAI_API_KEY=...

http GET http://ai.dmagda.com/api/movie/search X-Api-Key:gpt-store-plugin prompt=='space'
```
