<template>
  <div>
      <x-header :left-options="{showBack: true}"  :right-options="{showMore: false}"  style="width: 100%; position: absolute; left: 0px; top: 0px; z-index: 100;">{{kb_view_headerTitle}}<a slot="right" @click="cameraPopupShow=true">上传照片</a></x-header>
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
    <div v-transfer-dom>
      <popup v-model="cameraPopupShow" height="100%">
        <div>
            <camera></camera>
            <div style="width:100%;position: fixed;bottom: 0px">
              <div style="text-align: right;float: left;width: 40%;"><span class="cc-icon" style="color:red;" @click="cameraPopupShow=false">&#xe620;</span></div>
              <div style="text-align: left;float: right;width: 40%"><span class="cc-icon" style="color:green;" @click="">&#xe627;</span></div>
            </div>
        </div>
      </popup>
    </div>
  </div>

</template>



<script>

  import { TransferDom, XHeader,Tab,Popup, TabItem,FormPreview } from 'vux'
  import {mapState} from 'vuex'
  import camera from '../camera/Main'

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
      TransferDom
    },
    components: {
      Tab,TabItem,FormPreview,XHeader,Popup,camera
    },
    data(){
      return {
        baseInfoShow: true,
        detailInfoShow: false,
        photoWallShow:false,
        cameraPopupShow:false,
      }
    },
    props:['id']
  }
</script>


<style lang="less">
  @import '~vux/src/styles/1px.less';
  @import '../style.css';
</style>
