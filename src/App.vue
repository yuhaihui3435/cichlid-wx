<template>
  <div id="app" style="height:100%;">
    <lg-preview></lg-preview>
    <view-box ref="viewBox"  body-padding-bottom="55px" >
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>

    </view-box>

    <tabbar slot="bottom">
      <tabbar-item link="/"  @on-item-click="tabbarItemClickHandler('/')" :selected="route.path === '/'">

        <span slot="label">知识库</span>
      </tabbar-item>
      <tabbar-item  link="/art" :selected="route.path === '/art'" @on-item-click="tabbarItemClickHandler('/art')">
        <span slot="label">杂七杂八</span>
      </tabbar-item>
      <tabbar-item  link="/my" :selected="route.path === '/my'" @on-item-click="tabbarItemClickHandler('/my')">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
    <div v-transfer-dom>
      <loading :show="data_loading" :text="data_loading_txt"></loading>
    </div>

  </div>
</template>

<script>
  import { Loading,  TransferDomDirective as TransferDom ,ViewBox ,Tabbar, TabbarItem,XHeader } from 'vux'
  import {mapState} from 'vuex'
  import TB from './TabBar'

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

  },
  computed:{ ...mapState({
    'data_loading':state=>state.data_loading,
    'data_loading_txt':state=>state.data_loading_txt,
    route: state => state.route,
    path: state => state.route.path,
  })},
  methods:{
    tabbarItemClickHandler(path){
      console.info(this.$store)

    }
  },
  components: {
    Loading,TB,ViewBox,Tabbar, TabbarItem,XHeader
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
}
.router-view {
  width: 100%;
  top: 46px;
}
</style>
