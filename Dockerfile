FROM node:16-alpine AS build

WORKDIR /app
COPY package-lock.json package.json ./
RUN npm ci --only-prod
COPY vite.config.ts tsconfig.json index.html .env.production ./
COPY src ./src
RUN npm run build

FROM nginx:alpine AS serve

RUN apk add --no-cache bash
COPY --from=build /app/dist /usr/share/nginx/html
COPY prod_bootstrap.sh /
CMD ["bash", "/prod_bootstrap.sh", "/usr/share/nginx/html"]
