import Vue from 'vue'
import Vuex from 'vuex'
import api from './axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //教师列表
    teachers:null,
    //学生列表
    students:null,
    //班级列表
    classList:null,
    //课程列表
    coursess:null,
    //试卷列表
    testPaperList:null,
    // 试卷页数
    testPaperPages:1,
    //已获取试卷页数
    existingList:[]
  },
  mutations: {
    getTeachers(state,data){
      state.teachers = data
    },
    getStudents(state,data){
      state.students = data
    },
    getClassList(state,data){
      state.classList = data
    },
    getCoursess(state,data){
      state.coursess = data
    },
    getTestPaperList(state,data){
      state.testPaperList = data.data
      state.testPaperPages = data.pages
    }
  },
  actions: {
    //获取所有教师
  async getTeachers(context){
      let data =  await api.API_GET_TEACHERS()
      // console.log(data)
      context.commit('getTeachers',data)
  },
  //获取所有班级
  async getClassList(context){
    let data =  await api.API_GETALL_CLASS()
    // console.log(data)
    context.commit('getClassList',data)
  },
  //获取所有课程
  async getCoursess(context){
    let data =  await api.API_GETALL_COURSE()
    // console.log(data)
    context.commit('getCoursess',data)
  },
  //获取试卷列表
  async getTestPaperList(context,pageIndex = 0){
    let data =  await api.API_TEST_PAPER_LIST(`?pageIndex=${pageIndex}&pageSize=10`)
    // console.log(data)
    data.data.forEach(el => {
      el.tpDate = el.tpDate.replace('T',' ')
      // console.log(el.tpDate)
    })
    context.commit('getTestPaperList',data)
  }
  }
  
})
