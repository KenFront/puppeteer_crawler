const obj = {
  index: 0,
  get count() {
    this.index += 1
    return this.index
  },
  reset() {
    this.index = 0
  },
}
module.exports = obj
