import { createStore } from '@/vuex'

export default createStore({
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
