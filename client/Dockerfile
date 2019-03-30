FROM mhart/alpine-node:10
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:1.15.8-alpine
RUN apk add --no-cache nginx-mod-http-lua
RUN mkdir -p /run/nginx
COPY --from=0 /app/build /usr/share/nginx/html
