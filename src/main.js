// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import router from './router/index'
import { cookie,AlertPlugin, ToastPlugin,ConfigPlugin,WechatPlugin,ConfirmPlugin } from 'vux'
import VueLazyload from 'vue-lazyload'
import store from './store/index'
import { sync } from 'vuex-router-sync'
import vuePicturePreview from './components/vue-picture-preview-custom/'
import HTTP from './http'


Vue.use(ConfigPlugin, {
  $layout: 'VIEW_BOX' // global config for VUX, since v2.5.12
})
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(WechatPlugin)
Vue.use(ConfirmPlugin)
Vue.use(vuePicturePreview)

Vue.use(VueLazyload,{
  preload:1.3,//预加载的宽高
  loading:"http://images.cichlid.cc/images/sys/app-icon72x72@2x.png",
  error:"http://images.cichlid.cc/images/sys/app-icon72x72@2x.png",
  attempt:3,//尝试加载的次数
  listenEvents:['scroll','wheel','mousewheel','resize','animationend','transitionend','touchmove'], //你想让vue监听的事件
})

Vue.prototype.SDKRegister = (that, callback) => {
  // 接入微信JSSDK
  // 获取微信JSSDK配置
  let url = that.webUrl
  let shareUrl=that.$route.path;
  HTTP.post(url,{shareUrl:shareUrl}).then(response => {
    if(response&&response.status==200) {
      let res = response.data
      console.info("服务端返回的jssdk相关的数据>>>" + res)
      that.$wechat.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.appId, // 必填，公众号的唯一标识
        timestamp: res.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.nonceStr, // 必填，生成签名的随机串
        signature: res.signature, // 必填，签名，见附录1
        // jsApiList: res.jsApiList
        jsApiList: [
          'checkJsApi',
          'onMenuShareAppMessage', // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
          'onMenuShareTimeline', // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
          'onMenuShareQQ', // 获取“分享到QQ”按钮点击状态及自定义分享内容接口
          'onMenuShareWeibo', // 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
          'showAllNonBaseMenuItem'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      })
    }
  })
  that.$wechat.ready((res) => {
    console.log(res);
    //that.$wechat.hideAllNonBaseMenuItem()
    // 分享到朋友圈
    let link = that.$store.state.shareUrl
    link=(link=='')?'www.cichlid.cc/index.html#/':link
    let title = that.$store.state.shareTitle
    title=(title=='')?'慈鲷CC':title
    let imgUrl = that.$store.state.shareImg
    imgUrl=(imgUrl=='')?'http://images.cichlid.cc/images/sys/app-icon72x72@2x.png':imgUrl
    let desc = that.$store.state.shareDesc

    that.$wechat.onMenuShareTimeline({
      title: title, // 分享标题
      link: link, // 分享链接
      imgUrl: imgUrl, // 分享图标
      success () {
        // 用户确认分享后执行的回调函数

      },
      cancel () {
        // 用户取消分享后执行的回调函数
      }
    })
    // 分享给朋友
    that.$wechat.onMenuShareAppMessage({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: imgUrl, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数

      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    })
    // 如果需要定制ready回调方法
    if(callback){
      callback.call(that)
    }
  })
}

router.beforeEach((to, from, next) => {

  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    //document.title = document.title+'-'+to.meta.title;
  }
  next();
})

require('es6-promise').polyfill()

FastClick.attach(document.body)

Vue.config.productionTip = false

sync(store, router)


/* eslint-disable no-new */
const vue=new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app-box')




export default vue
