FROM node:lts-alpine

# Install ffmpeg for youtube audio
RUN apk update
RUN apk add ffmpeg

WORKDIR /home/node/

COPY *.js ./
COPY *.json ./

RUN npm install

CMD [ "npm", "run", "start" ]