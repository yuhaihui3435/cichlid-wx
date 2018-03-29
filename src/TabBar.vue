<template>

    <tabbar>
      <tabbar-item link="/" :selected="route.path.indexOf('/kb')>-1">

        <span slot="label">知识库</span>
      </tabbar-item>
      <tabbar-item  link="/art" :selected="route.path.indexOf('/art')>-1">
        <span slot="label">杂七杂八</span>
      </tabbar-item>
    </tabbar>

</template>
<script>
  import { Tabbar, TabbarItem } from 'vux'
  export default {
    components: {
      Tabbar,
      TabbarItem
    }
  }
</script>
<style>

</style>
