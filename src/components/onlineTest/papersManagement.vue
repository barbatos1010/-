<template>
  <div class="container">
    <!-- 制作试卷表单 -->
    <div class="make">
      <h3 style="margin:20px 20px;">制作试卷</h3>
      <el-form
        ref="makeTestPaper"
        :model="paperFrom"
        class="make-test-paper-form"
        label-width="60px"
        label-position="left"
      >
        <el-form-item label="卷名" prop="tpTitle" size="mini">
          <el-input width="100px" size="mini" v-model="paperFrom.tpTitle" placeholder="请输入试卷名"></el-input>
        </el-form-item>
        <el-form-item label="课程" prop="tpCourseId" size="mini">
          <el-select size="mini" v-model="paperFrom.tpCourseId" placeholder="请选择对应课程">
            <el-option
              v-for="item in coursess"
              :key="item.courseId"
              :label="item.courseName"
              :value="item.courseId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="makePaper()">制作试卷</el-button>
          <el-button size="mini" @click="resetForm('makeTestPaper')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 试卷列表 -->
    <div class="testPaperTable">
      <el-table :data="testPaperList" style="100%">
        <el-table-column prop="tpTitle" label="卷名"></el-table-column>
        <el-table-column prop="userName" label="作者" width="180"></el-table-column>
        <el-table-column prop="courseName" label="课程" width="180"></el-table-column>
        <el-table-column prop="tpDate" label="创作时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" @click="editTestPaper(scope.row)">编辑</el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="deleteTestPaper(scope.row.tpId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :current-page.sync="currentPage"
        :page-count="testPaperPages"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      // testPaperList:[],
      currentPage: 1,
      paperFrom: {
        tpTitle: "",
        tpCourseId: ""
      }
    };
  },
  computed: {
    ...mapState(["coursess", "testPaperPages", "testPaperList"])
  },
  methods: {
    ...mapActions(["getCoursess", "getTestPaperList"]),
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      console.log(111);
    },
    //新增试卷
    async makePaper() {
      let formData = this.paperFrom;
      let data = await this.$api.API_MAKE_PAPER(
        { tpTitle: formData.tpTitle, tpCourseId: formData.tpCourseId },
        `?uid=${sessionStorage.getItem('USER_ID')}`
      );
      if (data.code == 1) {
        this.$router.push({
          name: "editTestPaper",
          query: {
            testPaperId: data.data.testPaperId,
            testPaperName: formData.tpTitle,
            author: sessionStorage.getItem('USER_NICKNAME')
          }
        });
      }
    },
    //编辑试卷
    editTestPaper(testPaperInfo) {
      // console.log(testPaperInfo);
      //跳转到编辑页面传入卷名、作者、试卷id
      this.$router.push({
        name: "editTestPaper",
        query: {
          testPaperId: testPaperInfo.tpId,
          author: testPaperInfo.userName,
          testPaperName: testPaperInfo.tpTitle
        }
      });
    },
    //删除试卷
    async deleteTestPaper(tpId) {
      let data = await this.$api.API_DELETE_TEST_PAPER(`id=${tpId}`);
      if (data.code == 1) {
        this.getTestPaperList(this.currentPage - 1);
      }
    }
  },
  created() {
    if (!this.coursess) {
      this.getCoursess();
    }
    if (!this.testPaperList) {
      this.getTestPaperList();
    }
  },
  watch: {
    currentPage(newVal) {
      this.getTestPaperList(newVal - 1);
    }
  }
};
</script>
<style scoped>
.container:before {
  content: "";
  display: table;
}
.container {
  overflow: auto;
  box-sizing: border-box;
}
.make-test-paper-form {
  width: 300px;
  padding: 20px;
}
.make {
  width: 80%;
  margin: 20px auto;
  border: 1px #ccc solid;
  border-radius: 10px;
}
.testPaperTable {
  width: 80%;
  border: 1px #ccc solid;
  border-radius: 10px;
  margin: 10px auto;
  padding: 10px;
  padding-bottom: 50px;
  box-sizing: border-box;
  position: relative;
  /* text-align: center; */
}
.pagination {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>