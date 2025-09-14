# Use Node.js 20 Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port 5001 (from rsbuild.config.ts)
EXPOSE 5001

# Start development server
CMD ["npm", "run", "dev"]