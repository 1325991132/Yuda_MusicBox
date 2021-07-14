import { createStore } from 'vuex'
import state from './state'
import * as getters from './getters'
import mutations from './mutations'

export default createStore({
  state,
  mutations,
  getters,
  actions: {
  },
  modules: {
  }
})
