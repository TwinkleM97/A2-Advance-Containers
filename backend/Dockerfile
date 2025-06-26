FROM node:18-alpine

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Ensure log folder exists and belongs to non-root user
RUN mkdir -p /app/logs && chown -R appuser:appgroup /app

USER appuser

EXPOSE 3001
CMD ["node", "index.js"]
