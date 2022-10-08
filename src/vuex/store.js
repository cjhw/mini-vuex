import { reactive } from 'vue'
import { storeKey } from './injectKey'
import ModuleCollection from './module/module-collection'
import { forEachValue, isPromise } from './utils'

function getNestedState(state, path) {
  return path.reduce((state, key) => state[key], state)
}

function installModule(store, rootState, path, module) {
  let isRoot = !path.length

  if (!isRoot) {
    let parentState = path
      .slice(0, -1)
      .reduce((state, key) => state[key], rootState)
    parentState[path[path.length - 1]] = module.state
  }

  module.forEachGetter((getter, key) => {
    store._wrappedGetters[key] = () => {
      return getter(getNestedState(store.state, path))
    }
  })

  module.forEachMutation((mutation, key) => {
    const entry = store._mutations[key] || (store._mutations[key] = [])
    entry.push((payload) => {
      mutation.call(store, getNestedState(store.state, path), payload)
    })
  })

  module.forEachAction((action, key) => {
    const entry = store._actions[key] || (store._actions[key] = [])
    entry.push((payload) => {
      let res = action.call(store, store, payload)
      if (!isPromise(res)) {
        return Promise.resolve(res)
      }
      return res
    })
  })

  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child)
  })
}

function resetStoreState(store, state) {
  store._state = reactive({ data: state })
  const wrappedGetters = store._wrappedGetters
  store.getters = {}
  forEachValue(wrappedGetters, (getter, key) => {
    Object.defineProperty(store.getters, key, {
      get: getter,
      enumerable: true,
    })
  })
}

export default class Store {
  constructor(options) {
    const store = this
    store._modules = new ModuleCollection(options)
    store._actions = Object.create(null)
    store._mutations = Object.create(null)
    store._wrappedGetters = Object.create(null)

    const state = store._modules.root.state
    // 模块安装
    installModule(store, state, [], this._modules.root)

    resetStoreState(store, state)

    console.log(store)
  }

  get state() {
    return this._state.data
  }

  commit = (type, payload) => {
    const entry = this._mutations[type] || []
    entry && entry.forEach((handler) => handler(payload))
  }

  dispatch = (type, payload) => {
    const entry = this._actions[type] || []
    return Promise.all(entry.map((handler) => handler(payload)))
  }

  install(app, injectKey) {
    app.provide(injectKey || storeKey, this)
    app.config.globalProperties.$store = this
  }
}
