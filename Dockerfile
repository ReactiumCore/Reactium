# Stage 0
FROM node:carbon

WORKDIR /tmp/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Bundle app source
COPY . .

RUN npm rebuild node-sass --force

# Run App build within container context
RUN npm run build

# Stage 1
FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

COPY --from=0 /tmp/app/node_modules ./node_modules
COPY --from=0 /tmp/app/public ./public
COPY --from=0 /tmp/app/build ./build

EXPOSE 3030

CMD [ "node", "./build/.core/index.js" ]
