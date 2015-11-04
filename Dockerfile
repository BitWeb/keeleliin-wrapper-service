#   docker build -t kl_wrapper .
#   docker run --name kl_redis --rm --restart=no redis
#   docker run --name kl_wrapper -d -it --link kl_redis:redis -p 3000:3000 -v /config:/config -v /logs:/logs kl_wrapper
#   docker kill kl_wrapper
#   docker rm kl_wrapper
#

FROM    ubuntu:14.04

RUN apt-get update && apt-get -y install nodejs npm git

RUN npm install -g forever

RUN mkdir -p /src
RUN cd /src && git clone 'https://github.com/BitWeb/keeleliin-wrapper-service.git' . && echo "Git is cloned 1"
RUN cd /src && npm install && echo "NPM is installed 1"

#Expose port
EXPOSE  3000

VOLUME ["/src"]

CMD /./src/docker_start.sh