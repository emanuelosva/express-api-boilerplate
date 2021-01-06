/**
 * Cache response class.
 * ---------------------
 *
 * This class provide the ability to
 * store the response of some request
 * in a temporal DB served by Redis and
 * return with better performace the disired
 * response.
 *
 * The cache service always must be to expose
 * at minimun 3 expected methods:
 * - list -> Get cached response of array info
 * - get -> Get cached response of single object info
 * - upsert -> Update or insert new info to cache
 */

const { promisify } = require('util')
const cacheClient = require('./client')
const config = require('../../config')

class Cache {
  constructor(collection, {
    client = cacheClient,
    cacheSeconds = config.api.CACHE_SECONDS,
  } = {}) {
    this.collection = collection
    this.time = cacheSeconds
    this.client = client
  }

  async list(key = this.collection) {
    const data = await this.getCache(key) || null
    const cachedData = data ? JSON.parse(data) : data
    return cachedData
  }

  async get(key) {
    const _key = `${this.collection}_${key}`
    const cachedData = await this.list(_key)
    return cachedData
  }

  async upsert(data, key = '') {
    let _key = this.collection
    if (key) _key = _key += `_${key}`
    else {
      const id = data.id ? data.id : data._id
      _key += `_${id}`
    }
    return await this.setCache(_key, data)
  }

  async delete(key) {
    this.setCahce(key, null)
  }

  getCache(key) {
    return promisify(this.client.get).bind(this.client)(key)
  }

  setCahce(key, data) {
    return promisify(this.client.setex).bind(this.client)(key, this.time, JSON.stringify(data))
  }
}

module.exports = Cache
