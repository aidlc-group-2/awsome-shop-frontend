# frontend — Vite/React 构建产物镜像
# 交接契约（deploy 仓 compose）：最终镜像内含 /app/dist，且含 sh + cp（alpine 满足）
# compose 的 frontend 服务会执行：cp -r /app/dist/. /export/ 把产物导出到共享卷供 nginx 提供
# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# ---- export image（只承载构建产物）----
FROM alpine:3.20
WORKDIR /app
COPY --from=build /app/dist /app/dist
CMD ["sh", "-c", "echo 'frontend assets baked at /app/dist'"]
