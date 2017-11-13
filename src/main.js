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
