import ContenedorArchivo from "../../contenedores/ContenedorArchivo.js"

class MensajesDaoArchivo extends ContenedorArchivo {

    constructor() {
        super('dbMensajes.json')
    }

    async guardar(mensajes = {}) {
        return super.guardar(mensajes)
    }
}

export default MensajesDaoArchivo
