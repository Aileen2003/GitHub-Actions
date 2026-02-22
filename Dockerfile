FROM node:20-alpine

WORKDIR /usr/src/app

# Copiamos dependencias primero (mejor caché)
COPY app/package*.json ./
RUN npm install --omit=dev

# Copiamos el resto del código
COPY app/ ./

EXPOSE 3000

CMD ["node", "server.js"]
