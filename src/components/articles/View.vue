<template>
  <div>
    <x-header :left-options="{showBack: true}"  :right-options="{showMore: false}"  style="width: 100%; position: absolute; left: 0px; top: 0px; z-index: 100;">{{art_view_headerTitle}}</x-header>
    <div  v-html="art_view_detail" style="padding:44px 10px 0px 10px;">

    </div>
  </div>

</template>
<script>

  import {XHeader } from 'vux'
  import {mapState} from 'vuex'
  export default {
    directives: {

    },
    computed: {...mapState({
      'art_view_headerTitle':state=>state.art.art_view_headerTitle,
      'art_view_detail':state=>state.art.art_view_detail
    })},
    mounted: function () {
      let shareUrl=window.location.href.split('#');
      shareUrl=shareUrl[0]+'?#'+shareUrl[1];
      this.$store.dispatch('SET_TABBARSHOW',true)
      let id=this.id
      this.$store.dispatch('LOAD_ART_VIEW',{id:id}).then(()=>{
        this.$store.dispatch('SET_SHAREINFO',{shareTitle:this.$store.state.art.art_view_headerTitle,shareImg:this.$store.state.art.art_view_detail_thumbnail,shareDesc:this.$store.state.art.art_view.summary})
        //微信分享代码
        this.$wechat.ready(() => {
          this.$wechat.onMenuShareTimeline({
            title: this.$store.state.art.art_view_headerTitle,
            link: shareUrl,
            imgUrl: (this.$store.state.art.art_view_detail_thumbnail)?this.$store.state.art.art_view_detail_thumbnail:'http://images.cichlid.cc/images/sys/app-icon72x72@2x.png',
            desc:this.$store.state.art.art_view.summary,
            success () {
              // 用户确认分享后执行的回调函数
            },
            cancel () {
              // 用户取消分享后执行的回调函数
            }
          })
          // 分享给朋友
          this.$wechat.onMenuShareAppMessage({
            title:this.$store.state.art.art_view_headerTitle,
            link: shareUrl,
            imgUrl: (this.$store.state.art.art_view_detail_thumbnail)?this.$store.state.art.art_view_detail_thumbnail:'http://images.cichlid.cc/images/sys/app-icon72x72@2x.png',
            desc:this.$store.state.art.art_view.summary,
            success: function () {

            },
            cancel: function () {

            }
          })
        })

      })
    },
    beforeCreate (){
      //微信JSSKD初始化
      this.webUrl=this.$store.state.urlPrefix + '/wc/queryWXAPPINFO';
      this.SDKRegister(this, () => {})
    },
    methods: {

    },
    components: {
      XHeader,
    },
    data(){
      return {

      }
    },
    props:['id']
  }
</script>


<style lang="less">
  @import '~vux/src/styles/1px.less';
</style>
