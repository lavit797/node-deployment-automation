FROM node:20-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN chown -R node:node /usr/src/app
USER node

ENV NODE_ENV = production
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', r => process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

  CMD ["node" , "server.js"]