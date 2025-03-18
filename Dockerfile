# Use an official Node.js image
FROM node:18-alpine 

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the required port
EXPOSE 8123

# Start Next.js on port 8123
CMD ["npm", "run", "start", "--", "-p", "8123"]
