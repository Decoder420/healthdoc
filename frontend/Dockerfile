FROM node:22-alpine AS dev
WORKDIR /code
ENV PUPPETEER_SKIP_DOWNLOAD=true
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM node:22-alpine AS build
WORKDIR /code
ENV PUPPETEER_SKIP_DOWNLOAD=true
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_KEYCLOAK_URL
ARG NEXT_PUBLIC_KEYCLOAK_REALM=healthdoc
ARG NEXT_PUBLIC_OIDC_CLIENT_ID=healthdoc-frontend
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_KEYCLOAK_URL=$NEXT_PUBLIC_KEYCLOAK_URL \
    NEXT_PUBLIC_KEYCLOAK_REALM=$NEXT_PUBLIC_KEYCLOAK_REALM \
    NEXT_PUBLIC_OIDC_CLIENT_ID=$NEXT_PUBLIC_OIDC_CLIENT_ID
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS prod
WORKDIR /code
ENV NODE_ENV=production
RUN chown node:node /code
COPY --chown=node:node --from=build /code/.next ./.next
COPY --chown=node:node --from=build /code/public ./public
COPY --chown=node:node --from=build /code/package.json ./
COPY --chown=node:node --from=build /code/node_modules ./node_modules
USER node
RUN npm prune --omit=dev
EXPOSE 3000
CMD ["npm", "run", "start"]
