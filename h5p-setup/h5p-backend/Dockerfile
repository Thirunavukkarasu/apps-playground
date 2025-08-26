# Use the official Bun image
FROM oven/bun:1 as base

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p h5p/content h5p/libraries h5p/temp

# Build the application
RUN bun run build:prod

# Production stage
FROM oven/bun:1-slim

WORKDIR /app

# Copy built application and dependencies
COPY --from=base /app/dist ./dist
COPY --from=base /app/package.json ./
COPY --from=base /app/bun.lockb ./
COPY --from=base /app/h5p ./h5p

# Install only production dependencies
RUN bun install --frozen-lockfile --production

# Create necessary directories
RUN mkdir -p h5p/content h5p/libraries h5p/temp

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV STORAGE_TYPE=filesystem
ENV CONTENT_DIR=./h5p/content

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/h5p/health || exit 1

# Start the application
CMD ["bun", "run", "dist/server.js"]
