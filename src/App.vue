<template>
  <div id="app" style="height:100%;">
    <lg-preview></lg-preview>
    <view-box ref="viewBox"  body-padding-bottom="55px" >
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>

    </view-box>

    <tabbar slot="bottom" v-show="tabbarShow">
      <tabbar-item link="/kb"  @on-item-click="tabbarItemClickHandler('/kb')" :selected="route.path === '/kb'">

        <span slot="label">知识库</span>
      </tabbar-item>
      <tabbar-item  link="/art" :selected="route.path === '/art'" @on-item-click="tabbarItemClickHandler('/art')" >
        <span slot="label">杂七杂八</span>
      </tabbar-item>
      <!--<tabbar-item  link="/my" :selected="route.path === '/my'" @on-item-click="tabbarItemClickHandler('/my')">-->
        <!--<span slot="label">我的</span>-->
      <!--</tabbar-item>-->
    </tabbar>
    <div v-transfer-dom>
      <loading :show="data_loading" :text="data_loading_txt"></loading>
    </div>

  </div>
</template>

<script>
  import { Loading,  TransferDomDirective as TransferDom ,ViewBox ,Tabbar, TabbarItem,XHeader,cookie } from 'vux'
  import {mapState} from 'vuex'
  import KIT from './kit'

export default {

  directives: {
    TransferDom
  },
  name: 'app',
  beforeMount:function(){
    if (process.env.NODE_ENV !== 'development') {
      console.info("生产模式")
      this.$store.dispatch('SET_URLPREFIX','');
    }else{
      console.info("开发模式")
    }
  },
  mounted: function () {
//    let vm=this;
//    let appId=vm.$store.state.APPID;
//    let appSecret=vm.$store.state.APPSECRET;
//    var timestamp = (new Date()).valueOf();
//    if(appId==''){
//      vm.$store.dispatch('LOAD_APPID').then(()=>{
//
//      });
//    }
//    vm.$wechat.config({
//      debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//      appId: appId, // 必填，公众号的唯一标识
//      timestamp: timestamp, // 必填，生成签名的时间戳
//      nonceStr: '', // 必填，生成签名的随机串
//      signature: appSecret,// 必填，签名，见附录1
//      jsApiList: ['checkJsApi',
//        'onMenuShareTimeline',
//        'onMenuShareAppMessage',
//        'onMenuShareQQ',
//        'onMenuShareWeibo',] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
//    })
  },
  computed:{ ...mapState({
    'data_loading':state=>state.data_loading,
    'data_loading_txt':state=>state.data_loading_txt,
    route: state => state.route,
    path: state => state.route.path,
    'tabbarShow':state =>state.tabbarShow,
  })},
  methods:{
    tabbarItemClickHandler(path){
//      console.info(this.$store)

    },

  },
  components: {
    Loading,ViewBox,Tabbar, TabbarItem,XHeader
  },
  data(){
    return {

    }
  }
}

</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/tap.less';
body {
  background-color: #fbf9fe;
}
html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
}
.router-view {
  width: 100%;
  top: 46px;
}
</style>
