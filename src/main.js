// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
//import VueRouter from 'vue-router'
import App from './App'
//import Home from './components/HelloFromVux'
import router from './router/index'
import { AlertPlugin, ToastPlugin } from 'vux'
import VueScroller from 'vue-scroller'
import VueLazyload from 'vue-lazyload'

Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(VueScroller)

Vue.use(VueLazyload,{
  preload:1.3,//预加载的宽高
  loading:"http://images.cichlid.cc/images/sys/app-icon72x72@2x.png",
  error:"http://images.cichlid.cc/images/sys/app-icon72x72@2x.png",
  attempt:3,//尝试加载的次数
  listenEvents:['scroll','wheel','mousewheel','resize','animationend','transitionend','touchmove'], //你想让vue监听的事件
})

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
