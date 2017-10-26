<template>
  <div style="height: 200px;">
      <div class="camera-icon" @click.stop="addImg">
        <span class="cc-icon" >&#xe727;</span>
        <input ref="f"  type="file" accept="image/*" style="display: none;" @change="onFileChange"  multiple>
        <span >点击此处拍照</span>
      </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  //import {} from 'vux'
  import {mapState} from 'vuex'
  export default {
    name:'camera',
    computed:{

    },
    mounted: function () {

    },
    methods: {
      addImg:function (e) {
        this.$refs.f.click();//打开照相机
        return false;
      },
      onFileChange:function () {

      },
    },
    directives: {

    },
    components: {

    },
    data() {
      return {
        imgData:[]


      }
    }
  }
</script>

<style>
  @import '../style.css';

  .camera-icon{
    width:100%;
    height:100px;
    text-align: center;
    display: block;
    background-color: white;
  }




</style>
