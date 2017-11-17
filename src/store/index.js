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
    APPSECRET:'',
    tabbarShow:false,
    previewImg:'',
    isPreview:false,
  },
  actions: {

    SET_URLPREFIX:({ commit,state },param)=>{
      commit('SET_URLPREFIX', param)
    },
    SET_LOADING:({commit,state},param)=>{
      commit('SET_LOADING',param)
    },
    SET_TABBARSHOW:({commit,state},param)=>{
      commit('SET_TABBARSHOW',param)
    },
    // LOAD_APPID:({commit,state})=> {
    //   return new Promise((resolve, reject) => {
    //     axios.post(state.urlPrefix + '/wc/queryAPPID').then((response) => {
    //       commit('SET_APPID', response.data)
    //       resolve();
    //     }, (err) => {
    //       // console.error(err)
    //       // kit.showMsg("系统出错了");
    //       reject();
    //     })
    //   })
    // },
  },


  mutations: {

    SET_URLPREFIX:(state,param)=>{
      state.urlPrefix=param
    },
    SET_LOADING:(state,param)=>{
      state.data_loading=param.data_loading
      if(param.data_loading_txt)
        state.data_loading_txt=param.data_loading_txt
    },
    SET_TABBARSHOW:(state,param)=>{
      state.tabbarShow=param

    },
    // SET_APPID:(state,data)=>{
    //   state.APPID=data.APPID;
    //   state.APPSECRET=data.APPSECRET;
    // }
  }
})
export default store
