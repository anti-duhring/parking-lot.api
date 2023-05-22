# Use an official Node.js runtime as the base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install NestJS dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .


# Expose the port that your NestJS API will be running on
EXPOSE 3000

# Load environment variables from .env file
COPY .env .env

# Start the NestJS application
CMD ["npm", "run", "start:prod"]
