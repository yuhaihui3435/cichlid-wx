import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import kit from '../kit'
import qs from 'qs';


Vue.use(Vuex)


const qiniu_url='http://images.cichlid.cc/';
const store = new Vuex.Store({
  state: {
    kbList:[],
    kbPagenumber:'1',
    _szList:[],
    szList:[]
  },
  actions: {
    LOAD_KB_LIST: function ({ commit },param) {
      axios.post('/api/searchK',qs.stringify(param)).then((response) => {
        commit('SET_KB_LIST', { list: response.data })
      }, (err) => {
        console.error(err)
        kit.showMsg("系统出错了");
      })
    },
    LOAD_SZ_LIST: function ({commit,state}) {
      axios.post('/api/wc/querySpecies').then((response) => {
        commit('SET_SZ_LIST', { list: response.data })
      }, (err) => {
        console.error(err)
        kit.showMsg("系统出错了");
      })
    },
    LOAD_SZ_CHILDREN_LIST ({commit,state},param){
      axios.post('/api/adminTaxonomy/getChildrenByPId',qs.stringify(param)).then((response) => {
        commit('SET_SZ_CHILDREN_LIST', { list: response.data })
      }, (err) => {
        console.error(err)
        kit.showMsg("系统出错了");
      })
    }
  },
  mutations: {
    SET_KB_LIST: (state, { list }) => {
      let panel
      let kb
      state.kbPagenumber=list.pageNunber;
      for(let key in list.list){
        kb=list.list[key]
        panel={};
        panel.title=kb.scName;
        panel.desc=kb.zhName;
        panel.src=qiniu_url+kb.thumbnail+'?imageView2/3/w/60/h/60/q/100';
        state.kbList.push(panel);
      }
    },
    SET_SZ_LIST: (state,{list}) =>{
      state.szList=[]
      state._szList=[]
      let sz;
      let obj;
      for(let key in list){
        obj=list[key]
        sz={};
        sz.name=obj.title
        sz.value=obj.id
        sz.parent=0
        state.szList.push(sz)
        state._szList.push(sz)
      }
    },
    SET_SZ_CHILDREN_LIST (state,{list}) {
      state.szList=state._szList//将属种重置成只有大类的数据内容
      let sz;
      let obj;
      for(let key in list){
        obj=list[key]
        sz={};
        sz.name=obj.title
        sz.value=obj.id
        sz.parent=obj.parent_id
        state.szList.push(sz)
      }
    }

  },
  getters: {
    getKbList: state => {
      return state.kbList
    }
  }
})
export default store
