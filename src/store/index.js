import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import kit from '../kit'
import qs from 'qs';
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
    urlPrefix:'/api',
    APPID:'',
    APPSECRET:''
  },
  actions: {

    SET_URLPREFIX:({ commit,state },param)=>{
      commit('SET_URLPREFIX', param)
    },
    LOAD_APPINFO:({commit,state})=> {
      return new Promise((resolve, reject) => {
        axios.post(state.urlPrefix + '/wc/queryWXAPPINFO').then((response) => {
          commit('SET_APPINFO', response.data)
          resolve();
        }, (err) => {
          console.error(err)
          kit.showMsg("系统出错了");
          reject();
        })
      })
    }
  },
  mutations: {

    SET_URLPREFIX:(state,param)=>{
      state.urlPrefix=param
    },
    SET_APPINFO:(state,data)=>{
      state.APPID=data.APPID;
      state.APPSECRET=data.APPSECRET;
    }
  }
})
export default store
