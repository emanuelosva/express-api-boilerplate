/**
 * Type parsers utilities.
 * -----------------------
 */

const parseTo = (type, value) => {
  switch (type) {
    case 'number':
      return parseToInt(value)
    case 'array':
      return parseToArray(value)
    case 'boolean':
      return parseToBoolean(value)
    default:
      return value
  }
}

const parseToInt = (value) => {
  const numberValue = parseInt(value, 10)
  if (isNaN(numberValue)) throw new Error(`invalid number to parse: ${value}`)
  return numberValue
}

const parseToBoolean = (value) => {
  const falseValues = [false, 'false', undefined, 'undefined', null, 'null', '', 0]
  const trueValues = [true, 'true', '1', 1]
  if (falseValues.includes(value)) return false
  if (trueValues.includes(value)) return true
  return true
}

const parseToArray = (value, typeOfItem = 'string') => {
  if (typeof value !== 'string') throw new Error('Only can parse string values')
  const strValues = value.replace('[', '').replace(']', '')
  return strValues.split(',').map((item) => parseTo(typeOfItem, item))
}

module.exports = {
  parseToBoolean,
  parseToInt,
  parseToArray,
  parseTo,
}
