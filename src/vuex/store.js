import { reactive, watch } from 'vue'
import { storeKey } from './injectKey'
import ModuleCollection from './module/module-collection'
import { forEachValue, isPromise } from './utils'

function getNestedState(state, path) {
  return path.reduce((state, key) => state[key], state)
}

function installModule(store, rootState, path, module) {
  let isRoot = !path.length

  const namespaced = store._modules.getNameSpaced(path)

  if (!isRoot) {
    let parentState = path
      .slice(0, -1)
      .reduce((state, key) => state[key], rootState)
    parentState[path[path.length - 1]] = module.state
  }

  module.forEachGetter((getter, key) => {
    store._wrappedGetters[namespaced + key] = () => {
      return getter(getNestedState(store.state, path))
    }
  })

  module.forEachMutation((mutation, key) => {
    const entry =
      store._mutations[namespaced + key] ||
      (store._mutations[namespaced + key] = [])
    entry.push((payload) => {
      mutation.call(store, getNestedState(store.state, path), payload)
    })
  })

  module.forEachAction((action, key) => {
    const entry =
      store._actions[namespaced + key] ||
      (store._actions[namespaced + key] = [])
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

  if (store.strict) {
    enableStrictMode(store)
  }
}

function enableStrictMode(store) {
  watch(
    () => store._state.data,
    () => {
      console.assert(
        store._commiting,
        'do not mutate vuex store state outside mutation handlers'
      )
    },
    {
      // 数据变化，执行回调
      deep: true,
      // 默认是异步的，改成同步的
      flush: 'sync',
    }
  )
}

export default class Store {
  constructor(options) {
    const store = this
    store._modules = new ModuleCollection(options)
    store._actions = Object.create(null)
    store._mutations = Object.create(null)
    store._wrappedGetters = Object.create(null)

    this.strict = options.strict || false

    this._commiting = false

    const state = store._modules.root.state
    // 模块安装
    installModule(store, state, [], this._modules.root)

    resetStoreState(store, state)

    console.log(store)

    store._subscribes = []
    options.plugins.forEach((plugin) => plugin(store))
  }

  subscribe(fn) {
    this._subscribes.push(fn)
  }

  get state() {
    return this._state.data
  }

  replaceState(newState) {
    // 严格模式不能直接修改状态 所以用_withCommit包裹
    this._withCommit(() => {
      this._state.data = newState
    })
  }

  _withCommit(fn) {
    const commiting = this._commiting
    this._commiting = true
    fn()
    this._commiting = commiting
  }

  commit = (type, payload) => {
    const entry = this._mutations[type] || []
    this._withCommit(() => {
      entry && entry.forEach((handler) => handler(payload))
    })
    this._subscribes.forEach((sub) => sub({ type, payload }, this.state))
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
