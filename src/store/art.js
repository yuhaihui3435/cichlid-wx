import axios from 'axios'
import kit from '../kit'
import qs from 'qs';
const qiniu_url='http://images.cichlid.cc/';
export default{
  state: {
    artList:[],
    artOffset:0,
    artCatalogList:[],
    art_view_headerTitle:'',
    art_view_detail:'',
  },
  actions: {
    LOAD_ART_LIST: function ({ commit,state },param) {

      state.artOffset=0
      param.offset=state.artOffset
      console.info(this)
      return new Promise((resolve, reject)=>{
        axios.post(this.state.urlPrefix+'/wc/queryArt',qs.stringify(param)).then((response) => {
          commit('SET_ART_LIST', { list: response.data })
          resolve();
        }, (err) => {
          console.error(err)
          kit.showMsg("系统出错了");
          reject();
        })
      });

    },
    LOAD_MORE_ART_LIST: function ({ commit,state },param) {
      param.offset=state.artOffset
      return new Promise((resolve, reject)=>{
        axios.post(this.state.urlPrefix+'/wc/queryArt',qs.stringify(param)).then((response) => {
          commit('ADD_ART_LIST', { list: response.data })
          resolve();
        }, (err) => {
          console.error(err)
          kit.showMsg("系统出错了");
          reject();
        })
      });

    },
    LOAD_ART_VIEW: function ({ commit,state },param) {
      state.data_loading=true;
      return new Promise((resolve, reject)=>{
        axios.post(this.state.urlPrefix+'/wc/queryArtView',qs.stringify(param)).then((response) => {
          commit('LOAD_ART_VIEW', { list: response.data })
          resolve();
        }, (err) => {
          console.error(err)
          state.data_loading=false;
          kit.showMsg("系统出错了");
          reject();
        })
      });

    },
    LOAD_ARTCATALOG_LIST: function ({commit,state}) {
      state.data_loading=true;
      axios.post(this.state.urlPrefix+'/wc/queryArtCatalog').then((response) => {
        commit('SET_ARTCATALOG_LIST', { list: response.data })
      }, (err) => {
        console.error(err)
        state.data_loading=false;
        kit.showMsg("系统出错了");
      })
    }
  },
  mutations: {
    ADD_ART_LIST: (state, { list }) => {
      let panel
      let art
      state.artOffset=list.pageNumber*list.pageSize;
      if(list.list.length==0){
        state.data_loading=false;
        return ;
      }
      for(let key in list.list){
        art=list.list[key]
        panel={};
        panel.title=art.title;
        panel.desc=art.summary;
        panel.dataId=art.id;
        if(art.thumbnail=='')
          panel.src=qiniu_url+'/images/sys/df-noPic.png?imageView2/3/w/60/h/60/q/100';
        else
          panel.src=qiniu_url+art.thumbnail+'?imageView2/3/w/60/h/60/q/100';
        state.artList.push(panel);
      }

    },
    SET_ART_LIST: (state, { list }) => {
      state.artList=[];
      let panel
      let art
      state.artOffset=list.pageNumber*list.pageSize;
      // if(list.list.length==0){
      //   state.data_loading=false;
      //   //kit.showMsg("查询结果为空")
      //   return ;
      // }
      for(let key in list.list){
        art=list.list[key]
        panel={};
        panel.title=art.title;
        panel.dataId=art.id;
        panel.desc=art.summary;
        if(art.thumbnail=='')
          panel.src=qiniu_url+'/images/sys/df-noPic.png?imageView2/3/w/60/h/60/q/100';
        else
          panel.src=qiniu_url+art.thumbnail+'?imageView2/3/w/60/h/60/q/100';
        state.artList.push(panel);
      }
    },
    LOAD_ART_VIEW: (state, { list }) => {


      state.art_view_headerTitle=list.title;
      state.art_view_detail=list.text;
      state.data_loading=false;
    },
    SET_ARTCATALOG_LIST: (state,{list}) =>{
      state.artCatalogList=[]
      let ac;
      let obj;
      for(let key in list){
        obj=list[key]
        ac={name:obj.title,value:obj.id.toString(),parent:0}
        state.artCatalogList.push(ac)
      }
      state.data_loading=false;
    }
  },
  getters: {
    // getArtList: state => {
    //   return state.artList
    // }
  }
}
