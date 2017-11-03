import Vue from 'vue'
import Router from 'vue-router'
import KbList from '@/components/knowledgeBase/List'
import KbView from '@/components/knowledgeBase/View'
import ArtList from '@/components/articles/List'
import ArtView from '@/components/articles/View'
// import myView from '@/components/my/Index'
import startView from '@/components/Start'

Vue.use(Router)

export default new Router({

  base: '/wx/',
  routes: [
    {
      path: '/',
      name: 'start',
      component: startView,
      meta: {
        //keepAlive: true, // 需要被缓存
        title:'应用启动中...'
      }
    },
    {
      path: '/kb',
      name: 'kbList',
      component: KbList,
      query:{a:1,b:2},
      meta: {
        keepAlive: true, // 需要被缓存
        title:'知识库'
      }
    },
    {
      path:'/kb/:id',
      name:'kbView',
      component:KbView,
      props: true,
      meta: {
        title:'知识详细'
      }
    },
    {
      path:'/art/',
      name:'artList',
      component:ArtList,
      props: true,
      meta: {
        keepAlive: true, // 需要被缓存
        title:'杂七杂八'
      }
    },
    {
      path:'/art/:id',
      name:'artView',
      component:ArtView,
      props: true,
      meta: {
        title:'杂七杂八详细'
      }

    },
    // {
    //   path:'/my',
    //   name:'myView',
    //   component:myView,
    //   props: true,
    //   meta: {
    //     title:'我的'
    //   }
    // }
  ],

})
