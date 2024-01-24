FROM node:20

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY public ./public
COPY src ./src
COPY package.json .
COPY package-lock.json .

# Install any needed packages specified in package.json
RUN npm install

# Define environment variable
ENV NODE_ENV=development

# Expose port 3000
EXPOSE 3000

# Run app.js (or whatever your main file is) when the container launches
CMD ["npm", "dev"]