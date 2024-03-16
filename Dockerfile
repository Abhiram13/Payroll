FROM node:18.19.0-alpine3.18
ENV NODE_ENV=production
WORKDIR /app 
COPY package*.json ./
RUN npm install
COPY . .
# RUN npm test
RUN npm run build
# EXPOSE 3000
CMD ["npm", "run", "node"]
# "prestart": "tsc",