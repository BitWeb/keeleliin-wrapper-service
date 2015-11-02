#   docker build -t kl_lausestaja .
#
#   docker run --name kl_redis --rm --restart=no redis
#
#   docker run kl_lausestaja --name kl_lausestaja --link kl_redis:redis -v /wrapper/lausestaja/config:/config kl_lausestaja
#
#   docker kill kl_lausestaja
#
#   docker rm kl_lausestaja
#
#

FROM    ubuntu:14.04

ENV TERM xterm
ENV WRAPPER=LAUSESTAJA
ENV SERVER_URL="http://dev.bitweb.ee"
ENV SERVER_PORT=3001

RUN apt-get update && \
    apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup | sudo bash - && \
    apt-get -y install python build-essential nodejs && \
    apt-get -y install git && \
    apt-get -y install unzip

RUN npm install -g forever

RUN mkdir -p /src
RUN mkdir -p /tmp
RUN mkdir -p /files
RUN mkdir -p /logs
RUN mkdir -p /config

RUN cd /src && git clone 'https://github.com/BitWeb/keeleliin-wrapper-service.git' . && npm install && echo "Run is Done"

RUN mkdir /utils
COPY ./utils /utils
RUN unzip /utils/CGParser.zip -d /utils/
RUN unzip /utils/morfyhestaja.zip -d /utils/
RUN chmod 777 -Rf /utils/*

#Expose port
EXPOSE $SERVER_PORT

VOLUME ["/tmp","/files","/logs", "/config"]

CMD /./src/docker_start.sh