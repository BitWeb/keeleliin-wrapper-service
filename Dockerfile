FROM    ubuntu:14.04

MAINTAINER priit@bitweb.ee

RUN apt-get update && \
    apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup | sudo bash - && \
    apt-get -y install python build-essential nodejs

# Provides cached layer for node_modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install && npm install -g forever
RUN mkdir -p /src && cp -a /tmp/node_modules /src/

# Define working directory
WORKDIR /src
ADD . /src

# Expose port
EXPOSE  3000

VOLUME ["/wrapper"]

# Run app using forever
CMD ["forever", "/src/app.js"]