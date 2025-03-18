# Use the official Node.js image as the base image
FROM node:18-alpine AS base

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Verify the build exists
RUN test -d .next && test -f .next/BUILD_ID || (echo "Build failed: .next directory or BUILD_ID file missing" && exit 1)

# Use a smaller image for production
FROM node:18-alpine AS production

# Set the working directory
WORKDIR /app

# Copy necessary files from the base image
COPY --from=base /app/package*.json ./
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
