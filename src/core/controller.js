/**
 * Generic Controller class.
 * ----------------------
 *
 * All controller classes must be inherit
 * from it.
 * This class perform the basic CRUD operation
 * with the configuration set in the constructor.
 */

const response = require('./reponse')

class Controller {
  constructor(service, {
    name = 'item',
    queryField = 'id',
    queryIn = 'params',
    addUserOnCreate = false,
    aditionalFilter = {},
  } = {}) {
    this.service = service
    this.name = name
    this.queryField = queryField
    this.queryIn = queryIn
    this.addUserOnCreate = addUserOnCreate
    this.filter = aditionalFilter

    this.list = this.list.bind(this)
    this.retrieve = this.retrieve.bind(this)
    this.insert = this.insert.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  async list(req, res, next) {
    try {
      const { query } = req
      const data = await this.service.getAll({ ...query, ...this.filter })
      return response.success(req, res, 200, data, `${this.name}s retrieved`)
    } catch (error) {
      return next(error)
    }
  }

  async retrieve(req, res, next) {
    try {
      const query = this._getQueryFilter(req)
      const data = await this.service.getOne(query)
      return response.success(req, res, 200, data, `${this.serviceName} retrieved`)
    } catch (error) {
      return next(error)
    }
  }

  async insert(req, res, next) {
    try {
      const { body: DTO } = req
      const data = await this.service.insert(DTO)
      return response.success(req, res, 201, data, `${this.serviceName} inserted`)
    } catch (error) {
      return next(error)
    }
  }

  async update(req, res, next) {
    try {
      const query = this._getQueryFilter(req)
      const { body: DTO } = req
      const data = await this.service.update(query, DTO)
      return response.success(req, res, 200, data, `${this.serviceName} updated`)
    } catch (error) {
      return next(error)
    }
  }

  async delete(req, res, next) {
    try {
      const query = this._getQueryFilter(req)
      await this.service.delete(query)
      return response.success(req, res, 204, {}, `${this.serviceName} deleted`)
    } catch (error) {
      return next(error)
    }
  }

  _getQueryFilter(req, queryField = this.queryField, queryIn = this.queryIn) {
    const queryValue = req[queryIn]
    return { [queryField]: queryValue, ...this.filter }
  }
}

module.exports = Controller
