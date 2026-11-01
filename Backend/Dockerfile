# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for tsc)
# Install ALL dependencies (including devDependencies for tsc)
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --omit=dev

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Create upload directories
RUN mkdir -p uploads/products uploads/banners uploads/reviews uploads/users logs

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "dist/server.js"]
