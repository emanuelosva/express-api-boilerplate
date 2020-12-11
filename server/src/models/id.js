/**
 * Insert the fiel "id" in mongo schema and create an index.
 */
function createId() {
  if (this.isModified('_id')) {
    this.id = this._id
    this.index({ id: 1 })
  }
}

module.exports = {
  createId,
}
