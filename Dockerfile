#   docker build -t kl_wrapper .
#   docker run --name kl_redis --rm --restart=no redis
#   docker run --name kl_wrapper -d --link kl_redis:redis -p 3000:3000 -v /wrapper/concat:/src kl_wrapper
#   docker kill kl_wrapper
#   docker rm kl_wrapper
#

FROM    ubuntu:14.04

RUN apt-get update && \
    apt-get -y install curl && \
    curl -sL https://deb.nodesource.com/setup | sudo bash - && \
    apt-get -y install python build-essential nodejs && \
    apt-get -y install git

RUN npm install -g forever

RUN mkdir -p /src
RUN cd /src && git clone 'https://github.com/BitWeb/keeleliin-wrapper-service.git' . && echo "Git is cloned 2"
RUN cd /src && npm install && echo "NPM is installed 1"

#Expose port
EXPOSE  3000

VOLUME ["/src"]

CMD /./src/docker_start.sh