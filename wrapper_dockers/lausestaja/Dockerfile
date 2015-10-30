FROM    ubuntu:14.04

MAINTAINER priit@bitweb.ee

ENV TERM xterm
ENV WRAPPER=LAUSESTAJA
ENV SERVER_URL="http://dev.bitweb.ee"
ENV SERVER_PORT=3001

RUN apt-get update && \
    apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup | sudo bash - && \
    apt-get -y install python build-essential nodejs && \
    apt-get -y install git

RUN apt-get install unzip

RUN npm install -g forever

RUN mkdir -p /tmp && mkdir -p /files && mkdir -p /logs && mkdir -p /config

RUN mkdir -p /src

RUN cd /src && git clone 'https://github.com/BitWeb/keeleliin-server.git' . && npm install && echo "Run is Done 2.2"

RUN mkdir /utils
COPY ./utils /utils
RUN unzip /utils/CGParser.zip -d /utils/
RUN unzip /utils/morfyhestaja.zip -d /utils/
RUN chmod 777 -Rf /utils/*

#Expose port
EXPOSE  3000

VOLUME ["/tmp","/keeleliin_files","/keeleliin_logs", "/config"]

CMD /./src/docker_start.sh