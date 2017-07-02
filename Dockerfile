FROM node:boron

RUN mkdir -p /usr/src/cpm
WORKDIR /usr/src/cpm

COPY package.json /usr/src/cpm/
RUN npm install
COPY . /usr/src/cpm

EXPOSE 3000
CMD [ "npm", "start" ]