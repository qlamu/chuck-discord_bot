FROM node:lts-alpine

# Install ffmpeg for YouTube audio
RUN apk update
RUN apk add ffmpeg

WORKDIR /home/node/

COPY run.sh ./
RUN chmod +x run.sh

COPY *.js ./
COPY *.json ./
RUN npm install

ENTRYPOINT [ "./run.sh" ]