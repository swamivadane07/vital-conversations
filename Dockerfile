<<<<<<< HEAD
# Stage 1: Build the React/Vite app
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files and install ALL dependencies (including devDependencies)
COPY package*.json ./
RUN npm install

# Copy source files and build
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine
=======
# Stage 1: Build the React app
FROM docker.io/node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve with Nginx
FROM docker.io/nginx:1.25-alpine
>>>>>>> ecc1df5c280e0c29b52325ffada9418e45ee9f3c

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy build output from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

<<<<<<< HEAD
# Copy custom Nginx configuration (if you have one)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
=======
# Copy nginx configuration for SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
>>>>>>> ecc1df5c280e0c29b52325ffada9418e45ee9f3c
