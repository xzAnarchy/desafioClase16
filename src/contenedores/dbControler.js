import { options } from "../mysqlDB.js";
const knexConnection = knex(options)
import knex from "knex";

export default class ProductControler {
    constructor(table) {
      this.table = table;
    }
  async list(id) {
    try {
      return knexConnection(this.table).where("id", id).select("*")
    } catch (error) {
    console.log(error);
    }
  }

  async listAll() {
    try {
      return knexConnection.from(this.table).select('*')
    } catch (error) {
      console.log(error);
    }
  }

  async save(item) {
    try {
      const ids = await knexConnection(this.table).insert(item)
      return ids
    } catch (error) {
      console.log(error)
    } 
  }

  async update(prod, id) {
    try {
      const dbid = await knexConnection.from(this.table).where("id", id).update({prod})
      return dbid
    } catch (error) {
      console.log(error)
    }
  }

  async deleteById(id) {
    try {
        return knexConnection(this.table).where("id", id).del()
    } catch (error) {
        console.log(error)
    }
}

}
