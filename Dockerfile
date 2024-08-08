# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Install development dependencies for SWC
RUN npm install --save-dev @swc/cli @swc/core

# Copy project files
COPY . .

# Build the Next.js project
RUN npm run build

# Expose the port the app runs on
EXPOSE 3003

# Start the app
CMD ["npm", "start"]
