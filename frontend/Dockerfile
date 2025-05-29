FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY myapp/package*.json ./

# Install dependencies
RUN npm install

# Copy the full source code
COPY myapp/ ./

# Expose Next.js port
EXPOSE 3000

# Start in development mode with hot reload
CMD ["npm", "run", "dev"]
