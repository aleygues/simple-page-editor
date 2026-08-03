FROM node:26-alpine AS api-deps

WORKDIR /app

COPY api/package.json .
COPY api/yarn.lock .

RUN npm install --global yarn
RUN yarn

FROM node:26-alpine AS api-dev

WORKDIR /app

RUN npm install --global yarn
COPY --from=api-deps /app/node_modules ./node_modules
COPY api/package.json .
COPY api/tsconfig.json .
COPY api/src ./src

CMD ["yarn", "dev"]

FROM node:26-alpine AS build

WORKDIR /app

RUN npm install --global yarn
COPY --from=deps /app/node_modules ./node_modules
COPY package.json .
COPY tsconfig.json .
COPY src .
RUN yarn build

FROM node:26-alpine AS main

WORKDIR /app

RUN npm install --global yarn
COPY --from=build /app/dist ./dist
COPY package.json .
COPY yarn.lock .
RUN yarn --prod

CMD ["yarn", "start"]