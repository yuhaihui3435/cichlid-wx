<template>
  <div>
    <x-header :left-options="{showBack: false}"  :right-options="{showMore: true}" @on-click-more="showMenus = true" >知识库</x-header>



    <search
      v-model="searchKey"
      position="absolute"
      auto-scroll-to-top top="46px"
      @on-focus="onFocus"
      @on-cancel="onCancel"
      @on-submit="onSubmit"
      ref="search"></search>
    <group>
      <popup-picker title="选择属种" :data="szList" :columns="2" v-model="szVal" ref="szPicker" @on-change="sz_onChange" @on-shadow-change="sz_onShadowChange"></popup-picker>
    </group>

    <panel header="查询结果"  :list="kbList" :type="panelType" @on-img-error="onImgError"></panel>



  </div>


</template>
<script>
  import {XHeader,TransferDom,Selector,Group,PopupPicker,Search,Panel} from 'vux'
  import {mapState} from 'vuex'
  export default {
    computed: mapState([
      'kbList',
      'szList'
    ]),
    mounted: function () {
      this.$store.dispatch('LOAD_KB_LIST',{})
      this.$store.dispatch('LOAD_SZ_LIST')
    },
    methods: {
      sz_onChange(val){
        console.info(val)

        if(val.length==1){

          this.$store.dispatch('LOAD_SZ_CHILDREN_LIST',{pId:val[0]});
        }

      },
      sz_onShadowChange(ids,names){
//        ids.filter(id => id!=null)
        ids.filter(function(id){
          return !(!id);
        })
        console.info('ids:'+ids)
        console.info('names:'+names)
        if(ids.length==1){

          this.$store.dispatch('LOAD_SZ_CHILDREN_LIST',{pId:ids[0]});
        }
      },
      setFocus () {
        this.$refs.search.setFocus()
      },
      onSubmit () {
        console.log(this);
        this.$refs.search.setBlur()
        this.$vux.toast.show({
          type: 'text',
          position: 'top',
          text: 'on submit'
        })
      },
      onFocus () {
        console.log('on focus')
      },
      onCancel () {
        console.log('on cancel')
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
      Search,
      PopupPicker,
      Panel
    },
    data(){
      return {
        szVal:[],
        searchKey:'',
        showMenus: false,
        panelType:'1'
      }
    }
  }
</script>
<style lang="less">
  @import '~vux/src/styles/1px.less';
</style>
