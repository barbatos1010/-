<template>
  <div class="local-container">
    <el-select class="select-class" v-model="value" @change="getClass" placeholder="请选择班级">
      <el-option v-for="item in classList" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
    </el-select>
    <!-- 展示教师信息表格 -->
    
      <el-table max-height='400px' class="table"  :stripe="true" size="medium" :data="students" border>
        <el-table-column prop="stuName" label="姓名" width="150"></el-table-column>
        <el-table-column prop="stuSex" label="性别" width="120"></el-table-column>
        <el-table-column prop="stuBirthDay" label="生日" width="180"></el-table-column>
        <el-table-column prop="stuMobile" label="手机号码" width="120"></el-table-column>
        <el-table-column  label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="removeStudent(scope.$index,scope.row.stuUid)">删除</el-button>
            <el-button @click="editStudent(scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="add">
        <el-button
          @click="newStudentFromVisible = true"
          type="success"
          icon="el-icon-plus"
          circle
        ></el-button>
      </div>

      <!-- 新增成员 -->
      <el-dialog
      title="新增成员"
      width="500px"
      :append-to-body="true"
      :center="true"
      :visible.sync="newStudentFromVisible"
      :close-on-press-escape="true"
    >
      <el-form
        class="teacherFrom"
        :model="newStudent"
        label-width="100px"
        label-position="left"
        :inline="true"
        ref="teacherForm"
      >
        <el-form-item label="姓名" prop="StuName">
          <el-input v-model="newStudent.StuName"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="StuAge">
          <el-input v-model="newStudent.StuAge"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="StuSex">
          <el-input v-model="newStudent.StuSex"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="StuBirthDay">
          <el-input v-model="newStudent.StuBirthDay"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="StuMobile">
          <el-input v-model="newStudent.StuMobile"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="StuPassword">
          <el-input v-model="newStudent.StuPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addStudent">提交</el-button>
          <el-button @click="newStudentFromVisible = false;">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 编辑学生信息 -->
    <el-dialog
      title="编辑学生信息"
      width="500px"
      :append-to-body="true"
      :center="true"
      :visible.sync="editStudentFromVisible"
      :close-on-press-escape="true"
    >
      <el-form
        class="teacherFrom"
        :model="modifyStudentInfo"
        label-width="100px"
        label-position="left"
        :inline="true"
        ref="teacherForm"
        
      >
        <el-form-item label="姓名" prop="StuName">
          <el-input v-model="modifyStudentInfo.stuName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="StuSex">
          <el-input v-model="modifyStudentInfo.stuSex"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="StuMobile">
          <el-input v-model="modifyStudentInfo.stuMobile"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="StuBirthDay">
          <el-input v-model="modifyStudentInfo.stuBirthDay"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="StuPassword">
          <el-input v-model="modifyStudentInfo.stuPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="modifyStudent">提交</el-button>
          <el-button @click="editStudentFromVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      students:[],
      classList: [],
      students:[],
      value: "",
      newStudent: {
        StuName: "",
        StuClassId:"",
        StuBirthDay: "",
        StuMobile: "",
        StuPassword: "",
        StuSex: ""
      },
      modifyStudentInfo: {},
      newStudentFromVisible:false,
      editStudentFromVisible:false
    };
  },
  methods: {
    //编辑学生信息
    editStudent(data){
        console.log(data)
      this.modifyStudentInfo = JSON.parse(JSON.stringify(data))
        console.log(this.modifyStudentInfo)
      this.editStudentFromVisible = true;
    },
    //添加新生
    async addStudent() {
      let data = await this.$api.API_ADD_STU(this.newStudent);
      console.log(data);
      if(data.code == 1){
        this.getClass(this.value)
        this.newStudentFromVisible = false;
      }
    },
    //获取一个班级的学生
    async getClass(classId) {
      let data = await this.$api.API_GET_CLASS(`classId=${classId}`);
      this.students = data;
      // console.log(data)
    },
    async removeStudent(index,stuId) {
      let data = await this.$api.API_REMOVE_STU(`uid=${stuId}`);
      if(data.code == 1){
        this.students.splice(index,1)
      }
    },
    //修改学生信息
    async modifyStudent() {
      const obj = this.modifyStudentInfo
      const sendData = {
           StuName:obj.stuName,
          StuUid:obj.stuUid,
          StuBirthDay:obj.stuBirthDay,
          StuMobile:obj.stuMobile,
          StuPassword:obj.stuPassword,
          StuSex:obj.stuSex
      }
      let data = await this.$api.API_MODIFY_STU(sendData);
      if(data.code == 1){
        this.getClass(this.value)
        this.editStudentFromVisible =false;
      }
      // console.log(data);
    },
    async getAllClass() {
      let data = await this.$api.API_GETALL_CLASS();
      this.classList = data;
      // console.log(data);
    },
  },
  created(){
      this.getAllClass()
  },
  watch:{
      value(newVale){
        this.newStudent.StuClassId=newVale;
      }
  }
};
</script>

<style scoped>
.local-container{
  width: 669px;
  margin: 0 auto;
  /* padding-top: 80px; */
  position: relative;
  height: 100%;
}
.table /deep/ .el-table__body-wrapper {
  max-height:356px !important;
}
.select-class{
  margin-top: 80px;
  margin-bottom: 30px;
}
.table {
  width: 680px;
  /* max-height: 400px; */
}
.teacherFrom {
  text-align: center;
}
.add {
  position: absolute;
  top: 150px;
  right:-60px;
}
</style>
