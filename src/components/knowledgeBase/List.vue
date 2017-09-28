<template>
  <div>
    <x-header :left-options="{showBack: false}"   >知识库</x-header>
    <flexbox >
      <flexbox-item><div ><group><selector title="属种大类" v-model="defaultVal" :options="szdlList"></selector></group></div></flexbox-item>
      <flexbox-item><div ><group><selector title="属种" v-model="defaultVal" :options="szList"></selector></group></div></flexbox-item>


    </flexbox>

  </div>


</template>
<script>
  import {XHeader,TransferDom,Flexbox,FlexboxItem,Selector,Group} from 'vux'
  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Selector,
      Flexbox,
      FlexboxItem,
      Group
    },
    data(){
      return {
        defaultVal: '',
        szdlList: [{key: '1',value: 'AAA'},{key: '2',value: 'bbb'}],
        szList: []
      }
    }
  }
</script>
<style lang="less">
  @import '~vux/src/styles/1px.less';
  .flex-demo {
    text-align: center;
    color: #fff;
    background-color: #20b907;
    border-radius: 4px;
    background-clip: padding-box;
  }
</style>
