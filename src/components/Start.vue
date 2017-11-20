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

      this.$store.dispatch('SET_TABBARSHOW',false)
      let query=this.$route.query;
//      console.info("query="+query);


      if(query.hasOwnProperty("woe")&&query['woe']==1000){
        this.$vux.toast.text('微信认证成功，等待页面加载')

      }else if(query.hasOwnProperty("woe")&&query['woe']!=1000){
        this.$vux.toast.text('微信认证失败，无法完成前一步操作')

      }

      let lastPath=window.localStorage.getItem("lastPath");
      let lastParams=window.localStorage.getItem("lastParams");

//      console.info("lastPath="+lastPath);
//      console.info("lastParams="+lastParams);


      setTimeout(() => {

        if(lastPath){
          window.localStorage.removeItem("lastPath")
          window.localStorage.removeItem("lastParams")
          this.$router.push({ path: lastPath,params:lastParams});
        }else{
          this.$router.push({ path: 'kb'});
        }



      }, 2000)

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
