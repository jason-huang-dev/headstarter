FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json ./
RUN npm install
COPY src ./src
COPY public ./public
COPY vite.config.js ./
CMD [ "sleep", "infinity" ]