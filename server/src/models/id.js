const { func } = require("joi");

/**
 * Insert the fiel "id" in mongo schema and create an index.
 */
function createId() {
  if (this.isModified('_id')) {
    this.id = this._id
    this.index('id')
  }
}

module.exports = {
  createId,
}
