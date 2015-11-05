# Projekti käivitamine dockeriga

* KÄIVITA REDIS SERVER

$ docker run --name kl_redis -d redis

* Lae alla keeleliin-wrapper-service Dockerfile

* Loo dockeri Image fail

$ docker build -t kl_wrapper_name .

* Käivita loodud kl_wrapper_name

$ docker run --name kl_wrapper_name -d --link kl_redis:redis -p 3000:3000 -v /wrapper/concat:/config kl_wrapper_name

* Muuda teenuse seadistusi /wrapper/concat/config.js

* Uuenda teenust

$ docker exec kl_wrapper_name /src/docker_update.sh



