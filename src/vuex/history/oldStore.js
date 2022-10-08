import { reactive } from 'vue'
import { forEachValue } from './utils'
import { storeKey } from './injectKey'

export default class Store {
  constructor(options) {
    const store = this
    store._state = reactive({ data: options.state })

    const _getters = options.getters
    store.getters = {}

    forEachValue(_getters, function (fn, key) {
      Object.defineProperty(store.getters, key, {
        enumerable: true,
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
