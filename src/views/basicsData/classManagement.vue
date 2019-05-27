<template>
  <div class="local-container">
      <el-table class="table" max-height="400px;" :stripe="true" size="medium" :data="classList" border>
        <el-table-column prop="classId" label="编号" width="150"></el-table-column>
        <el-table-column prop="className" label="班级名称" width="120"></el-table-column>
        <el-table-column prop="classStudents" label="人数" width="120"></el-table-column>
        <el-table-column prop="courseName" label="课程" width="120"></el-table-column>
        <el-table-column prop="userName" label="授课教师" width="100"></el-table-column>
        <el-table-column prop="classCreateTime" label="开班时间" width="200"></el-table-column>
        <el-table-column label="操作" width="100">
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
          <el-select v-model="editContent.classCourseId" placeholder="请选择">
            <el-option
              v-for="item in coursess"
              :key="item.courseId"
              :label="item.courseName"
              :value="item.courseId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教师编号" prop="classTeacherId">
          <el-select v-model="editContent.classTeacherId" placeholder="请选择">
            <el-option
              v-for="item in teachers"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="modifyClass">提交</el-button>
          <el-button @click="classFromVisible2 = false;">取消</el-button>
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
          <el-select v-model="addContent.classCourseId" placeholder="请选择">
            <el-option
              v-for="item in coursess"
              :key="item.courseId"
              :label="item.courseName"
              :value="item.courseId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教师编号" prop="classTeacherId">
          <el-select v-model="addContent.classTeacherId" placeholder="请选择">
            <el-option
              v-for="item in teachers"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
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
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      addContent: {
        className: "",
        classCourseId: "",
        classTeacherId: ""
      },
      editContent: {
        
      },
      classFromVisible: false,
      classFromVisible2: false,
      editIndex: ""
    };
  },
  computed: {
    ...mapState(["coursess","teachers"]),
    classList: {
      get() {
        return this.$store.state.classList;
      },
      set(newVal) {
        this.$store.state.classList = newVal;
      }
    }
  },
  methods: {
    ...mapActions(["getClassList", "getCoursess","getTeachers"]),
    editClass(index, classInfo) {
      this.editIndex = index;
      this.editContent = JSON.parse(JSON.stringify(classInfo));
      this.classFromVisible2 = true;
    },
    //添加新班
    async addClass() {
      let data = await this.$api.API_ADD_CLASS(this.addContent);
      if (data.code == 1) {
        await this.getClassList();
        this.classFromVisible = false;
      }
    },
    //移除班级
    async removeClass(classId, index) {
      let data = await this.$api.API_REMOVE_CLASS(`?classId=${classId}`);
      if (data.code == 1) {
        this.classList.splice(index, 1);
      }
    },
    //修改班级信息
    async modifyClass() {
      let params = this.editContent;
      const obj = {
        classId: params.classId,
        className: params.className,
        classCourseId: params.classCourseId,
        classTeacherId: params.classTeacherId
      };
      let data = await this.$api.API_MODIFY_CLASS(obj);
      if (data.code == 1) {
        this.getClassList();
        this.classFromVisible2 = false;
      }
      console.log(data);
    }
  },
  created() {
    this.getClassList();
    this.getCoursess();
    this.getTeachers()
  },
  watch: {
    classFromVisible(newVal) {
        let content = this.addContent;
        for (let i in content) {
          content[i] = "";
        }
    }
  }
};
</script>

<style scoped>
.local-container {
  width: 1000px;
  height: 100%;
  margin: 0 auto;
  padding-top: 80px;
  position: relative;
  box-sizing: border-box;
}
.table {
  width: 909px;
  max-height: 400px;
}
.table /deep/ .el-table__body-wrapper {
  max-height:356px !important;
}
.teacherFrom {
  text-align: center;
}
.add {
  position: absolute;
  top:100px;
  right: -10px;
}
</style>