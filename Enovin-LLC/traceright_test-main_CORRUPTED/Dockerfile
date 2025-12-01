# Simple single-stage build
FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm@10.4.1

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Expose port
ENV PORT=8080
EXPOSE 8080
ENV NODE_ENV=production

# Start the server
CMD ["node", "dist/index.js"]
