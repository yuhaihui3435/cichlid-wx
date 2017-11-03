import axios from 'axios'
import kit from '../kit'
import qs from 'qs';
const qiniu_url='http://images.cichlid.cc/';
export default{
  state: {
    kbList:[],
    kbOffset:0,
    _szList:[],
    szList:[],
    kb_view_headerTitle:'',
    kb_view_baseInfo_list:[],
    kb_view_detail:'',
    kb_photoWall:'',
    currScrollerPosition:[],
  },
  actions: {
    LOAD_KB_LIST: function ({ commit,state },param) {

      state.kbOffset=0
      param.offset=state.kbOffset
      //state.data_loading=true;
      return new Promise((resolve, reject)=>{
        axios.post(this.state.urlPrefix+'/wc/searchKB',qs.stringify(param)).then((response) => {
          commit('SET_KB_LIST', { list: response.data })
          resolve();
        }, (err) => {
          console.error(err)
          //state.data_loading=false;
          kit.showMsg("系统出错了");
          reject();
        })
      });

    },
    LOAD_MORE_KB_LIST: function ({ commit,state },param) {
      param.offset=state.kbOffset
      //state.data_loading=true;
      return new Promise((resolve, reject)=>{
        axios.post(this.state.urlPrefix+'/wc/searchKB',qs.stringify(param)).then((response) => {
          commit('ADD_KB_LIST', { list: response.data })
          resolve();
        }, (err) => {
          console.error(err)
          //state.data_loading=false;
          kit.showMsg("系统出错了");
          reject();
        })
      });

    },
    LOAD_KB_VIEW: function ({ commit,state },param) {
      state.data_loading=true;
      return new Promise((resolve, reject)=>{
        axios.post(this.state.urlPrefix+'/wc/queryKbView',qs.stringify(param)).then((response) => {
          commit('LOAD_KB_VIEW', { list: response.data })
          resolve();
        }, (err) => {
          console.error(err)
          state.data_loading=false;
          kit.showMsg("系统出错了");
          reject();
        })
      });

    },
    LOAD_SZ_LIST: function ({commit,state},param) {
      console.info(this.state.route.path)
      state.data_loading=true;
      axios.post(this.state.urlPrefix+'/wc/querySpecies?vPath='+kit.getUrlByState(this.state)).then((response) => {
        commit('SET_SZ_LIST', { list: response.data })
      }, (err) => {
        console.error(err)
        state.data_loading=false;
        kit.showMsg("系统出错了");
      })
    },
    SET_KB_CURRSCROLLERPOSITION:({ commit,state },param)=>{
      commit('SET_KB_CURRSCROLLERPOSITION', param)
    },
  },
  mutations: {
    ADD_KB_LIST: (state, { list }) => {
      //state.kbList=[];
      let panel
      let kb
      //if(list.pageNumber<list.totalPage)
      state.kbOffset=list.pageNumber*list.pageSize;
      if(list.list.length==0){
        state.data_loading=false;
        return ;
      }
      for(let key in list.list){
        kb=list.list[key]
        panel={};
        panel.title=kb.scName;
        panel.desc=kb.zhName;
        panel.dataId=kb.id;
        if(kb.thumbnail=='')
          panel.src=qiniu_url+'/images/sys/df-noPic.png?imageView2/3/w/60/h/60/q/100';
        else
          panel.src=qiniu_url+kb.thumbnail+'?imageView2/3/w/60/h/60/q/100';
        state.kbList.push(panel);
      }
      //state.data_loading=false;
    },
    SET_KB_LIST: (state, { list }) => {
      state.kbList=[];
      let panel
      let kb
      state.kbOffset=list.pageNumber*list.pageSize;
      // if(list.list.length==0){
      //   state.data_loading=false;
      //   //kit.showMsg("查询结果为空")
      //   return ;
      // }
      for(let key in list.list){
        kb=list.list[key]
        panel={};
        panel.title=kb.scName;
        panel.dataId=kb.id;
        panel.desc=kb.zhName;
        if(kb.thumbnail=='')
          panel.src=qiniu_url+'/images/sys/df-noPic.png?imageView2/3/w/60/h/60/q/100';
        else
          panel.src=qiniu_url+kb.thumbnail+'?imageView2/3/w/60/h/60/q/100';
        state.kbList.push(panel);
      }
      //state.data_loading=false;
    },
    LOAD_KB_VIEW: (state, { list }) => {

      state.kb_view_baseInfo_list=[];
      state.kb_view_headerTitle=list.scName;
      state.kb_view_detail=list.remark;
      if(list.scName!='')
        state.kb_view_baseInfo_list.push({'label':'学名','value':list.scName})
      if(list.enName!='')
        state.kb_view_baseInfo_list.push({'label':'英文名','value':list.enName})
      if(list.zhName!='')
        state.kb_view_baseInfo_list.push({'label':'中文名','value':list.zhName})
      if(list.bName!='')
        state.kb_view_baseInfo_list.push({'label':'商业名','value':list.bName})
      if(list.areaTxt!='')
        state.kb_view_baseInfo_list.push({'label':'地域名','value':list.areaTxt})
      if(list.fhTxt!='')
        state.kb_view_baseInfo_list.push({'label':'食性','value':list.fhTxt})
      if(list.rtTxt!='')
        state.kb_view_baseInfo_list.push({'label':'繁殖方式','value':list.rtTxt})
      if(list.mfTxt!='')
        state.kb_view_baseInfo_list.push({'label':'两性差别','value':list.mfTxt})
      if(list.bLen!='')
        state.kb_view_baseInfo_list.push({'label':'体长','value':list.bLen})
      if(list.breedTxt!='')
        state.kb_view_baseInfo_list.push({'label':'饲养难度','value':list.breedTxt})
      if(list.caTxt!='')
        state.kb_view_baseInfo_list.push({'label':'同种攻击','value':list.caTxt})
      if(list.haTxt!='')
        state.kb_view_baseInfo_list.push({'label':'异种攻击','value':list.haTxt})
      if(list.rareTxt!='')
        state.kb_view_baseInfo_list.push({'label':'稀有程度','value':list.rareTxt})
      if(list.reproduceTxt!='')
        state.kb_view_baseInfo_list.push({'label':'繁殖难度','value':list.reproduceTxt})
      state.data_loading=false;
    },
    SET_SZ_LIST: (state,{list}) =>{
      state.szList=[]
      state._szList=[]
      let sz;
      let obj;
      for(let key in list){
        obj=list[key]
        if(obj.parent_id==67) {
          sz={name:obj.title,value:obj.id.toString(),parent:0}
        }
        else {
          sz={name:obj.title,value:obj.id.toString(),parent:obj.parent_id.toString()}
        }
        state.szList.push(sz)
        state._szList.push(sz)
      }
      state.data_loading=false;
    },
    SET_KB_CURRSCROLLERPOSITION:(state,param)=>{
      state.currScrollerPosition=param
    },
  },
  getters: {
    getKbList: state => {
      return state.kbList
    }
  }
}
