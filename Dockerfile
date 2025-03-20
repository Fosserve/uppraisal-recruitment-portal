# Use official Node.js LTS image optimized for Next.js
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first for better caching
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy application files
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port defined in docker-compose
EXPOSE 8123

# Start the production server
CMD ["npm", "start", "--", "-p", "8123"]
