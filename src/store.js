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
    authenticatedUserFirstName: function (state) {
      if(state.authenticatedUser != null){
        const name = state.authenticatedUser.attributes.name ? state.authenticatedUser.attributes.name : 
        state.authenticatedUser.attributes.email.substring(0, state.authenticatedUser.attributes.email.indexOf('@') );
        return name
      }
      return null
    }
  }
})
