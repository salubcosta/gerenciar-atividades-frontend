FROM node:20-alpine AS build

WORKDIR /app

ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS production

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENV APP_URL=http://localhost:3000

CMD ["sh", "-c", "printf '\\nAplicação disponível em: %s\\n\\n' \"$APP_URL\"; exec nginx -g 'daemon off;'"]
