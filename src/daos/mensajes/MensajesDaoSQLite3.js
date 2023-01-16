import MensajesDaoSQL from "./MensajesDaoSQL.js"
import config from '../../config.js'

class MensajesDaoSQLite3 extends MensajesDaoSQL {

    constructor() {
        super(config.sqlite3, config.sqlite3)
    }
}

export default MensajesDaoSQLite3
