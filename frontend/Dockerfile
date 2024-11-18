FROM node:16.20.0

WORKDIR /opt/project

COPY package.json /opt/project
COPY package-lock.json /opt/project

RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
