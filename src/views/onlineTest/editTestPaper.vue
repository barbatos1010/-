<template>
  <div class="container">
    <div class="content-left">
      <!-- 切换表单模式 -->
      <div style=" width:100%; text-align:center;position:relative;">
        <router-link
          :to="{name:'papersManagement'}"
          style="float:left;font-size:1.5em;position:absolute;left:0;"
        >
          <i class="el-icon-back"></i>
        </router-link>
        <span style="color:#303133; line-height:2">当前模式</span>
        <br>
        <el-radio-group size="mini" v-model="radio1" style="margin-bottom:10px;">
          <el-radio-button label="添加模式"></el-radio-button>
          <el-radio-button :disabled="ModeSwitch" label="修改模式"></el-radio-button>
        </el-radio-group>
      </div>
      <el-tabs class="editTestPaperTabs" v-model="activeName">
        <!-- 选择题表单 -->
        <el-tab-pane label="选择题" name="choice">
          <choiceForm
            @submitAdd="addQuestion"
            @submitModify="modifyQuestion"
            :modeSwitch="ModeSwitch"
            :formData="choiceQuestionFrom"
            ref="choiceQuestionFrom"
          ></choiceForm>
        </el-tab-pane>
        <!-- 填空题表单 -->
        <el-tab-pane label="填空题" name="gap">
          <gapForm
            @submitAdd="addQuestion"
            @submitModify="modifyQuestion"
            :modeSwitch="ModeSwitch"
            :formData="gapFillingFrom"
            ref="gapFillingFrom"
          ></gapForm>
        </el-tab-pane>
        <!-- 问答题表单 -->
        <el-tab-pane label="问答题" name="essay">
          <eassayForm
            ref="essayQuestionFrom"
            @submitAdd="addQuestion"
            @submitModify="modifyQuestion"
            :modeSwitch="ModeSwitch"
            :formData="essayQuestionFrom"
          ></eassayForm>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="content-right">
      <div class="testPaperDetails">
        <el-row>
          <el-col :span="24" class="paperTitle">
            <div class="testPaperInfo">
              <h2>{{testPaperName}}</h2>
              <div>
                作者：
                <span>{{author}}</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="row1">
          <el-col class="right" :span="4">&nbsp;</el-col>
          <el-col class="right" :span="5">总计</el-col>
          <el-col class="right" :span="5">选择题</el-col>
          <el-col class="right" :span="5">填空题</el-col>
          <el-col :span="5">问答题</el-col>
        </el-row>
        <el-row class="row2">
          <el-col class="right" :span="4">分数</el-col>
          <el-col class="right" :span="5">{{totalScoreTotal}}</el-col>
          <el-col class="right" :span="5">{{choiceScoreTotal}}</el-col>
          <el-col class="right" :span="5">{{gapScoreTotal}}</el-col>
          <el-col :span="5">{{essayScoreTotal}}</el-col>
        </el-row>
        <el-row class="row3">
          <el-col class="right" :span="4">题目数量</el-col>
          <el-col
          class="right"
            :span="5"
          >{{choiceQuestionList.length+essayQuestionList.length+gapFillingList.length}}</el-col>
          <el-col class="right" :span="5">{{choiceQuestionList.length}}</el-col>
          <el-col class="right" :span="5">{{gapFillingList.length}}</el-col>
          <el-col :span="5">{{essayQuestionList.length}}</el-col>
        </el-row>
      </div>
      <div class="show-area">
        <!-- 选择题区域 -->
        <div class="questionType">一、选择题</div>
        <div v-for="(item,index1) in choiceQuestionList" :key="index1">
          <div class="questionTitle">
            <span
              class="titleText"
            >{{index1+1}}、 问: {{item.tpqQuestion.questionTitle}} （ {{item.tpqScore}} 分 ）</span>
            <el-button-group>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                plain
                @click="editQuestion('choiceQuestionFrom',item,index1)"
              ></el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                plain
                @click="deleteQuestion('choiceQuestionList',item.tpqId,index1)"
              ></el-button>
            </el-button-group>
          </div>

          <ol class="choiceAnswer" type="A">
            <li
              v-for="(option,index2) in item.tpqQuestion.chooseQuestion"
              :key="index2"
              :style="{color:option.cqIsRight ? '#5CD656' : '#909399'}"
            >{{option.cqOption}}</li>
          </ol>
        </div>
        <!-- 填空题区域 -->
        <div class="questionType">二、填空题</div>
        <div v-for="(item,index) in gapFillingList" :key="index+'a'">
          <div class="questionTitle">
            <span
              class="titleText"
            >{{index+1}}、 {{item.tpqQuestion.questionTitle}} （ {{item.tpqScore}} 分 ）</span>
            <el-button-group>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                plain
                @click="editQuestion('gapFillingFrom',item,index)"
              ></el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                plain
                @click="deleteQuestion('gapFillingList',item.tpqId,index)"
              ></el-button>
            </el-button-group>
          </div>
          <ul>
            <li
              class="gapAnswer"
              v-for="(item1,index2) in item.tpqQuestion.fillQuestion"
              :key="index2+'b'"
            >
              填空 {{index2+1}} ：
              <span
                style="color:#909399;"
              >{{item1.fqAnswer}} （ {{item1.fillQuestionScore.fqsScore}} 分 ）</span>
            </li>
          </ul>
        </div>
        <!-- 问答题区域 -->
        <div class="questionType">三、问答题</div>
        <div v-for="(item,index) in essayQuestionList" :key="index+'c'">
          <div class="questionTitle">
            <span
              class="titleText"
            >{{index+1}}、 题目：{{item.tpqQuestion.questionTitle}} （ {{item.tpqScore}} 分 ）</span>
            <el-button-group>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="editQuestion('essayQuestionFrom',item,index)"
                plain
              ></el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                plain
                @click="deleteQuestion('essayQuestionList',item.tpqId,index)"
              ></el-button>
            </el-button-group>
          </div>
          <div class="essayAnswer">
            参考答案 ：
            <span style="color:#909399;">{{item.tpqQuestion.answerQuestion.aqAnswer}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//填空题表单组件
import eassayForm from "../../components/editPaperForms/essayForm";
//选择题表单组件
import choiceForm from "../../components/editPaperForms/choiceForm";
//填空题表单组件
import gapForm from "../../components/editPaperForms/gapForm";

export default {
  data() {
    return {
      testPaperName: "",
      author: "",
      testPaperInfo: "",
      activeName: "choice",
      tpqPaperId: "",
      choiceQuestionFrom: {
        //选择题表单数据
        tpqScore: "",
        tpqQuestion: {
          questionTitle: "",
          questionTypeId: 1,
          chooseQuestion: [
            {
              cqOption: "",
              cqIsRight: false
            },
            {
              cqOption: "",
              cqIsRight: false
            },
            {
              cqOption: "",
              cqIsRight: false
            },
            {
              cqOption: "",
              cqIsRight: false
            }
          ]
        }
      },
      gapFillingFrom: {
        //填空题表单数据
        tpqScore: "",
        tpqQuestion: {
          questionTitle: "",
          questionTypeId: 2,
          fillQuestion: [
            {
              fqOrder: "",
              fqAnswer: "",
              fillQuestionScore: [{ fqsScore: "" }]
            }
          ]
        }
      },
      essayQuestionFrom: {
        //问答题表单数据
        tpqScore: "",
        tpqQuestion: {
          questionTitle: "",
          questionTypeId: 3,
          answerQuestion: {
            aqAnswer: ""
          }
        }
      },
      //预览试卷分类数组
      choiceQuestionList: [],
      essayQuestionList: [],
      gapFillingList: [],
      //true为添加模式，false为修改模式
      ModeSwitch: true,
      radio1: "添加模式",
      //正在被修改的题目下标
      changeIndex: 0,
      choiceScoreTotal: 0,
      gapScoreTotal: 0,
      essayScoreTotal: 0
    };
  },
  computed: {
    totalScoreTotal() {
      return this.choiceScoreTotal + this.gapScoreTotal + this.essayScoreTotal;
    }
  },
  methods: {
    //新增题目
    async addQuestion({ formData, formName }) {
      console.log(formData, formName);
      //合并表单对象
      let obj = { tpqPaperId: this.tpqPaperId, ...formData };
      //发送添加请求
      let data = await this.$api.API_ADD_QUESTION(obj);
      // console.log(data);
      if (data.code === 1) {
        switch (data.data.tpqQuestion.questionTypeId) {
          case 1:
            //添加到右边展示区
            this.choiceQuestionList.push(data.data);
            break;
          case 2:
            this.gapFillingList.push(data.data);
            break;
          case 3:
            this.essayQuestionList.push(data.data);
            break;
        }
        //重置表单
        this.$refs[formName].resetForm();
        //成功消息弹出框
        this.$message({
          message: "添加成功",
          type: "success"
        });
      }
    },
    addNewGap() {
      let gaps = this.gapFillingFrom.tpqQuestion.fillQuestion;
      gaps.push({
        fqOrder: "",
        fqAnswer: "",
        fillQuestionScore: [{ fqsScore: "" }]
      });
    },
    //页面初始化
    async initialize() {
      if (!this.$route.query.testPaperId) {
        this.$router.push({ name: "papersManagement" });
        return false;
      }
      const query = this.$route.query;
      const testPaperId = query.testPaperId;
      //数据初始化
      this.tpqPaperId = testPaperId;
      this.testPaperName = query.testPaperName;
      this.author = query.author;
      // console.log(this.testPaperId)
      //请求试卷信息
      const res = await this.$api.API_GET_TEST_PAPER(`?id=${testPaperId}`);
      //题型分类
      res.forEach(el => {
        const score = el.tpqScore;
        switch (el.tpqQuestion.questionTypeId) {
          case 1:
            this.choiceQuestionList.push(el);
            break;
          case 2:
            this.gapFillingList.push(el);
            break;
          case 3:
            this.essayQuestionList.push(el);
            break;
        }
      });
      // console.log('初始化完成')
    },
    //编辑问题 ---修改
    editQuestion(formName, question, index) {
      this.changeIndex = index;
      switch (formName) {
        case "choiceQuestionFrom":
          this.activeName = "choice";
          break;
        case "gapFillingFrom":
          const {
            tpqQuestion: { fillQuestion }
          } = question;
          const length =
            fillQuestion.length -
            this.gapFillingFrom.tpqQuestion.fillQuestion.length;
          if (length > 0) {
            for (let i = 0; i < length; i++) {
              this.addNewGap();
            }
          }
          this.activeName = "gap";
          break;
        case "essayQuestionFrom":
          this.activeName = "essay";
          break;
      }
      this.$refs[formName].resetForm();
      this.$nextTick(() => {
        this[formName] = this.$relieve(question);
        this.ModeSwitch = false;
      });
    },
    //删除问题
    deleteQuestion(liatName, tpqId, index) {
      this.$confirm("删除此题目？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const data = await this.$api.API_DEL_QUESTION(
          `?paperQuestionId=${tpqId}`
        );
        if (data.code === 1) {
          this[liatName].splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        }
      });
    },
    //提交修改好的问题
    async modifyQuestion({
      modifyScore,
      modifyQuestion,
      listName,
      formData,
      formName
    }) {
      // 同步发送数据
      Promise.all([
        this.$api.API_MODIFY_QUESTION(
          modifyQuestion,
          `?paperQuestionId=${formData.tpqId}`
        ),
        this.$api.API_MODIFY_SCORE(modifyScore)
      ])
        .then(res => {
          let a = res[0].code;
          let b = res[1].code;
          console.log(a,b)
          console.log((a == 1 && b == 0) || (a == 0 && b == 1) || (a == 1 && b == 1) || (a == 0 && b == 0))
          if ((a == 1 && b == 0) || (a == 0 && b == 1) || (a == 1 && b == 1) || (a == 0 && b == 0)) {
            //将修改后的表单数据返回展示区
            this.$set(
              this[listName],
              this.changeIndex,
              this.$relieve(formData)
            );
            console.log(formData)
            this.$message({
            message: "修改成功",
            type: "success"
          });
          this.$refs[formName].resetForm();
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.initialize();
  },
  //状态监听
  watch: {
    //监听模式改变切换表单数据
    ModeSwitch(newVal) {
      if (newVal) {
        this.choiceQuestionFrom = {
          tpqScore: "",
          tpqQuestion: {
            questionTitle: "",
            questionTypeId: 1,
            chooseQuestion: [
              {
                cqOption: "",
                cqIsRight: false
              },
              {
                cqOption: "",
                cqIsRight: false
              },
              {
                cqOption: "",
                cqIsRight: false
              },
              {
                cqOption: "",
                cqIsRight: false
              }
            ]
          }
        };
        this.gapFillingFrom = {
          //填空题表单数据
          tpqScore: "",
          tpqQuestion: {
            questionTitle: "",
            questionTypeId: 2,
            fillQuestion: [
              {
                fqOrder: "",
                fqAnswer: "",
                fillQuestionScore: [
                  {
                    fqsScore: ""
                  }
                ]
              }
            ]
          }
        };
        this.essayQuestionFrom = {
          //问答题表单数据
          tpqScore: "",
          tpqQuestion: {
            questionTitle: "",
            questionTypeId: 3,
            answerQuestion: {
              aqAnswer: ""
            }
          }
        };
        this.radio1 = "添加模式";
      } else {
        this.radio1 = "修改模式";
      }
    },
    //改变选项切换模式
    radio1(newVal) {
      if (newVal === "添加模式") {
        this.ModeSwitch = true;
      } else {
        this.ModeSwitch = false;
      }
    },
    //三个列表监听计算总分
    choiceQuestionList: {
      deep: true,
      handler() {
        this.choiceScoreTotal = this.choiceQuestionList.reduce((prev, cur) => {
          // console.log(prev,cur.tpqScore)
          return prev + cur.tpqScore;
        }, 0);
      }
    },
    essayQuestionList: {
      deep: true,
      handler() {
        this.essayScoreTotal = this.essayQuestionList.reduce((prev, cur) => {
          return prev + cur.tpqScore;
        }, 0);
      }
    },
    gapFillingList: {
      deep: true,
      handler() {
        this.gapScoreTotal = this.gapFillingList.reduce((prev, cur) => {
          //  console.log(prev,cur.tpqScore)
          return prev + cur.tpqScore;
        }, 0);
      }
    }
  },
  components: {
    eassayForm,
    choiceForm,
    gapForm
  }
};
</script>
<style scoped>
.content-left,
.content-right {
  width: 50%;
  height: 100%;
  float: left;
}
.content-left {
  border-right: 1px solid #dcdfe6;
  padding: 15px;
  box-sizing: border-box;
}
.editTestPaperTabs /deep/ .el-tabs__item {
  border-bottom: 2px solid #e4e7ed;
}
.editTestPaperTabs {
  width: 100%;
  height: 89%;
}
.editTestPaperTabs /deep/ .el-tabs__content {
  height: 90%;
  overflow: auto;
}
.options {
  margin-bottom: 10px;
}

/* 右边预览区样式 */
.show-area {
  width: 100%;
  height: calc(100% - 150px);
  overflow: auto;
  box-sizing: border-box;
  padding: 15px;
  float: left;
  position: relative;
}
.testPaperDetails {
  width: 100%;
  height: 150px;
  text-align: center;
  line-height: 29px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.paperTitle {
  height: 60px;
  color: #303133;
}
.input-hint {
  font-size: 12px;
  color: #909399;
}
.questionType {
  font-size: 18px;
  margin: 20px 0;
  color: #303133;
}
.questionTitle {
  margin: 0 0 10px 15px;
  color: #303133;
}
.titleText {
  display: inline-block;
  width: 400px;
}
.choiceAnswer {
  margin: 0 0 10px 65px;
  line-height: 1.5;
  width: 320px;
  font-size: 14px;
}
.gapAnswer {
  line-height: 1.5;
  margin: 0 0 15px 45px;
  width: 320px;
  list-style: none;
  font-size: 14px;
}
.essayAnswer {
  width: 320px;
  line-height: 1.5;
  margin: 0 0 15px 45px;
  font-size: 14px;
}
.row1 {
  border-top: #DCDFE6 1px solid;
}
.right{
  border-right: #DCDFE6 1px solid;
}
.row2{
  border-top: #DCDFE6 1px solid;
  border-bottom: #DCDFE6 1px solid;
}
.row3{
   border-bottom: #DCDFE6 1px solid;
}
</style>