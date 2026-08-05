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

FROM node:26-alpine AS api-build

WORKDIR /app

RUN npm install --global yarn
COPY --from=api-deps /app/node_modules ./node_modules
COPY api/package.json .
COPY api/tsconfig.json .
COPY api/src ./src
RUN yarn build

FROM node:26-alpine AS web-deps-and-build

WORKDIR /app

COPY web/package.json .
COPY web/yarn.lock .
COPY web/package.json .
COPY web/src ./src
COPY web/public ./public
COPY web/vite.config.ts .
COPY web/tsconfig.json .
COPY web/tsconfig.app.json .
COPY web/tsconfig.node.json .
COPY web/index.html .

RUN npm install --global yarn
RUN yarn
RUN yarn build

FROM node:26-alpine AS main

WORKDIR /app

RUN npm install --global yarn
COPY --from=api-build /app/dist ./dist
COPY api/package.json .
COPY api/yarn.lock .
COPY --from=web-deps-and-build /app/dist ./public
RUN yarn --prod

CMD ["yarn", "start"]