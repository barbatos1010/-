/*接口文件*/
//axios配置文件
import api from './config'

export default {
    //登录接口
    API_LOGIN: (params) => api('get', '/api/OAuth/authenticate?', params),

    /*******************学生管理接口****************/
    //添加学生
    API_ADD_STU: (params) => api('post', '/api/Student/AddStudent', params),
    //删除学生
    API_REMOVE_STU: (params) => api('get', '/api/Student/RemoveStudent?', params),
    //修改学生信息
    API_MODIFY_STU: (params) => api('post', '/api/Student/ModifyStudent', params),
    //获取班级信息 传入classId （整数）
    API_GET_CLASS: (params) => api('get', '/api/Student/GetClassStudent?', params),

    /*******************班级管理接口****************/
    //获取所有的课程
    API_GETALL_COURSE: (params) => api('get', '/api/Class/GetAllCourse', params),
    //获取所有班级信息
    API_GETALL_CLASS: (params) => api('get', '/api/Class/GetAllClass', params),
    //添加班级
    API_ADD_CLASS: (params) => api('post', '/api/Class/AddClass', params),
    //删除班级
    API_REMOVE_CLASS: (params) => api('get', '/api/Class/RemoveClass', params),
    //修改班级信息
    API_MODIFY_CLASS: (params) => api('post', '/api/Class/ModifyClass', params),

    /*******************老师管理接口****************/
    //修改密码接口
    API_MODIFY_PASSWORD: (params) => api('get', '/api/User/ModifyPassword?', params),
    //获取所有老师信息
    API_GET_TEACHERS: (params) => api('get', '/api/User/GetTeachers', params),
    //添加老师信息
    API_ADD_TEACHER: (params) => api('post', '/api/User/AddTeacher', params),
    //删除老师 传入教师唯一id
    API_REMOVE_TEACHER: (query) => api('post', '/api/User/RemoveTeacher'+query),
    //修改教师信息
    API_MODIFY_TEACHER: (params) => api('post', '/api/User/ModifyTeacher', params)
}