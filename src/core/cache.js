const { promisify } = require('util')
const client = require('../db/redis')

class Redis {
  constructor(cacheSeconds = 60) {
    this.time = cacheSeconds
  }

  getCache(key) {
    return promisify(client.get).bind(client)(key)
  }

  setCahce(key, data) {
    return promisify(client.setex).bind(client)(key, this.time, JSON.stringify(data))
  }
}

class Cache extends Redis {
  constructor(collection) {
    super()
    this.collection = collection
  }

  async list(key = this.collection) {
    const data = await this.getCache(key) || null
    const res = data ? JSON.parse(data) : data
    return res
  }

  async get(key) {
    const _key = `${this.collection}_${key}`
    return this.list(_key)
  }

  async upsert(data, estraKey = null) {
    let key = `${this.collection}`
    const id = data.id ? data.id : data._id
    if (data && id) {
      key = `${key}_${id}`
    }
    key = estraKey ? `${key}_${estraKey}` : key
    this.setCahce(key, data)
    return true
  }

  async delete(key) {
    this.setCahce(key, null)
  }
}

module.exports = Cache
