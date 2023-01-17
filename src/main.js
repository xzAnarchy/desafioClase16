import express from 'express'
import { Server as HttpServer } from 'http'
import { Server as IO } from 'socket.io'
const { Router } = express
import dbControler from './contenedores/dbControler.js'

//FAKER
import faker from 'faker'
faker.locale = 'es'

// NORMALIZR
import { normalize, schema } from 'normalizr';
import util from 'util'
function print(objeto) {
    console.log(util.inspect(objeto, false, 12, true));
}

//Definimos un esquemas de autores
 const authorSchema = new schema.Entity('authors',{}, {idAttribute:"mail"});
 const textSchema = new schema.Entity('text');
 const mensajeSchema = new schema.Entity('messages', {
     author: authorSchema,
     text: [textSchema]
});

// Creamos esta funcion para listar los mensajes normalizados utilizando los metodos del contenedor 
async function listarMensajesN() {
    const archivoMensajes = await mensajesApi.listarAll()
    const normalizados = normalizarMensajes(archivoMensajes)
    print(normalizados)
    return normalizados
}
const normalizarMensajes = (mensajesConId) => normalize(mensajesConId, [mensajeSchema])

// Importo el DAOS
import {
    productosDao as productosApi,
    mensajesDao as mensajesApi
} from './daos/index.js'

//--------------------------------------------
// instancio servidor, socket y api
const app = express()
const fileProducts = new dbControler("products")
const fileMessages = new dbControler("messages")

//--------------------------------------------
// configuro el socket mensajes y productos

const httpServer = new HttpServer(app)
const io = new IO(httpServer)

io.on('connection', async (socket) => {
    console.log('nuevo cliente conectado');

    //Mensajes 
    //Utilizamos esta funcion para enviar los mensajes normalizados mediante el socket y que sean recibidos en el js del html
    listarMensajesN()
    .then((mensajesN)=>{
        socket.emit('message', mensajesN)
    })   
    // una vez escuchamos al cliente y recibimos un mensaje, realizamos el envio a todos los demas pusheandolo a un array
    socket.on('newMessage', async (data) => {
        await mensajesApi.guardar(data);
        listarMensajesN()
        .then((res)=>{
            io.sockets.emit('mensajes',res)
        })
        // re enviamos por medio broadcast los msn a todos los clientes que esten conectados en ese momento
    })

    //--------------------------------------------------------------------------------------------------------------------------

    // productos
    const products = await fileProducts.listAll();
    // Le envio el historial de el array que ya tengo cuando un nuevo cliente se conecte
    socket.emit('Products', products)

    socket.on('newProduct', async (data) => {
        await fileProducts.save(data);
        const newProducts = await fileProducts.listAll();
        io.sockets.emit("Products", newProducts);
    })

})

//--------------------------------------------
// agrego middlewares
const productosRouterTest = new Router()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/api/productos-test', productosRouterTest)

//--------------------------------------------
// inicio el servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))

//-------------------------------------------------
// Inicio faker

function creaCombinacionesRandom() {
    return {
        nombre: faker.commerce.product(),
        price: faker.commerce.price(),
        thumbnail: faker.image.imageUrl()
    }
}

productosRouterTest.get('/', async (req, res) => {
    const productosRandom = []
    for (let i = 0; i < 5; i++) {
        productosRandom.push(creaCombinacionesRandom())
    }
    res.json(productosRandom)
    // const productos = await productosApi.listarAll()
    // res.json(productos)
})