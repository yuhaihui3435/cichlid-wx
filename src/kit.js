import vue from './main'
export default {
  showMsg(msg,title) {
    console.info(this)
    vue.$vux.alert.show({
      title: title?title:'提示消息',
      content: msg,
      onShow () {

      },
      onHide () {

      }
    })
  }
}

