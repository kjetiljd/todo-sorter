# Simple, production-ready image for the Todo Sorter service
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --omit=dev \
    && apk add --no-cache curl

# Copy source code with correct ownership for non-root user
COPY --chown=node:node src ./src
COPY --chown=node:node README.md ./

# Environment and port
ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

# Basic healthcheck hitting /health
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -fsS http://localhost:${PORT}/health || exit 1

# Drop privileges
USER node

# Start the service
CMD ["node", "src/server.js"]

