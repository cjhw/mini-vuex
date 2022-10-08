import { reactive } from 'vue'
import { storeKey } from './injectKey'
import ModuleCollection from './module/module-collection'

function installModule(store, rootState, path, module) {
  let isRoot = !path.length

  if (!isRoot) {
    let parentState = path
      .slice(0, -1)
      .reduce((state, key) => state[key], rootState)
    parentState[path[path.length - 1]] = module.state
  }

  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child)
  })
}

export default class Store {
  constructor(options) {
    const store = this
    this._modules = new ModuleCollection(options)

    const state = store._modules.root.state
    // 模块安装
    installModule(store, state, [], this._modules.root)

    console.log(store)
  }

  install(app, injectKey) {
    app.provide(injectKey || storeKey, this)
    app.config.globalProperties.$store = this
  }
}
