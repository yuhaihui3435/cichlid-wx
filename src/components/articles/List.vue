<template>
  <div >
    <x-header :left-options="{showBack: false}"  :right-options="{showMore: true}" @on-click-more="showMenus = true" style="width: 100%; position: absolute; left: 0px; top: 0px; z-index: 100;">杂七杂八</x-header>
    <div style="padding-top: 46px;width: 100%;">
      <group>
        <popup-picker title="选择分类" :data="artCatalogList" :columns="1" v-model="artCatalogVal" ref="artPicker" show-name @on-change="artCatalog_onChange"></popup-picker>
      </group>

    </div>
    <scroller ref="artList_scroller"
              :on-refresh="refresh"
              :on-infinite="infinite" style="top: 105px;" :height="'100%'" noDataText="">

      <panel header="查询结果"  :list="artList" :type="panelType" @on-img-error="onImgError" @on-click-item="queryArtView"></panel>
    </scroller>

    <div v-transfer-dom>
      <actionsheet :menus="menus" v-model="showMenus" @on-click-menu-menu1="clearArtCatalog"  show-cancel></actionsheet>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {XHeader,TransferDom,Selector,Group,PopupPicker,Panel,Actionsheet} from 'vux'
  import VueScroller from 'vue-scroller'
  import {mapState} from 'vuex'
  //文章
  Vue.use(VueScroller)

  export default {
    computed:{ ...mapState({
      'artList':state =>state.art.artList,
      'artCatalogList':state=>state.art.artCatalogList,
                          })},
    mounted: function () {
      this.$store.dispatch('SET_TABBARSHOW',true)
      //this.$refs.artList_scroller.triggerPullToRefresh();
      this.$store.dispatch('LOAD_ARTCATALOG_LIST')
    },
    activated:function () {
      let csp= this.$store.state.art.currScrollerPosition;
//      console.info(csp)
      if(csp.length!=0){

        setTimeout(() => {
          this.$refs.artList_scroller&&this.$refs.artList_scroller.scrollTo(csp.left,csp.top,false);
        }, 30)

      }
    },
    deactivated:function () {
      let currScrollerPosition=this.$refs.artList_scroller.getPosition();//获取当前下拉的位置[]
      this.$store.dispatch('SET_ART_CURRSCROLLERPOSITION',currScrollerPosition);//设置当前滚动条的位置
//      console.info(currScrollerPosition);
    },
    methods: {
      artCatalog_onChange(val){
        let p={"tId":val[0]}
        this.$store.dispatch('LOAD_ART_LIST',p)
      },
      clearArtCatalog(){
        this.artCatalogVal=[]
      },
      refresh: function (done) {
        let catalogId=''
        if(this.artCatalogVal.length>0) {
          catalogId= this.artCatalogVal[0];
        }

        let p={"tId":catalogId}
        this.$store.dispatch('LOAD_ART_LIST',p).then(()=>{
          if(this.$refs.artList_scroller!=undefined)
          this.$refs.artList_scroller.finishPullToRefresh();
        }).catch((result)=>{if(this.$refs.artList_scroller!=undefined)
          this.$refs.artList_scroller.finishPullToRefresh();})
      },
      infinite: function (done) {
        let catalogId=''
        if(this.artCatalogVal.length>0) {
          catalogId= this.artCatalogVal[0];
        }

        let p={"tId":catalogId}
        this.$store.dispatch('LOAD_MORE_ART_LIST',p).then(()=>{
          this.$refs.artList_scroller.finishInfinite(true);
        }).catch((result)=>{this.$refs.artList_scroller.finishInfinite(true);})
      },
      //查看详细
      queryArtView(item){
        let id=item.dataId;
        this.$router.push({ path: 'art/'+id})
      },
      onImgError (item, $event) {
        console.log(item, $event)
      }
    },
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Group,
      PopupPicker,
      Panel,
      Actionsheet
    },
    data(){
      return {
        artCatalogVal:[],
        showMenus: false,
        panelType:'1',
        menus:{
          menu1: '清空分类查询条件',
        },
        showMenus: false
      }
    }
  }
</script>
<style lang="less">
  @import '~vux/src/styles/1px.less';
</style>
