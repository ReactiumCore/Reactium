# Build Stage
FROM node:carbon as build

RUN mkdir /tmp/app

WORKDIR /tmp/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Bundle app source
COPY . .

RUN chown -R node ./

USER node

# Run App build within container context
RUN npm install

RUN npm prune --production

# Deployable Stage
FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

COPY --from=build /tmp/app/node_modules ./node_modules
COPY --from=build /tmp/app/public ./public
COPY --from=build /tmp/app/build ./build

EXPOSE 3030

CMD [ "node", "./build/.core/index.js" ]
