# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json and package-lock.json are copied
# where available
COPY package*.json ./

RUN npm install

# Expose port
EXPOSE 3000

# Start app
CMD [ "npm", "run", "start" ]