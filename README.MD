# Projekti käivitamine dockeriga

* Loo config.js fail

$ cp config_dist.js config.js

* Muuda config.js faili vastavalt soovitud wrapperile

* Loo dockeri konteinerite välised kaustad

$ cd /

$ mkdir wrapper

$ cd files

$ cd tmp

$ mkdir redis_data

*   RUN OPTIONS
*   -d                  Jooksuta taustal
*   --rm                Serveri sulgemisel kustuta konteiner
*   --restart=no
*   --restart=always
* Konteinerit taustal jookustamiseks eemalda --rm ja kasuta --restart=always ning lisa -d

* RUN REDIS SERVER

$ docker run --name kl_wrapper_redis --rm -v /wrapper/redis_data:/data --restart=no redis

* BUILD SERVER

$  docker build -t kl_wrapper_name .

* RUN KEELELIIN SERVER

$ docker run --name kl_wrapper_name --rm -p 3000:3000 --link kl_wrapper_redis:redis -v /wrapper:/wrapper --restart=no kl_wrapper_name


