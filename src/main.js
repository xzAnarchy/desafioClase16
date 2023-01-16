import express from 'express'
import { Server as HttpServer } from 'http'
import { Server as IO } from 'socket.io'
import dbControler from './contenedores/dbControler.js'
import faker from 'faker'
const { Router } = express
faker.locale = 'es'

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

// const messages = [
//     { author: 'Pablo', text: 'Hola, que tal' },
//     { author: 'Marcelo', text: 'muy bien y tu?' },
//     { author: 'Belen', text: 'Hola!!' }
// ]
// const Products = [
//     { title: 'agua', price: 20, thumbnail: 'https://dummyimage.com/250/000/fff'}
// ]

io.on('connection', async (socket) => {
    console.log('nuevo cliente conectado');

    //Mensajes 
    const messages = await mensajesApi.listarAll();
    // Le envio el historial de el array que ya tengo cuando un nuevo cliente se conecte
    socket.emit('message', messages)
    // una vez escuchamos al cliente y recibimos un mensaje, realizamos el envio a todos los demas pusheandolo a un array
    socket.on('newMessage', async (data) => {
        await fileMessages.save(data);
        const newMessages = await fileMessages.listAll();
        // re enviamos por medio broadcast los msn a todos los clientes que esten conectados en ese momento
        io.sockets.emit('message', newMessages)
    })

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