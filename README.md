# YugaPlus: Movie Recommendations Service with OpenAI, Spring AI, and PostgreSQL pgvector

This is a sample movie recommendation service that is built on an OpenAI embedding model, Spring AI framework and PostgreSQL pgvector.

The service takes user questions written in plain English and uses a gen AI stack (OpenAI, Spring AI and PostgreSQL pgvector) to provide the user with the most relevant movies recommendations.

## Prerequisites

1. The latest version of Docker and Docker Compose.
2. [OpenAI API key](https://platform.openai.com)

If you're planning to run the app on bare metal, then make sure to have:

1. Node.js 20+
2. Java 21+. Use [sdkman](https://sdkman.io) to install it within a minute.
3. Maven 3.9+

## Start Database Instance In Docker

The pgvector extension is supported by a single-server PostgreSQL instance as well as a multi-node YugabyteDB cluster. Feel free to use any of the database options.

### Start PostgreSQL in Docker

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

4. Make sure the container is running:

    ```shell
    docker container ls -f name=postgres
    ```

### Start YugabyteDB in Docker

1. Create a custom Docker network:

    ```shell
    docker network create yugaplus-network
    ```

2. Start a YugabyteDB cluster:

    ```shell
    rm -r ~/yugabyte-volume
    mkdir ~/yugabyte-volume

    docker run -d --name yugabytedb-node1 --net yugaplus-network \
    -p 15433:15433 -p 7001:7000 -p 9001:9000 -p 5433:5433 \
    -v ~/yugabyte-volume/node1:/home/yugabyte/yb_data --restart unless-stopped \
    yugabytedb/yugabyte:latest \
    bin/yugabyted start --base_dir=/home/yugabyte/yb_data --daemon=false
    
    # Wait until the first node is initialized and ready to accept connection
    while ! docker exec -it yugabytedb-node1 postgres/bin/pg_isready -U yugabyte -h yugabytedb-node1; do sleep 1; done

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

## Start Application

You have an option of deploying the application in Docker or on your host operating system (bare metal).

## Start Application With Docker Compose

By default, the containers will attempt to connect to the PostgreSQL container.
If you use YugabyteDB:

1. Update the following settings in the `docker-compose.yaml`:

    ```yaml
    - DB_URL=jdbc:postgresql://yugabytedb-node1:5433/yugabyte
    - DB_USER=yugabyte
    - DB_PASSWORD=yugabyte
    ```

2. If you use YugabyteDB 2.20.1 or later, then add the following parameter:

    ```yaml
    - DB_CONN_INIT_SQL="SET yb_silence_advisory_locks_not_supported_error=true"
    ```

During the first run, build an image and only then start the containers:

```shell
docker-compose up --build
```

Once the image is ready, use this command to start the containers:

```shell
docker-compose up
```

## Start Application in Docker

Start the backend in Docker:

1. Create a Docker image for the backend:

    ```shell
    cd backend
    docker build -t yugaplus-backend .  
    ```

2. Start a backend container:

    For PostgreSQL:

    ```shell
    docker run --name yugaplus-backend --net yugaplus-network -p 8080:8080 \
        -e DB_URL=jdbc:postgresql://postgres:5432/postgres \
        -e DB_USER=postgres \
        -e DB_PASSWORD=password \
        -e OPENAI_API_KEY=your-api-key \
        yugaplus-backend
    ```

    For YugabyteDB:

    ```shell
    docker run --name yugaplus-backend --net yugaplus-network -p 8080:8080 \
        -e DB_URL=jdbc:postgresql://yugabytedb-node1:5433/yugabyte \
        -e DB_USER=yugabyte \
        -e DB_PASSWORD=yugabyte \
        -e OPENAI_API_KEY=your-api-key \
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

### Start Application on Bare Metal

By default, the backend will attempt to connect to the PostgreSQL container.
If you use YugabyteDB:

1. Update the following settings in the `application.properties` file:

    ```properties
    spring.datasource.url = jdbc:postgresql://yugabytedb-node1:5433/yugabyte
    spring.datasource.username = yugabyte
    spring.datasource.password = yugabyte
    ```

2. If you use YugabyteDB 2.20.1 or later, then add the following parameter:

    ```properties
    spring.datasource.hikari.connection-init-sql="SET yb_silence_advisory_locks_not_supported_error=true"
    ```

Start the backend:

1. Provide your OpenAI key in the `backend/src/main/resources/application.properties` file:

    ```properties
    spring.ai.openai.api-key=sk-
    ```

2. Go to the backend directory and start the app:

    ```shell
    cd backend
    mvn spring-boot:run
    ```

Start the frontend:

1. Go to the frontend directory:

    ```shell
    cd frontend
    ```

2. Start the app:

    ```shell
    npm install
    npm start
    ```

## Test Application

Go to [http://localhost:3000](http://localhost:3000) and test the application.

Sign in using the following credentials:

* `user1@gmail.com/password` - already has some movies in the library
* `user2@gmail.com/password` - the library is empty

Try a few prompts:
*A movie about a space adventure.*
*A kids-friendly movie with unexpected ending.*
