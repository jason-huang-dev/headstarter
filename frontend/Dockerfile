FROM node:22-bookworm-slim
WORKDIR /app
COPY package*.json ./
COPY . .
RUN rm -rf node_modules package-lock.json
RUN npm install
EXPOSE 5173

# CMD [ "npm", "run", "dev" ]
CMD ["sleep", "infinity"]