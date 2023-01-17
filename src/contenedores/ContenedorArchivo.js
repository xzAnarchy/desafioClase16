import { promises as fs } from 'fs'
import config from '../config.js'
import util from 'util'

function print(objeto) {
    console.log(util.inspect(objeto, false, 12, true));
}

class ContenedorArchivo {

    constructor(ruta) {
        this.ruta = `${config.fileSystem.path}/${ruta}`;
    }

    async listar(id) {
        const objs = await this.listarAll()
        const buscado = objs.find(o => o.id == id)
        return buscado
    }

    async listarAll() {
        try {
            const objs = await fs.readFile(this.ruta, 'utf-8')
            // console.log(objs);
            // //Definimos un esquemas de autores
            // const authorSchema = new schema.Entity('authors',{}, {idAttribute:"mail"});
            // const textSchema = new schema.Entity('text');
            // const mensajeSchema = new schema.Entity('messages', {
            //     author: authorSchema,
            //     text: [textSchema]
            // });
            // const normalizedMessage = normalize(JSON.parse(objs), [mensajeSchema]);
            // print(normalizedMessage);
            return JSON.parse(objs)
        } catch (error) {
            console.log(error);
            return []
        }
    }

    async guardar(obj) {
        const objs = await this.listarAll()
        let newId
        if (objs.length == 0) {
            newId = 1
        } else {
            newId = objs[objs.length - 1].id + 1
        }
        const newObj = { ...obj, id: newId }
        objs.push(newObj)
        try {
            await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2))
            return newObj
        } catch (error) {
            throw new Error(`Error al guardar: ${error}`)
        }
    }

    async actualizar(elem) {
        const objs = await this.listarAll()
        const index = objs.findIndex(o => o.id == elem.id)
        if (index == -1) {
            throw new Error(`Error al actualizar: no se encontró el id ${id}`)
        } else {
            objs[index] = elem
            try {
                await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2))
            } catch (error) {
                throw new Error(`Error al actualizar: ${error}`)
            }
        }
    }

    async borrar(id) {
        const objs = await this.listarAll()
        const index = objs.findIndex(o => o.id == id)
        if (index == -1) {
            throw new Error(`Error al borrar: no se encontró el id ${id}`)
        }

        objs.splice(index, 1)
        try {
            await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2))
        } catch (error) {
            throw new Error(`Error al borrar: ${error}`)
        }
    }

    async borrarAll() {
        try {
            await fs.writeFile(this.ruta, JSON.stringify([], null, 2))
        } catch (error) {
            throw new Error(`Error al borrar todo: ${error}`)
        }
    }
}


export default ContenedorArchivo