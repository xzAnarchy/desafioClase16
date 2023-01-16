import ContenedorFirebase from "../../contenedores/ContenedorFirebase.js"

class MensajesDaoFirebase extends ContenedorFirebase {

    constructor() {
        super('mensajes')
    }

    async guardar(mensajes = {}) {
        return super.guardar(mensajes)
    }
}

export default MensajesDaoFirebase
