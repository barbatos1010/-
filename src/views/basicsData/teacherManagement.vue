<template>
  <div class="local-container">
    <!-- 展示教师信息表格 -->
    <div >
      <el-table class="table"   :stripe="true" size="medium" :data="teachers" border>
        <el-table-column fixed prop="userName" label="姓名" width="150"></el-table-column>
        <el-table-column prop="userSex" label="性别" width="120"></el-table-column>
        <el-table-column prop="userTypeTypeName" label="职位" width="120"></el-table-column>
        <el-table-column prop="userMobile" label="手机号码" width="120"></el-table-column>
        <el-table-column prop="userId" label="工号" width="100"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="removeTeacher(scope.row.userUid)">删除</el-button>
            <el-button @click="editTeacher(scope.$index,scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="add">
        <el-button
          @click="teacherFromVisible2 = true"
          type="success"
          icon="el-icon-plus"
          circle
        ></el-button>
      </div>
    </div>
    <!-- 编辑教师信息表单 -->
    <el-dialog
      title="编辑教师信息"
      width="500px"
      :append-to-body="true"
      :center="true"
      :visible.sync="teacherFromVisible"
      :close-on-press-escape="true"
    >
      <el-form
        class="teacherFrom"
        :model="editContent"
        label-width="100px"
        label-position="left"
        :inline="true"
        ref="teacherForm"
      >
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="editContent.userName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="userSex">
          <el-input v-model="editContent.userSex"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="userMobile">
          <el-input v-model="editContent.userMobile"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="userTypeTypeName">
          <el-input v-model="editContent.userTypeTypeName"></el-input>
        </el-form-item>
        <el-form-item label="工号" prop="userId">
          <el-input v-model="editContent.userId"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="modifyTeacher">提交</el-button>
          <el-button @click="teacherFromVisible = false;">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
   <!-- 新增成员表单 -->
    <el-dialog
      title="新增成员"
      width="500px"
      :append-to-body="true"
      :center="true"
      :visible.sync="teacherFromVisible2"
      :close-on-press-escape="true"
    >
      <el-form
        class="teacherFrom"
        :model="addContent"
        label-width="100px"
        label-position="left"
        :inline="true"
        ref="teacherForm"
      >
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="addContent.userName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="userSex">
          <el-input v-model="addContent.userSex"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="userMobile">
          <el-input v-model="addContent.userMobile"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addContent.userPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addTeacher">提交</el-button>
          <el-button @click="teacherFromVisible2 = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {mapState,mapActions} from 'vuex'

export default {
  data() {
    return {
      editContent: {},
      addContent:{
        userPassword:'',
        userMobile:'',
        userSex:'',
        userName:''
      },
      teacherFromVisible: false,
      teacherFromVisible2:false,
      editIndex: null
    };
  },
  computed:{
    teachers:{
      get() { return this.$store.state.teachers }, 
      set(newVal) { this.$store.state.teachers = newVal}
    }
  },
  methods: {
    ...mapActions(['getTeachers']),
    // 编辑信息传递
    editTeacher(index, teacherInfo) {
      this.editIndex = index;
      this.editContent = JSON.parse(JSON.stringify(teacherInfo));
      this.teacherFromVisible = true;
    },
    //获取所有教师信息
    //新增教师
    async addTeacher() {
      let data = await this.$api.API_ADD_TEACHER(this.addContent);
      // console.log(data.data)
      if(data.code == 1){
        this.teacherFromVisible2 = false;
        this.getTeachers();
      }
    },
    //移除教师
    async removeTeacher(id) {
      let data = await this.$api.API_REMOVE_TEACHER(`?uid=${id}`);
      if (data.code == 1) {
        this.teachers = this.teachers.filter(el => el.userUid !== id);
      }
    },
    //教师信息修改
    async modifyTeacher() {
      let params = this.editContent;
      let data = await this.$api.API_MODIFY_TEACHER(params);
      // console.log(data.data.code);
      if (data.code == 1) {
        this.teacherFromVisible = false;
        this.$set(this.teachers, this.editIndex, params);
      }
    }
  },
  watch: {
    teacherFromVisible2(newVal) {
      if (!newVal) {
        let content = this.addContent;
        for (let i in content) {
          content[i] = "";
        }
      }
    }
  },
  created() {
    this.getTeachers();
  }
};
</script>

<style scoped>
.local-container{
  position:relative;
  width: 720px;
  margin: 0 auto;
  padding-top: 80px;
}
.table {
  width: 720px;
}

.teacherFrom {
  text-align: center;
}
.add {
  position: absolute;
  top:0;
  right:-60px;
}
</style>