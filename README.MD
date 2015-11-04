# Projekti käivitamine dockeriga

* KÄIVITA REDIS SERVER

$ docker run --name kl_redis -d redis

* Lae alla keeleliin-server Dockerfile

* Loo dockeri Image fail

$ docker build -t kl_wrapper_name .

* Käivita loodud kl_wrapper_name

$ docker run --name kl_wrapper -d -it --link kl_redis:redis -p 3000:3000 -v /wrapper/concat:/src kl_wrapper


