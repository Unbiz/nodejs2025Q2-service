# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY doc ./doc

# Clean up
RUN rm -rf /root/.npm

EXPOSE 4000

LABEL version="1.0" \
  description="Home Library Service" \
  maintainer="Your Name"

CMD ["node", "dist/main"]
