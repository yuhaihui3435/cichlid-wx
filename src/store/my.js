import axios from 'axios'
import kit from '../kit'
import qs from 'qs';

export default{
  state: {
    avatar:'',
    nickname:''
  },
  actions: {
    LOAD_USER: function ({ commit,state },param) {
      return new Promise((resolve, reject)=>{
        axios.post(this.state.urlPrefix+'/wc/queryArt',qs.stringify(param)).then((response) => {
          commit('SET_USER',  response.data )
          resolve();
        }, (err) => {
          console.error(err)
          kit.showMsg("系统出错了");
          reject();
        })
      });
    },
    mutations: {
      SET_USER: (state, user) => {
        state.avatar=user.avatar
        state.nickname=user.nickname
      },
    },

  }
}
