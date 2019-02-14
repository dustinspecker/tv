FROM mhart/alpine-node:10
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:1.15.8
COPY --from=0 /app/build /usr/share/nginx/html
