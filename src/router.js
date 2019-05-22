import Vue from 'vue'
import Router from 'vue-router'
import home from './components/home.vue'
import login from './components/login.vue'

Vue.use(Router)

const router =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component:home,
      meta:{
        requiresAuth:true
      },
      redirect:{name:'homePage'},
      children:[
      //在线测试
      {
        path:'homePage',
        name:'homePage',
        meta:{
          requiresAuth:true
        },
        component:() => import (/*首页*/ './components/homePage.vue')
      },{
        path:'planTest',
        name:'planTest',
        meta:{
          requiresAuth:true
        },
        component:() => import (/*安排测试*/'./components/onlineTest/planTest.vue')
      },{
        path:'correctPapers',
        name:'correctPapers',
        meta:{
          requiresAuth:true
        },
        component:() => import (/*批阅试卷*/'./components/onlineTest/correctPapers.vue')
      },{
        path:'checkResult',
        name:'checkResult',
        meta:{
          requiresAuth:true
        },
        component:() => import (/*查看成绩*/'./components/onlineTest/checkResult.vue')
      },{
        path:'papersManagement',
        name:'papersManagement',
        meta:{
          requiresAuth:true
        },
        component:() => import (/*试卷管理*/'./components/onlineTest/papersManagement.vue')
      },
      //基础数据
      {
        path:'changePassword',
        name:'changePassword',
        meta:{
          requiresAuth:true
        },
        component:() => import (/*修改密码*/'./components/basicsData/changePassword.vue')
      },{
        path:'classManagement',
        name:'classManagement',
        meta:{
          requiresAuth:true
        },
        component:() => import (/*班级管理*/'./components/basicsData/classManagement.vue')
      },{
        path:'studentManagement',
        name:'studentManagement',
        meta:{
          requiresAuth:true
        },
        component:() => import (/*班级管理*/'./components/basicsData/studentManagement.vue')
      },{
        path:'teacherManagement',
        name:'teacherManagement',
        meta:{
          requiresAuth:true
        },
        component:() => import (/*教师管理*/'./components/basicsData/teacherManagement.vue')
      },{
        path:'editTestPaper',
        name:'editTestPaper',
        meta:{
          requiresAuth:true
        },
        component:() => import(/*编辑试卷*/'./components/onlineTest/editTestPaper.vue')
      }]
    },{
      path:'/login',
      name:'login',
      meta:{
        requiresAuth:false
      },
      component:login
    }
  ]
})
//全局路由守卫
router.beforeEach((to,from,next) => {
 if(to.meta.requiresAuth){
    // console.log(to.name)
      if(sessionStorage.getItem("USER_TOKEN")){
        next()
      }else{
        next({name:'login',query:{redirect:to.name}})
      }
  }else{
    // console.log(to.name)
    next()
  }
})

export default router