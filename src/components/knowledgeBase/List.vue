<template>
  <div>
    <x-header :left-options="{showBack: false}"   :right-options="{showMore: true}" @on-click-more="showMenus = true" style="width: 100%; position: absolute; left: 0px; top: 0px; z-index: 100;">知识库</x-header>


    <div style="padding-top: 46px;width: 100%">

      <search
        v-model="searchKey"
        :auto-fixed="false"
        @on-focus="onFocus"
        @on-cancel="onCancel"
        @on-submit="onSubmit"
        ref="search"></search>
      <group>
        <popup-picker title="选择属种" :data="szList" :columns="2" v-model="szVal" ref="szPicker" show-name @on-change="sz_onChange"></popup-picker>
      </group>
    </div>
    <scroller ref="kbList_scroller"
              :on-refresh="refresh"
              :on-infinite="infinite" style="top: 150px;" :height="'100%'"  noDataText="">

          <panel header="查询结果"  :list="kbList" :type="panelType" @on-img-error="onImgError" @on-click-item="queryKbView"></panel>

    </scroller>


    <div v-transfer-dom>
      <actionsheet :menus="menus" v-model="showMenus" @on-click-menu-menu1="clearSearchAll"  @on-click-menu-menu2="clearSearchKey" @on-click-menu-menu3="clearSearchSpecies" show-cancel></actionsheet>
    </div>
  </div>


</template>
<script>
  import Vue from 'vue'
  import {XHeader,TransferDom,Selector,Group,PopupPicker,Search,Panel,Actionsheet,cookie} from 'vux'
  import VueScroller from 'vue-scroller'
  import {mapState} from 'vuex'
  import KIT from '../../kit'

  Vue.use(VueScroller)

  export default {
    computed:{
      ...mapState({
                 'kbList':state=>state.kb.kbList,
                 'szList':state=>state.kb.szList
            })
    } ,
    mounted: function () {

      let shareUrl=window.location.href.split('#');
      shareUrl=shareUrl[0]+'?#'+shareUrl[1];
      this.$store.dispatch('SET_TABBARSHOW',true)
      this.$store.dispatch('LOAD_SZ_LIST');
      //微信分享代码
        this.$wechat.ready(() => {
          this.$wechat.onMenuShareTimeline({
            title: '慈鲷CC-知识库',
            link: shareUrl,
            imgUrl: 'http://images.cichlid.cc/images/sys/app-icon72x72@2x.png',
            success () {
              // 用户确认分享后执行的回调函数
            },
            cancel () {
              // 用户取消分享后执行的回调函数
            }
          })
          // 分享给朋友
          this.$wechat.onMenuShareAppMessage({
            title: '慈鲷CC-知识库',
            link:shareUrl,
            imgUrl: 'http://images.cichlid.cc/images/sys/app-icon72x72@2x.png',
            desc:'逐渐丰富的非洲慈鲷鱼资料仓库',
            success: function () {

            },
            cancel: function () {

            }
          })
          this.$wechat.onMenuShareQQ({
            title: '慈鲷CC-知识库',
            link:shareUrl,
            imgUrl: 'http://images.cichlid.cc/images/sys/app-icon72x72@2x.png',
            desc:'逐渐丰富的非洲慈鲷鱼资料仓库',
            success: function () {

            },
            cancel: function () {

            }
          })
          this.$wechat.onMenuShareQZone({
            title: '慈鲷CC-知识库',
            link:shareUrl,
            imgUrl: 'http://images.cichlid.cc/images/sys/app-icon72x72@2x.png',
            desc:'逐渐丰富的非洲慈鲷鱼资料仓库',
            success: function () {

            },
            cancel: function () {

            }
          })
        })


    },
    activated:function () {
      let csp= this.$store.state.kb.currScrollerPosition;
      if(csp.length!=0){

          setTimeout(() => {
            this.$refs.kbList_scroller&&this.$refs.kbList_scroller.scrollTo(csp.left,csp.top,false);
          }, 30)

      }
    },
    deactivated:function () {
      let currScrollerPosition=this.$refs.kbList_scroller.getPosition();//获取当前下拉的位置[]
      this.$store.dispatch('SET_KB_CURRSCROLLERPOSITION',currScrollerPosition);//设置当前滚动条的位置
    },
    beforeCreate (){
      //微信JSSKD初始化
      this.webUrl=this.$store.state.urlPrefix + '/wc/queryWXAPPINFO';
      this.SDKRegister(this, () => {})
    },
    methods: {
      sz_onChange(val){
        if(val.length!=2){
          return ;
        }
        let p={"knowledgebase.speciesId":val[1],search:this.searchKey}
        this.$store.dispatch('LOAD_KB_LIST',p)
      },
      clearSearchAll(){
        this.searchKey=''
        this.szVal=[]
        this.refresh();
      },

      clearSearchKey(){
        this.searchKey=''
        this.refresh();
      },
      clearSearchSpecies(){
        this.szVal=[]
        this.refresh();
      },
      refresh: function (done) {
        let speciesId=''
        if(this.szVal.length==2) {
          speciesId= this.szVal[1];
        }

        let p={"knowledgebase.speciesId":speciesId,search:this.searchKey}
        this.$store.dispatch('LOAD_KB_LIST',p).then(()=>{
          if(this.$refs.kbList_scroller!=undefined)
          this.$refs.kbList_scroller.finishPullToRefresh();
        }).catch((result)=>{
          this.$refs.kbList_scroller&&this.$refs.kbList_scroller.finishPullToRefresh();})
      },
      infinite: function (done) {
        let speciesId=''
        if(this.szVal.length==2) {
          speciesId= this.szVal[1];
        }

        let p={"knowledgebase.speciesId":speciesId,search:this.searchKey}
        this.$store.dispatch('LOAD_MORE_KB_LIST',p).then(()=>{
          this.$refs.kbList_scroller.finishInfinite(true);
        }).catch((result)=>{this.$refs.kbList_scroller&&this.$refs.kbList_scroller.finishInfinite(true);})
      },
      //查看详细
      queryKbView(item){

        let id=item.dataId;
        this.$router.push({ path: 'kb/'+id})

      },
      //search 处理
      onSubmit () {
//        console.log(this);
        this.$refs.search.setBlur()
        let speciesId=''
        if(this.szVal.length==0)
          speciesId=this.szVal[1];

        let p={"knowledgebase.speciesId":speciesId,search:this.searchKey}
        this.$store.dispatch('LOAD_KB_LIST',p)
      },
      setFocus () {
        this.$refs.search.setFocus()
      },
      onFocus () {
//        console.log('on focus')
      },
      onCancel () {
//        console.log('on cancel')
      },
      onImgError (item, $event) {
//        console.log(item, $event)
      }

    },
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Group,
      Search,
      PopupPicker,
      Panel,
      Actionsheet,
      VueScroller
    },
    data(){
      return {
        szVal:[],
        searchKey:'',
        showMenus: false,
        panelType:'1',
        menus:{
          menu1: '清空全部查询条件',
          menu2: '清空搜索查询条件',
          menu3: '清空属种查询条件',
        },
        showMenus: false
      }
    }

  }

</script>
<style lang="less">
  @import '~vux/src/styles/1px.less';
</style>
