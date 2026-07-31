FROM node:20-alpine AS dev
WORKDIR /code
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM node:20-alpine AS build
WORKDIR /code
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS prod
WORKDIR /code
ENV NODE_ENV=production
COPY --from=build /code/.next ./.next
COPY --from=build /code/public ./public
COPY --from=build /code/package.json ./
COPY --from=build /code/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "run", "start"]
