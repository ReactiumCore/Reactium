# Build Stage
FROM node:lts-hydrogen as build

RUN mkdir /tmp/app

WORKDIR /tmp/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Bundle app source
COPY . .

# Allocate as much as 2GB for build heap
ENV NODE_OPTIONS=--max_old_space_size=2078

# Run App build within container context
RUN npx reactium install && npm run build

# Remove Development Deps before next stage
RUN npm prune --production

# Deployable Stage
FROM node:lts-hydrogen

# Create app directory
WORKDIR /usr/src/app

# Dependencies of server
COPY --from=build /tmp/app/package.json ./package.json
COPY --from=build /tmp/app/node_modules ./node_modules
COPY --from=build /tmp/app/reactium_modules ./reactium_modules

# Includes all server src and built assets
COPY --from=build /tmp/app/src ./src
COPY --from=build /tmp/app/public ./public

RUN chown -R node ./

USER node

EXPOSE 3030

CMD [ "npm", "start" ]
