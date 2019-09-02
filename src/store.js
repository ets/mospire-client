import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authenticatedUser: null
  },
  mutations: {
    ['SET_AUTHENTICATED_USER'] (state, user) {
      state.authenticatedUser = user      
    },
  },
  actions: {
    setAuthenticatedUser ({ commit }, user) {
      commit('SET_AUTHENTICATED_USER', user)      
    },
  },
  getters: {
    authenticatedUser: state => state.authenticatedUser,
  }
})
