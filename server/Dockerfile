FROM mhart/alpine-node:10
WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci --prod
COPY src/ src/

CMD ["npm", "start"]
