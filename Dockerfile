FROM debian:bullseye-slim

ENV DEBIAN_FRONTEND=noninteractive \
    GLAMA_VERSION="0.2.0" \
    PATH="/home/service-user/.local/bin:${PATH}"

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    libssl-dev \
    software-properties-common \
    wget \
    zlib1g-dev && \
    groupadd -r service-user && \
    useradd -u 1987 -r -m -g service-user service-user && \
    mkdir -p /home/service-user/.local/bin /app && \
    chown -R service-user:service-user /home/service-user /app && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    npm install -g mcp-proxy@2.10.6 pnpm@9.15.5 bun@1.1.42 && \
    curl -LsSf https://astral.sh/uv/install.sh | UV_INSTALL_DIR="/usr/local/bin" sh && \
    uv python install 3.13 --default --preview && \
    ln -s $(uv python find) /usr/local/bin/python && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

USER service-user

WORKDIR /app

RUN git clone https://github.com/puchunjie/doc-tools-mcp . && \
    git checkout 37d7d16cc9b516bf14b1c8a787fc0ca6f116b8d4 && \
    npm install && \
    npm run build

# 修改启动命令，添加环境变量来控制日志输出
CMD ["mcp-proxy", "node", "--no-warnings", "dist/mcp-server.js"]