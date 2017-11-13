import HTTP from '../http'
import kit from '../kit'
const qiniu_url='http://images.cichlid.cc/';
export default{
  state: {
    artList:[],
    artOffset:0,
    artCatalogList:[],
    art_view_headerTitle:'',
    art_view_detail:'',
    currScrollerPosition:[],
  },
  actions: {
    LOAD_ART_LIST: function ({ commit,state },param) {

      state.artOffset=0
      param.offset=state.artOffset

      return new Promise((resolve, reject)=>{
        let res=HTTP.post(this.state.urlPrefix+'/wc/queryArt',param)
        res.then((response)=>{
          if(response&&response.status==200){
            commit('SET_ART_LIST', { list: response.data })
          }
        })
        resolve();
      });

    },
    LOAD_MORE_ART_LIST: function ({ commit,state },param) {
      param.offset=state.artOffset
      return new Promise((resolve, reject)=>{
        let res=HTTP.post(this.state.urlPrefix+'/wc/queryArt',param)
        res.then((response)=>{
          if(response&&response.status==200){
            commit('ADD_ART_LIST', { list: response.data })

          }
        })

        resolve();
      });

    },
    LOAD_ART_VIEW: function ({ commit,state },param) {

      return new Promise((resolve, reject)=>{
        let res=HTTP.post(this.state.urlPrefix+'/wc/queryArtView',param)
        res.then((response)=>{
          if(response.status==200){
            commit('LOAD_ART_VIEW', { list: response.data })
          }
        })

        resolve();
      });

    },
    LOAD_ARTCATALOG_LIST: function ({commit,state}) {

      let res=HTTP.post(this.state.urlPrefix+'/wc/queryArtCatalog')
      res.then((response)=>{
        if(response.status==200)
        {
          commit('SET_ARTCATALOG_LIST', { list: response.data })
        }
      })

    },
    SET_ART_CURRSCROLLERPOSITION:({ commit,state },param)=>{
      commit('SET_ART_CURRSCROLLERPOSITION', param)
    },
  },
  mutations: {
    ADD_ART_LIST: (state, { list }) => {
      let panel
      let art
      state.artOffset=list.pageNumber*list.pageSize;
      if(list.list.length==0){
        //state.data_loading=false;
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
    },
    SET_ART_CURRSCROLLERPOSITION:(state,param)=>{
      state.currScrollerPosition=param
    },
  },
  getters: {
    // getArtList: state => {
    //   return state.artList
    // }
  }
}
