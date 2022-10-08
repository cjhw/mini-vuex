import { forEachValue } from '../utils'
import Module from './module'

export default class ModuleCollection {
  constructor(rootModule) {
    this.root = null
    this.register(rootModule, [])
  }

  register(rawModule, path) {
    const newModule = new Module(rawModule)
    if (path.length == 0) {
      // 根模块
      this.root = new Module(rawModule)
    } else {
      const parent = path.slice(0, -1).reduce((module, current) => {
        return module.getChild(current)
      }, this.root)
      parent.addChild(path[path.length - 1], newModule)
    }

    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildrenModule, key) => {
        this.register(rawChildrenModule, path.concat(key))
      })
    }
    console.log(this.root)
    console.log(path)
  }
}
