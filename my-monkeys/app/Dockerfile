FROM node:alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install --production
RUN npm run build
ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000
CMD [ "npm", "run", "start-prod" ]
  