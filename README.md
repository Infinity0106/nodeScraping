# DESCRIPCION 🕵🏻‍

Lo que intentaremos hacer es practicar la creacion de una base de datos con un
script, despues hacer llamadas con express para poder almacenar infoamcion y
practicar scaping ademas de introducir informacion a la base de datos por medio
de dichas llamadas y por ultimo formatear la informacion para poder sacarla y
leerla.

## parte 1

(ya deben de tener instalado postgresql ) realizamos comando express para crear
despues creamos un proyecto de front dentro de esa carpeta para que sea la app
de react y despues renderemos todo (se tiene que hacer buils e instalar
dependencias), agregamos el archivo de esquema para la base de datos y creamos
el script que se tiene que correr para crear la base de datos. haremos el setup
de heroku y obtendremos la url de la base de datos

## parte 2

creamos la base de datos conectandonos a donde se requiere con heroku info
creamos el push a heroku para poder conectar todo, instalamos

```javascript
npm install pg@6.1.0 --save
npm install cloudscraper --save
npm install cheerio --save
npm install phantom --save
```

http://es.leagueoflegends.wikia.com/wiki/Lista_de_campeones
https://euw.leagueoflegends.com/es/game-info/champions/akali

son los url que utilizamos para lleanr la base de datos con los queries y
utilizamos cherrio en campeones apra llenar la base de datos seleccionamos los
datos de la base de datos para poder crear (configurar de manera ssl para poder
conectar a heroku)

# TODO

* [x] crear base de datos postgres

* [x] crear llamada para almacenar datos en campeones
* [ ] crear llamada para almacenar datos en aspectos
* [ ] crear llamada para almacenar datos en habilidades
* [ ] crear llamada para mostrar informacion como json
* [ ] crear llamada con parametros para campeon unico
* [ ] aprender seguridad para llamadas
* [ ] problemas siguientes
