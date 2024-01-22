FROM maven:3.9-eclipse-temurin-21

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY pom.xml mvnw ./
COPY src ./src

# Build the binary
RUN mvn package -DskipTests

# Expose port 8080
EXPOSE 8080

# Run the binary when the container launches
CMD ["java", "-jar", "/app/target/yugaplus-backend-1.0.0.jar"]