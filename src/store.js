import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentMonth: 1
  },
  mutations: {
    resetCurrentMonth(state,current){
      if(current<1){
        current = 1;
      }
      if(current>12){
        current = 12;
      }
      state.currentMonth = current;
    }
  },
  actions: {

  }
})
