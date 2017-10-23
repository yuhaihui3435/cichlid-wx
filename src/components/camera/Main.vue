<template>
  <div style="height: 200px;">
      <div class="camera-icon">
        <span class="cc-icon">&#xe727;</span>
        <input  type="file" accept="image/*" style="display: none;">
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

    },
    directives: {

    },
    components: {

    },
    data() {
      return {}
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
