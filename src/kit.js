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

  getUrlByState(state){

    let query=state.route.query;
    let queryStr='';
    for(let q in query){
      queryStr+=((queryStr=='')?'?':'&')+q+"="+query[q]
    }

    return (queryStr=='')?state.route.path:state.route.path+queryStr;
  }

}

