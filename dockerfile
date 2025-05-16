# Use an official Node runtime as the base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the NestJS app (if using TypeScript)
# RUN npm run build

# Expose the port your app runs on (default is 3000 for NestJS)
EXPOSE 3000

# Command to run the app
CMD ["npm", "run", "start:dev"]