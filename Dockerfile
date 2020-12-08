FROM node:lts-alpine

WORKDIR /home/node/

COPY *.js ./
COPY *.json ./

RUN npm install

# For youtube audio
RUN apk update
RUN apk add ffmpeg

CMD [ "npm", "run", "start" ]