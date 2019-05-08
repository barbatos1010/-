import Vue from 'vue'
import Router from 'vue-router'
import home from './components/home.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component:home,
      children:[
      //在线测试
      {
        path:'createPapers',
        name:'createPapers',
        component:() => import (/*老师出卷*/ './components/onlineTest/createPapers.vue')
      },{
        path:'planTest',
        name:'planTest',
        component:() => import (/*安排测试*/'./components/onlineTest/planTest.vue')
      },{
        path:'correctPapers',
        name:'correctPapers',
        component:() => import (/*批阅试卷*/'./components/onlineTest/correctPapers.vue')
      },{
        path:'checkResult',
        name:'checkResult',
        component:() => import (/*查看成绩*/'./components/onlineTest/checkResult.vue')
      },{
        path:'papersManagement',
        name:'papersManagement',
        component:() => import (/*试卷管理*/'./components/onlineTest/papersManagement.vue')
      },
      //基础数据
      {
        path:'changePassword',
        name:'changePassword',
        component:() => import (/*修改密码*/'./components/basicsData/changePassword.vue')
      },{
        path:'classManagement',
        name:'classManagement',
        component:() => import (/*班级管理*/'./components/basicsData/classManagement.vue')
      },{
        path:'studentManagement',
        name:'studentManagement',
        component:() => import (/*班级管理*/'./components/basicsData/studentManagement.vue')
      },{
        path:'teacherManagement',
        name:'teacherManagement',
        component:() => import (/*教师管理*/'./components/basicsData/teacherManagement.vue')
      }]
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
