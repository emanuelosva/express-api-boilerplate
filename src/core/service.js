const { ApiError } = require('../lib')

class Service {
  constructor(model, { activeSchema = false, paginationLimit = 20 } = {}) {
    this.model = model
    this.activeSchema = activeSchema
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
      let items = await this.model.find(query).skip(skip).limit(limit)
      items = items.map((item) => this.sanitize(item))
      const count = await this.model.count()
      return { data: items, count }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getOne(id) {
    try {
      const item = await this.model.findById(id)
      if (item) {
        if (!this.activeSchema) return this.sanitize(item)
        if (item.isActive) return this.sanitize(item)
      }
      ApiError.notFound('Item not found')
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async insert(data) {
    try {
      const item = await this.model.create(data)
      return this.sanitize(item)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async update(id, data) {
    try {
      const item = await this.model.findById(id)
      if (!item || (this.activeSchema && !item.isActive)) {
        ApiError.notFound('Item not found')
      }
      Object.keys(data).forEach((key) => {
        if (key !== undefined) item[key] = data[key]
      })
      await item.save()
      return this.sanitize(item)
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

  sanitize(data) {
    let jsonData
    try {
      jsonData = data.toJSON()
    } catch (error) {
      jsonData = data
    }
    jsonData.id = jsonData._id
    delete jsonData._id
    delete jsonData.__v
    delete jsonData.password
    return jsonData
  }
}

module.exports = Service
