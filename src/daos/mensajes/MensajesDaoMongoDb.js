import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js"

class MensajesDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super('mensajes', {
            mensajes: { type: [], required: true }
        })
    }

    async guardar(mensajes = {}) {
        return super.guardar(mensajes)
    }
}

export default MensajesDaoMongoDb
