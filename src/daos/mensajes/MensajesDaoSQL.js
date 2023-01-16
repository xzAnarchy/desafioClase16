import ContenedorSQL from "../../contenedores/ContenedorSqlite.js"

class MensajesDaoSQL {

    constructor(configMensajes, configProds) {
        this.mensajes = new ContenedorSQL(configMensajes, 'mensajes')
        this.prodsEnMensajes = new ContenedorSQL(configProds, 'prodsEnMensajes')
    }

    async guardar(mensajes = {}) {
        const result = await this.mensajes.guardar(mensajes)
        result.productos = []
        return result
    }

    async listar(_idMensajes) {
        const idMensajes = Number(_idMensajes)
        await this.mensajes.listar(idMensajes)
        const result = {
            id: idMensajes,
            productos: []
        }
        const prodsEnMensajes = await this.prodsEnMensajes.listarAll({ idMensajes })
        for (const prod of prodsEnMensajes) {
            delete prod.idMensajes
            result.productos.push(prod)
        }
        return result
    }

    async actualizar(mensajes) {
        mensajes.id = Number(mensajes.id)
        await this.prodsEnMensajes.borrarAll({ idMensajes: mensajes.id })
        const inserts = mensajes.productos.map(p => {
            return this.prodsEnMensajes.guardar({
                ...p,
                idMensajes: mensajes.id
            })
        })
        return Promise.allSettled(inserts)
    }

    async borrar(_idMensajes) {
        const idMensajes = Number(_idMensajes)
        const result = await Promise.allSettled([
            this.prodsEnMensajes.borrarAll({ idMensajes }),
            this.mensajes.borrar(idMensajes)
        ])
        return result
    }

    borrarAll() {
        return Promise.allSettled([
            this.mensajes.borrarAll(),
            this.prodsEnMensajes.borrarAll()
        ])
    }

    async listarAll() {
        const mensajesIds = await this.mensajes.listarAll()
        const mensajesMap = new Map()
        for (const msj of mensajesIds) {
            mensajesMap.set(msj.id, {
                id: msj.id,
                productos: []
            })
        }
        return [...mensajesMap.values()]
    }
}

export default MensajesDaoSQL
