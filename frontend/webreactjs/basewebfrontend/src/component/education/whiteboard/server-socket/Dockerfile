# syntax=docker/dockerfile:1

FROM node:12.18.1-alpine
RUN apk add dumb-init
ENV NODE_ENV=production
ENV PORT 3000

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node:node package.json package-lock.json* ./

RUN npm ci --only=production

# Bundle app source
COPY --chown=node:node . .

EXPOSE 3000

USER node

CMD ["dumb-init", "node", "index.js"]
