import vue from './main'
import {cookie } from 'vux'
export default {
  showMsg(msg,title) {
    console.info(vue);
    vue.$vux.alert.show({
      title: title?title:'提示消息',
      content: msg,
      onShow () {

      },
      onHide () {

      }
    })
  },
  //获取控件左绝对位置
  getAbsoluteLeft(objectId) {
    let o = document.getElementById(objectId)
    let oLeft = o.offsetLeft
    while (o.offsetParent != null) {
      let oParent = o.offsetParent
      oLeft += oParent.offsetLeft
      o = oParent
    }
    return oLeft
  },


  //获取控件上绝对位置
  getAbsoluteTop(objectId) {
    let o = document.getElementById(objectId);
    let oTop = o.offsetTop;
    while (o.offsetParent != null) {
      let oParent = o.offsetParent
      oTop += oParent.offsetTop  // Add parent top position
      o = oParent
    }
    return oTop
  },

  //获取控件宽度
  getElementWidth(objectId) {
    let x = document.getElementById(objectId);
    return x.offsetWidth;
  },


  //获取控件高度
  getElementHeight(objectId) {
    let x = document.getElementById(objectId);
    return x.offsetHeight;
  },

  checkLogin(vm,cbPath){
   alert(window.document.domain);
    let ccId=cookie.get("ccId");
    vm.$vux.toast.show({
      text: ccId
    })
    if(!ccId){
      vm.$store.dispatch('LOAD_APPINFO').then(()=>{
        let appId=vue.$store.state.APPID;
        let callbackUrl=encodeURIComponent('http://www.cichlid.cc/wc/wxCallback');
        let wxUrl='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appId+'&redirect_uri='+callbackUrl+'&response_type=code&scope=snsapi_userinfo&state='+cbPath+'#wechat_redirect'
        window.location.href=wxUrl

      })

    }else{
      vm.$router.push({ path: 'kb'})
    }
  }


}

