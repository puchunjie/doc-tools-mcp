# 构建阶段
FROM node:20-alpine as builder

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 运行阶段
FROM node:20-alpine

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 只安装生产环境依赖
RUN npm ci --only=production

# 从构建阶段复制编译后的文件
COPY --from=builder /app/dist ./dist

# 暴露端口（如果需要的话）
EXPOSE 3000

# 启动服务
CMD ["node", "dist/mcp-server.js"]