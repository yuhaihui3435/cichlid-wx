import axios from 'axios'
import qs from 'qs'
import KIT from './kit'
import VUE from './main'

axios.interceptors.request.use(config => {
  VUE.$store.dispatch("SET_LOADING",{data_loading:true});
  return config
}, error => {
  return Promise.reject(error)
})


axios.interceptors.response.use(response => response, error =>  Promise.reject(error))

function responseHandle(response) {
    VUE.$store.dispatch("SET_LOADING",{data_loading:false});
    return response
}

function errHandle(err) {
  VUE.$store.dispatch("SET_LOADING",{data_loading:false});
  if(err.response.status==401){
    console.info("未授权处理")
    let path=VUE.$route.path;
    let params=VUE.$route.params;
    console.info("path="+path)
    console.info("params="+params)
    window.localStorage.setItem("lastParams",params);
    window.localStorage.setItem("lastPath",path);
    window.location.href=VUE.$store.state.urlPrefix+"/wc/toWXOAuth2"
  }else{
    KIT.showMsg("系统错误，请稍后再试!")
  }

}



export default {
  post(url, data) {
    return axios({
      method: 'post',
      url,
      data: qs.stringify(data),
      timeout: 30000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(responseHandle).catch(errHandle)
  },
  get(url, params) {
    return axios({
      method: 'get',
      url,
      params,
      timeout: 30000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(responseHandle).catch(errHandle)
  }
}
