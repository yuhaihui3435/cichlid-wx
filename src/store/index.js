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
    currScrollerPosition:[],
    data_loading:false,
    data_loading_txt:'数据加载中...',
    urlPrefix:'/api'
  },
  actions: {
    SET_CURRSCROLLERPOSITION:({ commit,state },param)=>{
      commit('SET_CURRSCROLLERPOSITION', param)
    },
    SET_URLPREFIX:({ commit,state },param)=>{
      commit('SET_URLPREFIX', param)
    },
  },
  mutations: {
    SET_CURRSCROLLERPOSITION:(state,param)=>{
      state.currScrollerPosition=param
    },
    SET_URLPREFIX:(state,param)=>{
      state.urlPrefix=param
    }
  }
})
export default store
