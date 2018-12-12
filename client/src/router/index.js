import Vue from 'vue'
import Router from 'vue-router'
import VS from '@/components/VS'
import Codemirror from '@/components/Codemirror'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'VS',
      component: VS
    },
    {
      path: '/Codemirror',
      name: 'Codemirror',
      component: Codemirror
    }
  ]
})
