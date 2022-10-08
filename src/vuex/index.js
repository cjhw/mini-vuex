import { useStore } from './injectKey'
import Store from './store'

function createStore(options) {
  return new Store(options)
}

export { useStore, createStore }
