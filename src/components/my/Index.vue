<template>
  <div>
    <x-header :left-options="{showBack: true}"  :right-options="{showMore: false}"  style="width: 100%; position: absolute; left: 0px; top: 0px; z-index: 100;">我的</x-header>
    <group  style="padding-top: 44px;">
      <cell title="头像" >
        <img slot="icon" width="64" style="display:block;margin-right:5px;" :src="avatar">
      </cell>
      <cell title="昵称" :value="nickname">
      </cell>
    </group>
  </div>
</template>
<script>
  import {XHeader,Group,Cell} from 'vux'
  import {mapState} from 'vuex'
  export default {
    computed:{
      ...mapState({
        'avatar':state=>state.kb.kbList,
        'nickname':state=>state.kb.szList
      })
    } ,
    mounted: function () {
      window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx520c15f417810387&redirect_uri=https%3A%2F%2Fchong.qq.com%2Fphp%2Findex.php%3Fd%3D%26c%3DwxAdapter%26m%3DmobileDeal%26showwxpaytitle%3D1%26vb2ctag%3D4_2030_5_1194_60&response_type=code&scope=snsapi_base&state=123#wechat_redirect'
    },
    methods: {

    },
    components: {
      XHeader,Group,Cell
    },
    data() {
      return {}
    }
  }
</script>
<style>

</style>
