FROM    ubuntu:14.04

MAINTAINER priit@bitweb.ee

RUN apt-get update && \
    apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup | sudo bash - && \
    apt-get -y install python build-essential nodejs && \
    apt-get -y install git

RUN npm install -g forever

RUN mkdir -p /src && mkdir -p /tmp && mkdir -p /files && mkdir -p /logs && mkdir -p /config

RUN cd /src && git clone 'https://github.com/BitWeb/keeleliin-wrapper-service.git' . && npm install && echo "RunisDon"


// CGParser
// vabamorf





#Expose port

EXPOSE  3000

VOLUME ["/tmp","/files","/logs", "/config"]

CMD /./src/docker_start.sh