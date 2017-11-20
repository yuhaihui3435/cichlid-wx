<template>
  <div>
      <x-header :left-options="{showBack: true}" @on-click-back=""  :right-options="{showMore: false}"  style="width: 100%; position: absolute; left: 0px; top: 0px; z-index: 100;">{{kb_view_headerTitle}}<a slot="right" @click="cameraPopupShow=true">上传照片</a></x-header>
      <tab :line-width=2  style="padding-top: 44px" >
        <tab-item selected @on-item-click="viewBaseInfo">基本信息</tab-item>
        <tab-item @on-item-click="viewDetailInfo">详细描述</tab-item>
        <tab-item @on-item-click="photoWall">照片墙</tab-item>
      </tab>
      <div v-if="baseInfoShow">
        <form-preview :body-items="kb_view_baseInfo_list" ></form-preview>
      </div>
      <div v-if="detailInfoShow" v-html="kb_view_detail" style="padding: 10px;">

      </div>
      <div v-if="photoWallShow" >
        <scroller ref="kbViewImgs_scroller"
                  :on-refresh="refresh"
                  :on-infinite="infinite" style="top: 80px;" :height="'100%'"  noDataText="">
          <!--<waterfall :line-gap="200" :watch="kb_view_imgs">-->
            <!--&lt;!&ndash; each component is wrapped by a waterfall slot &ndash;&gt;-->
            <!--<waterfall-slot-->
              <!--v-for="(item, index) in kb_view_imgs"-->
              <!--:width="100"-->
              <!--:height="200"-->
              <!--:order="index"-->
              <!--:key="item.id"-->
            <!--&gt;-->
              <!--<img :src="qiniuUrl+item.pic">-->
            <!--</waterfall-slot>-->
          <!--</waterfall>-->
          <ul  class="grid">
            <!-- 这种布局显示小图片和文字 -->
            <li v-for="kvi in kb_view_imgs" :key="kvi.id" :id="kvi.id">
              <a><img :src="qiniuUrl+kvi.pic+'?'+kvi.waterMarkParam"  v-preview="qiniuUrl+kvi.pic+'?'+kvi.waterMarkParam"/></a>

              <div>
                <span  class="list-img-check" style="display: inline;"  @click='checkKbImg(kvi.id)' >&#xe738;</span>
                <!--<span style="display:block;">{{kvi.userNickname}}</span>-->
                <span class="list-img-close"  style="display: inline;float: right" @click='delKbImg(kvi.id)' >&#xe645;</span>
              </div>

            </li>
          </ul>

        </scroller>
      </div>
    <div v-transfer-dom>
      <popup v-model="cameraPopupShow" height="100%">
        <div>
            <camera ref="camera" :module="'kb'" :moduleId="kb_id"></camera>
          <div style="width:100%;position: fixed;bottom: 0px">
            <div style="text-align: right;float: left;width: 40%;"><span class="cc-icon" style="color:red;" @click="closeCamera()">&#xe620;</span></div>
            <div style="text-align: left;float: right;width: 40%"><span class="cc-icon" style="color:green;" @click="uploadImg()" >&#xe627;</span></div>
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
  import VueScroller from 'vue-scroller'
  import Waterfall from 'vue-waterfall/lib/waterfall'
  import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'
  import KIT from '../../kit'

  export default {
    computed: {...mapState({
      'kb_view_headerTitle':state=>state.kb.kb_view_headerTitle,
      'kb_view_baseInfo_list':state=>state.kb.kb_view_baseInfo_list,
      'kb_view_detail':state=>state.kb.kb_view_detail,
      'kb_photoWall':state=>state.kb.kb_photoWall,
      'kb_id':state=>state.kb.kb_view_id,
      'kb_view_imgs':state=>state.kb.kbViewImgs,
        })},
    mounted: function () {
      let id=this.id
      this.$store.dispatch('SET_TABBARSHOW',true)
      this.$store.dispatch('RESET_KB_VIEW_IMGS_PARAMS')
      this.$store.dispatch('LOAD_KB_VIEW',{id:id}).then(()=>{
        this.$store.dispatch('SET_SHAREINFO',{shareUrl:this.$route.path,shareTitle:this.$store.state.kb.kb_view_headerTitle,shareImg:this.$store.state.kb.kb_view_detail_thumbnail,shareDesc:''})
      })

    },
    beforeCreate (){
//      console.log(this.$store.state.urlPrefix)
      this.webUrl=this.$store.state.urlPrefix + '/wc/queryWXAPPINFO';
      this.SDKRegister(this, () => {})
    },
    methods: {
      refresh(){
        this.$store.dispatch('LOAD_KB_VIEW_IMGS',{module:'kb','moduleId':this.kb_id}).then(()=>{
          this.$ref.kbViewImgs_scroller&&this.$refs.kbViewImgs_scroller.finishPullToRefresh(true);
        }).catch((result)=>{this.$refs.kbViewImgs_scroller&&this.$refs.kbViewImgs_scroller.finishPullToRefresh(true);})

      },
      infinite(){
        this.$store.dispatch('LOAD_KB_MORE_VIEW_IMGS',{module:'kb','moduleId':this.kb_id}).then(()=>{
          this.$ref.kbViewImgs_scroller&&this.$refs.kbViewImgs_scroller.finishInfinite(true);
        }).catch((result)=>{this.$refs.kbViewImgs_scroller&&this.$refs.kbViewImgs_scroller.finishInfinite(true);})
      },
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
        this.qiniuUrl=KIT.getQiNiuUrl();

      },
      closeCamera(){
        const vm=this;
        this.$vux.confirm.show({
          content:'确定要退出上传照片吗?',
          // 组件除show外的属性
          onCancel () {

          },
          onConfirm () {
            vm.cameraPopupShow=false
            console.info("执行了关闭照相机界面")
            vm.$refs.camera.resetData();
          }
        })
      },
      uploadImg(){
        const vm=this;
        vm.$refs.camera.submitALL();
      },
      delKbImg(id){
        let vm=this;
        this.$vux.confirm.show({
          content: '确定要删除吗?',

          onCancel() {

          },
          onConfirm() {
            vm.$store.dispatch('DEL_KB_VIEW_IMG', {id: id,module:'kb','moduleId':vm.kb_id}).then(()=>{
              //vm.refresh();
            })
          }
        })

      },
      checkKbImg(id){
        let vm=this;
        this.$vux.confirm.show({
          content: '确定审核通过吗?',

          onCancel() {

          },
          onConfirm() {
            vm.$store.dispatch('CHECK_KB_VIEW_IMG',{id:id,module:'kb','moduleId':vm.kb_id}).then(()=>{

              //vm.refresh();
            })
          }
        })

      }
    },
    directives: {
      TransferDom
    },
    components: {
      Tab,TabItem,FormPreview,XHeader,Popup,camera,VueScroller,Waterfall,WaterfallSlot
    },
    data(){
      return {
        baseInfoShow: true,
        detailInfoShow: false,
        photoWallShow:false,
        cameraPopupShow:false,
        qiniuUrl:'',
      }
    },
    props:['id']
  }
</script>


<style lang="less">
  @import '~vux/src/styles/1px.less';
  @import '../style.css';
</style>
