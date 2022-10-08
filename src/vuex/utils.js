export function forEachValue(obj, fn) {
  Object.keys(obj).forEach((key) => fn(obj[key], key))
}

export function isPromise(val) {
  return val && typeof val.then === 'function'
}
