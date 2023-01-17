import { json } from 'express'

let productosDao
let mensajesDao

switch ('json') {
    case 'json':
        const { default: ProductosDaoArchivo } = await import('./productos/ProductosDaoArchivo.js')
        const { default: MensajesDaoArchivo } = await import('./mensajes/MensajesDaoArchivo.js')

        productosDao = new ProductosDaoArchivo()
        mensajesDao = new MensajesDaoArchivo()
    //     break
    // case 'firebase':
    //     const { default: ProductosDaoFirebase } = await import('./productos/ProductosDaoFirebase.js')
    //     const { default: MensajesDaoFirebase } = await import('./mensajes/MensajesDaoFirebase.js')

    //     productosDao = new ProductosDaoFirebase()
    //     mensajesDao = new MensajesDaoFirebase()
    //     break
    // case 'mongodb':
    //     const { default: ProductosDaoMongoDb } = await import('./productos/ProductosDaoMongoDb.js')
    //     const { default: MensajesDaoMongoDb } = await import('./mensajes/MensajesDaoMongoDb.js')

    //     productosDao = new ProductosDaoMongoDb()
    //     mensajesDao = new MensajesDaoMongoDb()
    //     break
    // case 'sqlite3':
    //     const { default: ProductosDaoSQLite3 } = await import('./productos/ProductosDaoSQLite3.js')
    //     const { default: MensajesDaoSQLite3 } = await import('./mensajes/MensajesDaoSQLite3.js.js')

    //     productosDao = new ProductosDaoSQLite3()
    //     mensajesDao = new MensajesDaoSQLite3()
    //     break
}

export { productosDao, mensajesDao }