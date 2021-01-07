/**
 * Sluglify.
 * ---------
 *
 * Covert a title, paragraph or any
 * text into a valid slug string.
 */

const sluglifySync = (value, separator = '-') => {
  if (typeof value !== 'string') {
    throw new Error('sluglify expects a string value')
  }
  const translate = {
    ä: 'a',
    Ä: 'A',
    á: 'a',
    Á: 'A',
    é: 'e',
    É: 'e',
    í: 'i',
    Í: 'I',
    ö: 'o',
    Ö: 'O',
    ó: 'o',
    Ó: 'O',
    ü: 'u',
    Ü: 'U',
    ú: 'u',
    Ú: 'u',
    ñ: 'n',
    Ñ: 'N',
  }
  const slug = value
    .replace(/[äÄáÁéÉíÍöÖóÓüÜúÚñÑ@]/g, (match) => translate[match])
    .split('').reduce((result, word) => result + word.replace(/[^\w\s$*_+~.()'"!\-:@]+/g, ''), '')
    .trim().toLowerCase()
    .replace(new RegExp('[\\s' + separator + ']+', 'g'), separator)
    .replace(new RegExp('[^a-zA-Z0-9' + separator + ']', 'g'), '')
    .replace(new RegExp('[\\s' + separator + ']+', 'g'), separator)
  return slug
}

const sluglify = (value, separator = '-') => {
  return new Promise((resolve, reject) => {
    try {
      const slug = sluglifySync(value, separator)
      return resolve(slug)
    } catch (error) {
      return reject(error)
    }
  })
}

module.exports = {
  sluglifySync,
  sluglify,
}
