# desafioClase16
## VIEWS 
Encontraran todo el maquetado del front-end con plantillas - html , conectados con el archivo js de la carpeta public, donde tambien se encuentra el CSS.

-----------------------------------------------------------------------------------------------------------------------------------------------------------

## SRC
Dentro de la carpeta SRC se encontaran con varias carpetas y dos archivos JS:

### MAIN.JS
Aqui encontraran la mayoria de configuraciones del servidor express y todas las importaciones de todos los modulos que se utilizaron

### CONFIG.JS 
Son todas las configuraciones de rutas, mongo, sql. Se utilizan para los controladores.

### ROUTERS FOLDER
En esta carpeta nos encontraremos tres (3) carpetas adicionales:

#### API FOLDER
Dentro de esta carpeta se encuentra productos.js, consiste en una ruta (api rest) donde al hacer un GET se ejecuta una funcion que muestran en el DOM cinco (5) productos random utilizando una funcion definida en al carpeta MOCK, basada en metodos de FAKER

#### WEB FOLDER
En esta carpeta van a encontrar todos los metodos de autenticacion utilizados en el desafio, definidos principalmente en el archivo AUTH.JS, una vez se realizan las autenticaciones establecidad en el archivo AUTH, se redirige al HOME.JS donde se utiliza un middleware definido en en la carpeta AUTH donde si no tienes un nombre guardado en sesion, seras redirigido al login.

#### WS FOLDER (WEB SOCKET)
En esta carpeta se defininen todos los "canales" del socket donde se recibe y se envia la informacion, utilizando los metodos definidos en el api, que a su vez se extienden de los controllers.
