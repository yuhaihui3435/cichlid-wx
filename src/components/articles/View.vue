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
      this.$store.dispatch('SET_TABBARSHOW',true)
      let id=this.id
      this.$store.dispatch('LOAD_ART_VIEW',{id:id}).then(()=>{

      })
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
