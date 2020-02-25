FROM node:latest
COPY . . 
EXPOSE 5000 
RUN npm i 
CMD npm start 