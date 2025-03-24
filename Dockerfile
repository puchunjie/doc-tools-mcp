# Generated by https://smithery.ai. See: https://smithery.ai/docs/config#dockerfile
FROM node:lts-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

# Install dependencies without running lifecycle scripts
RUN npm install --ignore-scripts

# Copy source code
COPY . .

# Build the project
RUN npm run build

# Expose port
EXPOSE 8765

# Start the MCP server
CMD [ "node", "dist/mcp-server.js" ]
