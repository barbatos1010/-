<template>
  <div class="local-container" style="">
    <div style="position:relative;  width:100%; height:100%;">
      <el-table class="table"  :stripe="true" size="medium" :data="classList" border>
        <el-table-column fixed prop="classId" label="编号" width="150"></el-table-column>
        <el-table-column prop="className" label="班级名称" width="120"></el-table-column>
        <el-table-column prop="classStudents" label="人数" width="120"></el-table-column>
        <el-table-column prop="courseName" label="课程" width="120"></el-table-column>
        <el-table-column prop="userName" label="授课教师" width="100"></el-table-column>
        <el-table-column prop="classCreateTime" label="开班时间" width="200"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="removeClass(scope.row.classId,scope.$index)"
            >删除</el-button>
            <el-button @click="editClass(scope.$index,scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="add">
        <el-button @click="classFromVisible = true" type="success" icon="el-icon-plus" circle></el-button>
      </div>
    </div>
    <!-- 编辑班级信息表单 -->
    <el-dialog
      title="编辑班级信息"
      width="500px"
      :append-to-body="true"
      :center="true"
      :visible.sync="classFromVisible2"
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
        <el-form-item label="班级名称" prop="className">
          <el-input v-model="editContent.className"></el-input>
        </el-form-item>
        <el-form-item label="课程编号" prop="classCourseId">
          <el-input v-model="editContent.classCourseId"></el-input>
        </el-form-item>
        <el-form-item label="教师编号" prop="classTeacherId">
          <el-input v-model="editContent.classTeacherId"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="modifyClass">提交</el-button>
          <el-button @click="teacherFromVisible2 = false;">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加班级 -->
    <el-dialog
      title="新增班级"
      width="500px"
      :append-to-body="true"
      :center="true"
      :visible.sync="classFromVisible"
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
        <el-form-item label="班级名称" prop="className">
          <el-input v-model="addContent.className"></el-input>
        </el-form-item>
        <el-form-item label="课程编号" prop="classCourseId">
          <el-input v-model="addContent.classCourseId"></el-input>
        </el-form-item>
        <el-form-item label="教师编号" prop="classTeacherId">
          <el-input v-model="addContent.classTeacherId"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addClass">提交</el-button>
          <el-button @click="classFromVisible = false;">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      classList: [],
      addContent: {
        className: "",
        classCourseId: "",
        classTeacherId: ""
      },
      editContent:{
          
      },
      classFromVisible: false,
      classFromVisible2: false,
      editIndex:''
    };
  },
  methods: {
    editClass(index,classInfo){
      this.editIndex = index;
      this.editContent = JSON.parse(JSON.stringify(classInfo));
      this.classFromVisible2 = true;
    },
    //获取课程信息
    async getAllCourse() {
      let data = await this.$api.API_GETALL_COURSE();
      console.log('课程',data);
    },
    //获取班级信息
    async getAllClass() {
      let data = await this.$api.API_GETALL_CLASS();
      this.classList = data.data;
    //   console.log(data);
    },
    //添加新班
    async addClass() {
      let data = await this.$api.API_ADD_CLASS(this.addContent);
      if(data.data.code == 1){
        this.getAllClass();
        this.classFromVisible = false;
      }
    },
    //移除班级
    async removeClass(classId, index) {
      let data = await this.$api.API_REMOVE_CLASS(`?classId=${classId}`);
      if (data.data.code == 1) {
        this.classList.splice(index, 1);
      }
    },
    //修改班级信息
    async modifyClass() {
        let params = this.editContent;
      const obj = {
         classId :params.classId,
         className :params.className,
         classCourseId :params.classCourseId,
         classTeacherId :params.classTeacherId,
      }
      let data = await this.$api.API_MODIFY_CLASS(obj);
      if(data.data.code == 1){
          this.getAllClass()
          this.classFromVisible2 = false;
      }
      console.log(data);
    }
  },
  created() {
    this.getAllClass();
    this.getAllCourse()
  },
  watch: {
    classFromVisible(newVal) {
      if (!newVal) {
        let content = this.addContent;
        for (let i in content) {
          content[i] = "";
        }
      }
    }
  }
};
</script>

<style scoped>
.local-container{
  width: 1000px;
  margin: 0 auto;
  padding-top: 80px;
  position:relative;
}
.table {
  width:1000px;
  max-height: 400px;
}
.teacherFrom {
  text-align: center;
}
.add {
  position: absolute;
  top:0;
  right:-50px;
}
</style>