<template>
  <div>
      <x-header :left-options="{showBack: true}"  :right-options="{showMore: false}"  style="width: 100%; position: absolute; left: 0px; top: 0px; z-index: 100;">{{kb_view_headerTitle}}</x-header>
      <tab :line-width=2 active-color='#09BB07' style="padding-top: 44px" >
        <tab-item selected @on-item-click="viewBaseInfo">基本信息</tab-item>
        <tab-item @on-item-click="viewDetailInfo">详细描述</tab-item>
        <tab-item @on-item-click="photoWall">照片墙</tab-item>
      </tab>
      <div v-if="baseInfoShow">
        <form-preview :body-items="kb_view_baseInfo_list" ></form-preview>
      </div>
      <div v-if="detailInfoShow" v-html="kb_view_detail" style="padding: 10px;">

      </div>
      <div v-if="photoWallShow" v-html="kb_photoWall">

      </div>
  </div>
</template>



<script>

  import { XHeader,Tab, TabItem,FormPreview } from 'vux'
  import {mapState} from 'vuex'
  export default {
    computed: {...mapState({
      'kb_view_headerTitle':state=>state.kb.kb_view_headerTitle,
      'kb_view_baseInfo_list':state=>state.kb.kb_view_baseInfo_list,
      'kb_view_detail':state=>state.kb.kb_view_detail,
      'kb_photoWall':state=>state.kb.kb_photoWall
        })},
    mounted: function () {

      let id=this.id
      this.$store.dispatch('LOAD_KB_VIEW',{id:id}).then(()=>{
        //this.$router.push('kbView')
      })



    },
    methods: {
      viewBaseInfo(){
        this.baseInfoShow=true;
        this.detailInfoShow=false;
        this.photoWallShow=false;
      },
      viewDetailInfo(){
        this.baseInfoShow=false;
        this.detailInfoShow=true;
        this.photoWallShow=false;
      },photoWall(){
        this.baseInfoShow=false;
        this.detailInfoShow=false;
        this.photoWallShow=true;
      }

    },
    directives: {

    },
    components: {
      Tab,TabItem,FormPreview,XHeader,
    },
    data(){
      return {
        baseInfoShow: true,
        detailInfoShow: false,
        photoWallShow:false
      }
    },
    props:['id']
  }
</script>


<style lang="less">
  @import '~vux/src/styles/1px.less';
</style>
