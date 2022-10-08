import { inject } from 'vue'

export const storeKey = 'store'

export function useStore(injectKey = null) {
  return inject(injectKey !== null ? injectKey : storeKey)
}
