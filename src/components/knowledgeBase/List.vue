<template>
  <div>
    <x-header :left-options="{showBack: false}"  :right-options="{showMore: true}" @on-click-more="showMenus = true" >知识库</x-header>
    <!--<flexbox >-->
      <!--<flexbox-item><div ><group><selector title="属种大类" v-model="defaultVal" :options="szdlList"></selector></group></div></flexbox-item>-->
      <!--<flexbox-item><div ><group><selector title="属种" v-model="defaultVal" :options="szList"></selector></group></div></flexbox-item>-->
    <!--</flexbox>-->
    <search
      @result-click="resultClick"
      @on-change="getResult"
      :results="searchResults"
      v-model="searchKey"
      position="absolute"
      auto-scroll-to-top top="46px"
      @on-focus="onFocus"
      @on-cancel="onCancel"
      @on-submit="onSubmit"
      ref="search"></search>

    <panel header="查询结果列表"  :list="panelList" :type="panelType" @on-img-error="onImgError"></panel>
    <div v-transfer-dom>
      <actionsheet :menus="menus" v-model="showMenus" show-cancel></actionsheet>
    </div>
  </div>


</template>
<script>
  import {XHeader,TransferDom,Flexbox,FlexboxItem,Selector,Group,Actionsheet,Search,Panel} from 'vux'
  export default {
    methods: {
      setFocus () {
        this.$refs.search.setFocus()
      },
      resultClick (item) {
        window.alert('you click the result item: ' + JSON.stringify(item))
      },
      getResult (val) {
        this.searchResults = val ? getResult(this.searchKey) : []
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
      Selector,
      Flexbox,
      FlexboxItem,
      Group,
      Search,
      Actionsheet,
      Panel
    },
    data(){
      return {
        defaultVal: '',
        szdlList: [{key: '1',value: 'AAA'},{key: '2',value: 'bbb'}],
        szList: [],
        searchKey:'haha',
        searchResults:[],
        menus: {
          menu1: 'Take Photo',
          menu2: 'Choose from photos'
        },
        showMenus: false,
        panelType:'1',
        panelList:[{
        src: 'http://somedomain.somdomain/x.jpg',
        fallbackSrc: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
        title: '标题一',
        desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
        url: '/component/cell'
      }, {
        src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
        title: '标题二',
        desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
        url: {
          path: '/component/radio',
          replace: false
        },
        meta: {
          source: '来源信息',
          date: '时间',
          other: '其他信息'
        }
      }]
      }
    }
  }

  function getResult (val) {
    let rs = []
    for (let i = 0; i < 20; i++) {
      rs.push({
        title: `${val} result: ${i + 1} `,
        other: i
      })
    }
    return rs
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
