const { ApiError } = require('../lib')

class Service {
  constructor(model, cache, { name = 'item', activeSchema = false, paginationLimit = 20 } = {}) {
    this.model = model
    this.cache = cache
    this.name = name
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
      let items = await this.cache.get(`${skip}_${limit}`)
      if (!items) {
        items = await this.model.find(query).skip(skip).limit(limit)
        items = items.map((item) => this.sanitize(item))
        this.cache.upsert(items, `${skip}_${limit}`)
      }
      const count = await this.model.count()
      return { data: items, count }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getOne(id) {
    try {
      let item = await this.cache.get(id)
      if (item) return this.sanitize(item)
      item = await this.model.findById(id)
      if (item) {
        if (!this.activeSchema || item.isActive) {
          this.cache.upsert(item)
          return this.sanitize(item)
        }
      }
      ApiError.notFound(this.name + ' not found')
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
        ApiError.notFound(this.name + ' not found')
      }
      Object.keys(data).forEach((key) => {
        if (key !== undefined) item[key] = data[key]
      })
      await item.save()
      this.cache.upsert(item)
      return this.sanitize(item)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async delete(id) {
    try {
      const item = await this.model.findByIdAndDelete(id)
      if (item) return null
      ApiError.notFound(this.name + ' not found')
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
