# stage 1 - build frontend
FROM node:16.20.0 as build-deps

WORKDIR /app

COPY ./frontend/package.json /app/
COPY ./frontend/package-lock.json /app/

RUN npm install

COPY ./frontend /app/
RUN npm run build

# stage 2 - nginx
FROM nginx:stable

COPY nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build-deps /app/dist/ /dist/

CMD ["nginx", "-g", "daemon off;"]

