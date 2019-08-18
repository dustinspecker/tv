FROM mhart/alpine-node:10
WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci
COPY .babelrc .babelrc
COPY .browserslistrc .browserslistrc
COPY webpack.config.js webpack.config.js
COPY src/ src/
RUN npm run build

FROM nginx:1.15.8-alpine
RUN apk add --no-cache nginx-mod-http-lua
RUN mkdir -p /run/nginx
COPY --from=0 /app/build /usr/share/nginx/html
