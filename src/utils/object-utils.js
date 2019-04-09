export default {

  isNull(obj) {
    return obj == null
  },
  isUndefined(obj) {
    return typeof(obj) === 'undefined'
  },
  isExisted(obj) {
    return !this.isNull(obj) && !this.isUndefined(obj)
  }
}
