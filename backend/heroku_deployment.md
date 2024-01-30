# Deploy Backend to Heroku

You can deploy backend to Heroku and make it accessible as a public API endpoint.

## Prepare Heroku Environment

1. Log into your Heroku account:

    ```shell
    heroku login
    ```

2. Install the Heroku Java plugin:

    ```shell
    heroku plugins:install java
    ```

3. Create a new application in Heroku:

    ```shell
    heroku create yugaplus-backend
    ```

4. Provide backend-specific configuration settings:

    ```shell
    heroku config:set PORT=<YOUR_SPRING_SERVER_PORT> -a yugaplus-backend

    heroku config:set DB_URL="<YOUR_DB_URL>" -a yugaplus-backend
    heroku config:set DB_USER=<YOUR_DB_USER> -a yugaplus-backend
    heroku config:set DB_PASSWORD=<YOUR_DB_PWD> -a yugaplus-backend
    
    heroku config:set OPENAI_API_KEY=<YOUR_OPENAI_API_KEY> -a yugaplus-backend

    heroku config:set BACKEND_API_KEY=<YOUR_BACKEND_API_KEY> -a yugaplus-backend
    ```

## Deploy Backend

1. Build the application backend:

    ```shell
    mvn clean package
    ```

2. Deploy to Heroku:

    ```shell
    heroku deploy:jar target/yugaplus-backend-1.0.0.jar -a yugaplus-backend
    ```

3. Check the application logs:

    ```shell
    heroku logs --tail -a yugaplus-backend
    ```

Now, test the API endpoint:

1. Get the app's **Web URL** on Heroku:

    ```shell
    heroku apps:info -a yugaplus-backend
    ```

2. Send an api request to the endpoint using the `BACKEND_API_KEY` that you provided in the Heroku config earlier:

    ```shell
    http GET {YOUR_HEROKU_WEB_URL}/api/movie/search X-Api-Key:{YOUR_BACKEND_API_KEY} prompt=='a movie about space adventure'
    ```
