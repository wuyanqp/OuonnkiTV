# 多阶段构建
# 第一阶段：构建应用
FROM node:20-alpine AS builder

# 构建参数
ARG BUILD_DATE
ARG VCS_REF
ARG VERSION
ARG VITE_PROXY_URL
ARG VITE_INITIAL_VIDEO_SOURCES

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@9.15.4

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 设置构建时环境变量
ENV VITE_PROXY_URL=${VITE_PROXY_URL}
ENV VITE_INITIAL_VIDEO_SOURCES=${VITE_INITIAL_VIDEO_SOURCES}

# 构建应用
RUN pnpm build

# 第二阶段：运行时环境
FROM nginx:alpine AS production

# 添加标签
LABEL org.opencontainers.image.title="OuonnkiTV"
LABEL org.opencontainers.image.description="OuonnkiTV Web Application"
LABEL org.opencontainers.image.version=${VERSION}
LABEL org.opencontainers.image.created=${BUILD_DATE}
LABEL org.opencontainers.image.revision=${VCS_REF}
LABEL org.opencontainers.image.source="https://github.com/Ouonnki/OuonnkiTV"

# 复制构建产物到 nginx 静态文件目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 创建非特权用户（安全最佳实践）
RUN addgroup -g 1001 -S nginx && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
