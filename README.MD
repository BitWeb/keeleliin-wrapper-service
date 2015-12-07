# Projekti käivitamine dockeriga (Ubuntu)

* Paigalda Docker: http://docs.docker.com/engine/installation/

* KÄIVITA REDIS SERVER

$ docker run --name kl_redis -d redis

* Lae alla keeleliin-wrapper-service Dockerfile

* Vajadusel lisa Dockerfile lisakirjeldusel vajalike programmide jaoks või paigalda need hiljem käsitsi

* Loo dockeri Image fail (kl_wrapper_name - Image nimi)

$ docker build -t kl_wrapper_name .

* Soovi korral loo teenuse seadistuste faili jaoks dockeriväline kaust

$ mkdir -p /wrapper/concat

* Käivita loodud kl_wrapper_name

$ docker run --name kl_wrapper_name -it -d --link kl_redis:redis -p 3000:3000 -v /wrapper/concat:/config kl_wrapper_name

* Muuda teenuse seadistusi /wrapper/concat/config.js

* Soovi korral tee konteineris toiminguid

$ docker exec -it kl_wrapper_name bash

* Välju konteinerist: Ctrl+P Ctrl+Q

* Uuenda teenust

$ docker exec kl_wrapper_name /src/docker_update.sh

