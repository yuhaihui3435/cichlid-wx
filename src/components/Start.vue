<template>
  <div>
    <div class="center">
      <img  src="~@/assets/img/favicon.png">
      <vue-loading type="cylon" color="#4f93fb" :size="{ width: '50px', height: '50px' }"></vue-loading>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue'
  import KIT from '../kit'
  import vueLoading from 'vue-loading-template'

  export default {
    beforeMount:function(){

    },
    mounted: function () {
      setTimeout(() => {
        //登录检查
        this.$router.push({ path: 'kb'});
      }, 2000)

//      this.$router.push({ path: 'kb'})
    },
    components: {
      vueLoading
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/1px.less';
  .center {
    position: fixed;
    top: 50%;
    left: 50%;
    /*background-color: #000;*/
    /*width:50%;*/
    /*height: 50%;*/
    -webkit-transform: translateX(-50%) translateY(-50%);
  }
</style>
