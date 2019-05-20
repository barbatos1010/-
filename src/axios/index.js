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
    API_MODIFY_TEACHER: (params) => api('post', '/api/User/ModifyTeacher', params),
    
    /*******************試卷管理****************/
    
    /*******制作试卷********/
    API_MAKE_PAPER: (body,query) => api('post','/api/TestPaper/MakeTestPaper'+query,body),
    //获取问题类型
    API_PROBLEM_TYPES:(query) => api('get','/api/TestPaper/GetQuestionType',query),
    //分页获取试卷列表
    API_TEST_PAPER_LIST:(query) => api('get','/api/TestPaper/GetTestPaperList',query),
    //获取试卷信息
    API_GET_TEST_PAPER:(query) => api('get','/api/TestPaper/GetTestPaper',query),
    //删除试卷
    API_DELETE_TEST_PAPER:(query) => api('post','/api/TestPaper/RemoveTestPaper?' + query),
    //添加题目至试卷
    API_ADD_QUESTION:(body) => api('post','/api/TestPaper/AddQuestionToTestPaper',body),
    //修改题目
    API_MODIFY_QUESTION:(body,query = '') => api('post','/api/TestPaper/ModifyQuestion'+query,body),
    //修改分值
    API_MODIFY_SCORE:(body) => api('post','/api/TestPaper/ModifyScore',body),
    //丛试卷上删除题目
    API_DEL_QUESTION:(query) => api('post','/api/TestPaper/RemoveQuestionFromTestPaper'+query),
    
}