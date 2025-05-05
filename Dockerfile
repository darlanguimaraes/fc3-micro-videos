FROM node:22.15-slim

RUN npm install -g @nestjs/cli@11.0.7

USER node

WORKDIR /home/node/app

CMD ["tail", "-f", "/dev/null"]