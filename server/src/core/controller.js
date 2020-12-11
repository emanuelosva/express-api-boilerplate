const response = require('./reponse')

class Controller {
  constructor(service, serviceName = 'item') {
    this.service = service
    this.serviceName = serviceName
    this.getAll = this.getAll.bind(this)
    this.getOne = this.getOne.bind(this)
    this.insert = this.insert.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  async getAll(req, res, next) {
    try {
      const { query } = req
      const data = await this.service.getAll(query)
      return response.success(req, res, 200, data, `${this.service}s retrieved`)
    } catch (error) {
      return next(error)
    }
  }

  async getOne(req, res, next) {
    try {
      const { params: { id } } = req
      const data = await this.service.getOne(id)
      return response.success(req, res, 200, data, `${this.service} retrieved`)
    } catch (error) {
      return next(error)
    }
  }

  async insert(req, res, next) {
    try {
      const { body: itemDTO } = req
      const data = await this.service.insert(itemDTO)
      return response.success(req, res, 201, data, `${this.service} inserted`)
    } catch (error) {
      return next(error)
    }
  }

  async update(req, res, next) {
    try {
      const { body: itemDTO, params: { id } } = req
      const data = await this.service.update(id, itemDTO)
      return response.success(req, res, 200, data, `${this.service} updated`)
    } catch (error) {
      return next(error)
    }
  }

  async delete(req, res, next) {
    try {
      const { params: { id } } = req
      const data = await this.service.delete(id)
      return response.success(req, res, 200, data, `${this.service} deleted`)
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = Controller
