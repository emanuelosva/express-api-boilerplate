/**
 * Generic Service class.
 * ----------------------
 *
 * All services classes must be inherit
 * from it.
 * This class perform the basic CRUD operation
 * with the configuration set in the constructor.
 */

const { ApiError } = require('../lib')

class Service {
  constructor(model, {
    cache = null,
    name = 'item',
    checkIfUserHasAccess = false,
    ownerFieldOnItem = 'user',
    paginationLimit = 50,
  } = {},
  ) {
    this.model = model
    this.cache = cache
    this.name = name
    this.paginationLimit = paginationLimit
    this.checkIfUserHasAccess = checkIfUserHasAccess
    this.ownerFieldOnItem = ownerFieldOnItem
  }

  async getMany(query = {}) {
    try {
      const { skip, limit } = this._getSkipLimit(query)
      let items = null

      if (this.cache) {
        const cacheQuery = this._getCacheQuery(query, skip, limit)
        items = await this.cache.get(cacheQuery)
        if (!items) {
          items = await this.model.find(query).skip(skip).limit(limit)
          await this.cache.upsert(items, cacheQuery)
        }
      } else {
        items = await this.model.find(query).skip(skip).limit(limit)
      }

      const count = await this.model.count()
      return { data: items, count }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getOne(query, user = null) {
    try {
      let item = null
      if (this.cache) {
        const cacheQuery = this._getCacheQuery(query)
        item = await this.cache.get(cacheQuery)
        if (!item) {
          item = await this.getOrRaiseNotFound(query, this.model)
          await this.cache.upsert(item, cacheQuery)
        }
      } else {
        item = await this.getOrRaiseNotFound(query, this.model)
      }
      this.isAuthorized(item, user)
      return item
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

  async update(query, data, user = null) {
    try {
      const item = await this.getOrRaiseNotFound(query, this.model)
      this.isAuthorized(item, user)
      const itemUpdated = await this.performUpdate(item, data)
      return itemUpdated
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async performUpdate(item, data) {
    Object.keys(data)
      .filter((key) => data[key] !== undefined)
      .forEach((key) => (item[key] = data[key]))

    await item.save()
    return item
  }

  async delete(query, user = null) {
    try {
      const item = await this.getOrRaiseNotFound(query, this.model)
      this.isAuthorized(item, user)
      const deletedData = await item.delete()
      return deletedData
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getOrRaiseNotFound(query, model) {
    const item = await model.findOne(query)
    if (!item) ApiError.raise.notFound(`${this.name} not found`)
    return item
  }

  isAuthorized(item, user) {
    if (this.checkIfUserHasAccess) {
      if (item[this.ownerFieldOnItem] === user.id) return null
      ApiError.raise.forbidden()
    }
    return null
  }

  _getSkipLimit(query = {}) {
    let { skip, limit } = query
    skip = skip ? Number(skip) : 0
    limit = limit ? Number(limit) : this.paginationLimit
    delete query.skip
    delete query.limit
    return { skip, limit }
  }

  _getCacheQuery(query, skip = null, limit = null) {
    const queryList = []
    if (skip) queryList.push(skip)
    if (limit) queryList.push(limit)
    Object.values(query).forEach((value) => queryList.push(value))
    return queryList.join('_')
  }
}

module.exports = Service
