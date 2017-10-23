import Vue from 'vue'
import Vuex from 'vuex'

import  { LoadingPlugin } from 'vux'
import kbModule from './kb'
import artModule from './art'

Vue.use(LoadingPlugin)
Vue.use(Vuex)



const store = new Vuex.Store({
  modules:{
    kb:kbModule,
    art:artModule
  },
  state:{

    data_loading:false,
    data_loading_txt:'数据加载中...',
    urlPrefix:'/api'
  },
  actions: {

    SET_URLPREFIX:({ commit,state },param)=>{
      commit('SET_URLPREFIX', param)
    },
  },
  mutations: {

    SET_URLPREFIX:(state,param)=>{
      state.urlPrefix=param
    }
  }
})
export default store
