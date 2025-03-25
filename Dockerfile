# Use a Node.js image with version >=18
FROM node:18-alpine AS builder

# Set the working directory inside the Docker container
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a smaller Node.js image to run the app
FROM node:18-alpine

# Set the working directory inside the Docker container
WORKDIR /app

# Copy built files from the builder
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package-lock.json /app

# Install only production dependencies
RUN npm install --only=production

# 暴露端口（如果需要的话）
EXPOSE 3000

# 启动服务
CMD ["node", "dist/mcp-server.js"]