FROM node:20

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY public ./public
COPY src ./src
COPY package.json .
COPY package-lock.json .
COPY vite.config.js .
COPY index.html .

# Install any needed packages specified in package.json
RUN npm install

# Set environment
ENV REACT_APP_RUNTIME_ENVIRONMENT=docker

# Expose port 3000
EXPOSE 3000

# Run app.js (or whatever your main file is) when the container launches
CMD ["npm", "start"]