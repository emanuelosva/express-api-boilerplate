const { ApiError } = require('../lib')

class Service {
  constructor(model, { paginationLimit = 20 } = {}) {
    this.model = model
    this.paginationLimit = paginationLimit
    this.getAll = this.getAll.bind(this)
    this.getOne = this.getOne.bind(this)
    this.insert = this.insert.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }

  async getAll(query = {}) {
    let { skip, limit } = query

    skip = skip ? Number(skip) : 0
    limit = limit ? Number(limit) : this.paginationLimit
    delete query.skip
    delete query.limit
    try {
      const items = await this.model.find(query).skip(skip).limit(limit)
      const count = await this.model.count()
      return { data: items, count }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getOne(id) {
    try {
      const item = await this.model.findOne({ id })
      if (item) return item
      ApiError.notFound('Item not found')
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async insert(data) {
    try {
      const item = await this.model.create(data)
      return item
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async update(id, data) {
    try {
      const dataToUpdate = {}
      Object.keys(data).forEach((key) => {
        if (key !== undefined) dataToUpdate[key] = data[key]
      })
      const item = await this.model.findByIdAndUpdate(id, dataToUpdate)
      if (item) return item
      ApiError.notFound('Item not found')
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async delete(id) {
    try {
      const item = await this.model.findByIdAndDelete(id)
      if (item) return null
      ApiError.notFound('Item not found')
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

module.exports = Service
