import { createStore } from '@/vuex'

function customPlugin(store) {
  let local = localStorage.getItem('VUEX_STATE')
  if (local) {
    store.replaceState(JSON.parse(local))
  }
  store.subscribe((mutation, state) => {
    localStorage.setItem('VUEX_STATE', JSON.stringify(state))
  })
}

export default createStore({
  plugins: [customPlugin],
  strict: true,
  state: {
    count: 0,
  },
  getters: {
    double(state) {
      return state.count * 2
    },
  },
  mutations: {
    add(state, payload) {
      state.count += payload
    },
  },
  actions: {
    asyncAdd({ commit }, payload) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('add', payload)
          resolve()
        }, 1000)
      })
    },
  },
  modules: {
    aCount: {
      namespaced: true,
      state: {
        count: 0,
      },
      mutations: {
        add(state, payload) {
          state.count += payload
        },
      },
      modules: {
        cCount: {
          namespaced: true,
          state: {
            count: 0,
          },
          mutations: {
            add(state, payload) {
              state.count += payload
            },
          },
        },
      },
    },
    bCount: {
      namespaced: true,
      state: {
        count: 0,
      },
      mutations: {
        add(state, payload) {
          state.count += payload
        },
      },
    },
  },
})
