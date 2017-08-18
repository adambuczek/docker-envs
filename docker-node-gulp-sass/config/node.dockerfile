FROM node

# Install required dependencies
RUN apt-get update -y && \
  apt-get install -y\
  g++ \
  gcc \
  make \
  git

# Install (global) NPM packages/dependencies
RUN yarn global add node-gyp node-sass
