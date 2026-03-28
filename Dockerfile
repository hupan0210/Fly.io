# 使用最轻量的 Node.js LTS 镜像
FROM node:iron-slim

# 设置工作目录
WORKDIR /app

# 先复制 package.json 并安装依赖 (利用 Docker 缓存)
COPY package.json .
RUN npm install --only=production && npm cache clean --force

# 复制应用代码
COPY server.js .

# 暴露端口
EXPOSE 8080

# 启动命令：关键是限制 Node.js 的堆内存占用，防止超额
CMD ["node", "--max-old-space-size=200", "server.js"]
