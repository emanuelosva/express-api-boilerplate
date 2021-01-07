/**
 * Env configuration utils.
 * ------------------------
 */

const { parseTo } = require('../utils/parsers')

const getOsEnv = (varName, defaulValue) => {
  const value = process.env[varName]

  if (!value) {
    if (defaulValue !== undefined) return defaulValue
    throw new Error(`${varName} missing in process.env`)
  }

  if (defaulValue) {
    const type = typeof defaulValue
    const parsedValue = parseTo(type, value)
    return parsedValue
  }
  return value
}

module.exports = {
  getOsEnv,
}
