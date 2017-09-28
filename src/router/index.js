import Vue from 'vue'
import Router from 'vue-router'
import KbList from '@/components/knowledgeBase/List'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'kbList',
      component: KbList
    }
  ]
})
