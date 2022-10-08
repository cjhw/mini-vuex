import { inject, reactive } from 'vue'

const storeKey = 'store'

export function forEachValue(obj, fn) {
  Object.keys(obj).forEach((key) => fn(obj[key], key))
}

class Store {
  constructor(options) {
    const store = this
    store._state = reactive({ data: options.state })

    const _getters = options.getters
    store.getters = {}

    forEachValue(_getters, function (fn, key) {
      Object.defineProperty(store.getters, key, {
        get: () => fn(store.state),
      })
    })

    store._mutations = Object.create(null)
    store._actions = Object.create(null)
    const _mutations = options.mutations
    const _actions = options.actions

    forEachValue(_mutations, (mutation, key) => {
      store._mutations[key] = (payload) => {
        mutation.call(store, store.state, payload)
      }
    })

    forEachValue(_actions, (action, key) => {
      store._actions[key] = (payload) => {
        action.call(store, store, payload)
      }
    })
  }

  commit = (type, payload) => {
    this._mutations[type](payload)
  }

  dispatch = (type, payload) => {
    this._actions[type](payload)
  }

  get state() {
    return this._state.data
  }

  install(app, injectKey) {
    app.provide(injectKey || storeKey, this)
    app.config.globalProperties.$store = this
  }
}

export function createStore(options) {
  return new Store(options)
}

export function useStore(injectKey = null) {
  return inject(injectKey !== null ? injectKey : storeKey)
}
