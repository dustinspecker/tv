FROM mhart/alpine-node:10
WORKDIR /app
COPY . .
RUN npm ci --prod

CMD ["npm", "start"]
