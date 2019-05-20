<template>
  <div class="container">
    <header class="header"></header>
    <div class="content-left">
      <!-- 切换表单模式 -->
      <span style="color:#909399; line-height:2">Mode Switch</span>
      <br>
      <el-radio-group size="mini" v-model="radio1" style="margin-bottom:20px;">
        <el-radio-button label="Add Mode"></el-radio-button>
        <el-radio-button :disabled="ModeSwitch" label="Modify Mode"></el-radio-button>
      </el-radio-group>
      <el-tabs class="editTestPaperTabs" v-model="activeName">
        <!-- 选择题表单 -->
        <el-tab-pane label="选择题" name="choice">
          <el-form
            ref="choiceQuestionFrom"
            :rules="rules"
            :model="choiceQuestionFrom"
            label-width="60px"
            label-position="left"
            class="choiceQuestionFrom"
          >
            <el-form-item label="分值" prop="tpqScore" class="score">
              <el-input size="mini" placeholder="请输入分值" v-model.number="choiceQuestionFrom.tpqScore"></el-input>
            </el-form-item>
            <el-form-item class="choice-question" prop="tpqQuestion.questionTitle" label="题目">
              <el-input
                type="textarea"
                placeholder="请输入题目"
                v-model="choiceQuestionFrom.tpqQuestion.questionTitle"
              ></el-input>
            </el-form-item>
            <!-- 选择题选项 -->
            <el-button
              type="warning"
              @click="addNewOption"
              style="margin-left:50px;"
              size="mini"
            >新增选项</el-button>
            <el-row
              v-for="(item,index) in choiceQuestionFrom.tpqQuestion.chooseQuestion"
              :key="index"
              class="options"
            >
              <el-col :span="3">
                <el-form-item  :prop="`tpqQuestion.chooseQuestion[${index}].cqIsRight`">
                  <el-checkbox :label="'选项'+(index+1)" v-model="item.cqIsRight"></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="15">
                <el-form-item :rules="choiceRules" :prop="`tpqQuestion.chooseQuestion[${index}].cqOption`">
                  <el-input
                    :placeholder="'请输入选项'+(index+1)"
                    v-model="item.cqOption"
                    type="textarea"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span='1'>
                <el-button style="margin:10px 0 0 10px;" type="danger" size="mini" @click="delOptions(index)" icon="el-icon-delete"></el-button>
              </el-col>
            </el-row>
            <el-form-item class="form-btns" size="large">
              <el-button
                type="primary"
                @click="ModeSwitch ? addQuestion(choiceQuestionFrom) : modifyQuestion('choiceQuestionFrom')"
              >提交</el-button>
              <el-button @click="resetForm('choiceQuestionFrom')" type="danger">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 填空题表单 -->
        <el-tab-pane label="填空题" name="gap">
          <el-form
            ref="gapFillingFrom"
            :model="gapFillingFrom"
            label-width="80px"
            label-position="right"
            class="gapFillingFrom"
            :rules="gapRules"
          >
            <el-form-item label="分值" prop="tpqScore" class="score">
              <el-input size="mini" placeholder="请输入分值" v-model.number="gapFillingFrom.tpqScore"></el-input>
            </el-form-item>
            <!-- 题目 -->
            <el-form-item label="题目" prop="tpqQuestion.questionTitle">
              <el-input
                id="text"
                type="textarea"
                @keydown.insert.native="insertAnswer"
                placeholder="请输入题目"
                v-model="gapFillingFrom.tpqQuestion.questionTitle"
              ></el-input>
              <span>填空处以 ______ 表示</span>
            </el-form-item>
            <!-- 答案 -->
            <el-row
              v-for="(item,i) in gapFillingFrom.tpqQuestion.fillQuestion"
              :key="i"
              class="gap-group"
            >
              <el-col style="line-height:40px;text-align:right;" :span="3">填空{{i+1}}：</el-col>
              <el-col :span="10">
                <el-form-item :prop="`tpqQuestion.fillQuestion[${i}].fqAnswer`" label="参考答案">
                  <el-input v-model="item.fqAnswer" size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  v-if="ModeSwitch"
                  :prop="`tpqQuestion.fillQuestion[${i}].fillQuestionScore[0].fqsScore`"
                  label="分值"
                >
                  <el-input size="mini" v-model="item.fillQuestionScore[0].fqsScore"></el-input>
                </el-form-item>
                <el-form-item
                  v-if="!ModeSwitch"
                  :prop="`tpqQuestion.fillQuestion[${i}].fillQuestionScore.fqsScore`"
                  label="分值"
                >
                  <el-input size="mini" v-model="item.fillQuestionScore.fqsScore"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item>
                  <el-button type="warning" @click="deleteGap(i)" size="mini">删除</el-button>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-row>
                <el-col :span="4">
                  <el-button type="success" @click="addNewGap" size="mini">添加填空</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="ModeSwitch ? submitGapFilling() : modifyQuestion('gapFillingFrom') "
              >提交</el-button>
              <el-button @click="resetForm('gapFillingFrom')" type="danger">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 问答题表单 -->
        <el-tab-pane label="问答题" name="essay">
          <el-form
            ref="essayQuestionFrom"
            :model="essayQuestionFrom"
            label-width="100px"
            label-position="left"
            class="essayQuestionFrom"
            :rules="essayRules"
          >
            <el-form-item label="分值" prop="tpqScore" class="score">
              <el-input size="mini" placeholder="请输入分值" v-model.number="essayQuestionFrom.tpqScore"></el-input>
            </el-form-item>
            <el-form-item label="题目" prop="tpqQuestion.questionTitle">
              <el-input
                type="textarea"
                v-model="essayQuestionFrom.tpqQuestion.questionTitle"
                placeholder="请输入题目"
              ></el-input>
            </el-form-item>
            <el-form-item label="参考答案" prop="tpqQuestion.answerQuestion.aqAnswer">
              <el-input
                type="textarea"
                v-model="essayQuestionFrom.tpqQuestion.answerQuestion.aqAnswer"
                placeholder="请输入参考答案"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="ModeSwitch ? addQuestion(essayQuestionFrom) : modifyQuestion('essayQuestionFrom')"
              >提交</el-button>
              <el-button @click="resetForm('essayQuestionFrom')" type="danger">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="content-right">
      <div class="show-area">
        <!-- 选择题区域 -->
        <div class="testPaperInfo">
          <h2 style="color:#fff;">{{testPaperName}}</h2>
          <div style="color:#fff;">
            作者：
            <span>{{author}}</span>
          </div>
        </div>
        <h2 class="h2">选择题</h2>
        <div class="choice" v-for="(item,index1) in choiceQuestionList" :key="index1">
          <div class="topic">
            {{index1+1}}、 问: {{item.tpqQuestion.questionTitle}} ( {{item.tpqScore}} 分)
            <el-button-group>
              <el-button
                size="mini"
                type="info"
                icon="el-icon-edit"
                @click="editQuestion('choiceQuestionFrom',item,index1)"
              ></el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteQuestion('choiceQuestionList',item.tpqId,index1)"
              ></el-button>
            </el-button-group>
          </div>

          <ol class="optionList" type="A">
            <li
              v-for="(option,index2) in item.tpqQuestion.chooseQuestion"
              :key="index2"
              :style="{color:option.cqIsRight ? '#5CD656' : '#ccc'}"
            >{{option.cqOption}}</li>
          </ol>
        </div>
        <!-- 填空题区域 -->
        <h2 class="h2">填空题</h2>
        <div v-for="(item,index) in gapFillingList" :key="index+'a'" style="color:#fff;">
          <div>
            {{index+1}}、 {{item.tpqQuestion.questionTitle}} ({{item.tpqScore}}) 分
            <el-button-group>
              <el-button
                size="mini"
                type="info"
                icon="el-icon-edit"
                @click="editQuestion('gapFillingFrom',item,index)"
              ></el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteQuestion('gapFillingList',item.tpqId,index)"
              ></el-button>
            </el-button-group>
          </div>
          <ul style="list-style:none;">
            <li
              v-for="(item1,index2) in item.tpqQuestion.fillQuestion"
              :key="index2+'b'"
            >{{index2+1}} ) {{item1.fqAnswer}} ({{item1.fillQuestionScore.fqsScore}}) 分</li>
          </ul>
        </div>
        <!-- 问答题区域 -->
        <h2 class="h2">问答题</h2>
        <div class="essay" v-for="(item,index) in essayQuestionList" :key="index+'c'">
          <div class="topic">
            {{index+1}}、 题目：{{item.tpqQuestion.questionTitle}} ( {{item.tpqScore}} 分)
            <el-button-group>
              <el-button
                size="mini"
                type="info"
                icon="el-icon-edit"
                @click="editQuestion('essayQuestionFrom',item,index)"
              ></el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteQuestion('essayQuestionList',item.tpqId,index)"
              ></el-button>
            </el-button-group>
          </div>
          <div class="answer">参考答案 ：{{item.tpqQuestion.answerQuestion.aqAnswer}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    const scoreRule= [
         { required: true, message: '分值不能为空', trigger: 'blur' },
         { type: 'number', message: "请输入数字" }
    ]
    const questionRule = [{ required: true, message: '问题不能为空', trigger: 'blur' }]
    return {
      testPaperName: "",
      author: "",
      testPaperInfo: "",
      problemType: 1,
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
              fillQuestionScore: [
                {
                  fqsScore: ""
                }
              ]
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
      //表单验证规则
      choiceRules:[{ required: true, message: '选项不能为空', trigger: 'blur' }],
      rules:{
       tpqScore:scoreRule,
       'tpqQuestion.questionTitle':questionRule
      },
      gapRules:{
        tpqScore:scoreRule,
       'tpqQuestion.questionTitle':questionRule
      },
      essayRules:{
        tpqScore:scoreRule,
        'tpqQuestion.questionTitle':questionRule
      },
      //预览试卷分类数组
      choiceQuestionList: [],
      essayQuestionList: [],
      gapFillingList: [],
      //true为添加模式，false为修改模式
      ModeSwitch: true,
      radio1: "Add Mode",
      //正在被修改的题目下标
      changeIndex: 0
    };
  },
  methods: {
    //表单重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //选择题新增选项
    addNewOption() {
      let options = this.choiceQuestionFrom.tpqQuestion.chooseQuestion;
      if (options.length < 4) {
        options.push({ cqOption: "", cqIsRight: false });
      }
    },
    //删除选项
    delOptions(index){
      this.choiceQuestionFrom.tpqQuestion.chooseQuestion.splice(index,1)
    },
    //新增填空处
    addNewGap() {
      let gaps = this.gapFillingFrom.tpqQuestion.fillQuestion;
      gaps.push({
        fqOrder: "",
        fqAnswer: "",
        fillQuestionScore: [{ fqsScore: "" }]
      });
    },
    //删除填空处
    deleteGap(index) {
      let gaps = this.gapFillingFrom.tpqQuestion.fillQuestion;
      if (gaps.length > 1) {
        this.gapFillingFrom.tpqQuestion.fillQuestion.splice(index, 1);
      }
    },
    //填空题提交前数据处理
    submitGapFilling() {
      let gaps = this.gapFillingFrom.tpqQuestion.fillQuestion;
      gaps.forEach((el, i) => {
        el.fqOrder = i + 1;
      });
      this.addQuestion(this.gapFillingFrom);
      console.log("提交");
    },
    //新增题目
    async addQuestion(formData) {
      //合并表单对象
      let obj = { tpqPaperId: this.tpqPaperId, ...formData };
      //发送添加请求
      let data = await this.$api.API_ADD_QUESTION(obj);
      console.log(data);
      if (data.code === 1) {
        switch (data.data.tpqQuestion.questionTypeId) {
          case 1:
            //添加到右边展示区
            this.choiceQuestionList.push(data.data);
            //重置表单
            this.resetForm("choiceQuestionFrom");
            break;
          case 2:
            this.gapFillingList.push(data.data);
            this.resetForm("gapFillingFrom");
            break;
          case 3:
            this.essayQuestionList.push(data.data);
            this.resetForm("essayQuestionFrom");
            break;
        }
      }
    },
    //页面初始化
    async initialize() {
      if (!this.$route.query.testPaperId) {
        this.$router.push({ name: "createPapers" });
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
    },
    //编辑问题 ---修改
    editQuestion(formName, question, index) {
      this.changeIndex = index;
      this[formName] = JSON.parse(JSON.stringify(question));
      this.ModeSwitch = false;
      switch (formName) {
        case "choiceQuestionFrom":
          this.activeName = "choice";
          break;
        case "gapFillingFrom":
          this.activeName = "gap";
          break;
        case "essayQuestionFrom":
          this.activeName = "essay";
          break;
      }
    },
    //删除问题
    async deleteQuestion(liatName, tpqId, index) {
      console.log(liatName, tpqId, index);
      const data = await this.$api.API_DEL_QUESTION(
        `?paperQuestionId=${tpqId}`
      );
      console.log(data);
      if (data.code === 1) {
        this[liatName].splice(index, 1);
      }
    },
    //提交修改好的问题
    async modifyQuestion(formName) {
      const form = this[formName];
      const { tpqQuestion } = form;
      // 修改分数数据
      let modifyScore;
      // 修改问题数据
      let modifyQuestion;
      //被修改问题所在数组
      let location;
      //处理将要发送的数据
      switch (formName) {
        // 处理选择题数据
        case "choiceQuestionFrom":
          modifyScore = {
            tpqId: form.tpqId,
            tpqScore: form.tpqScore
          };
          tpqQuestion.chooseQuestion.forEach(el => {
            delete el.cqQuestionId;
          });
          modifyQuestion = {
            questionId: tpqQuestion.questionId,
            questionTitle: tpqQuestion.questionTitle,
            questionTypeId: 1,
            chooseQuestion: tpqQuestion.chooseQuestion
          };
          location = "choiceQuestionList";
          break;
        case "gapFillingFrom":
          // 处理填空题数据
          //填空组的分值数组
          const FillQuestionScore = tpqQuestion.fillQuestion.map(el => {
            return {
              FqsFilleQuestionId: el.fillQuestionScore.fqsFilleQuestionId,
              FqsPaperQuestionId: el.fillQuestionScore.fqsPaperQuestionId,
              FqsScore: el.fillQuestionScore.fqsScore
            };
          });
          modifyScore = {
            tpqId: form.tpqId, //主键编号
            tpqScore: form.tpqScore, //填空题分值
            FillQuestionScore: FillQuestionScore
          };
          const fillQuestion = tpqQuestion.fillQuestion.map((el, index) => {
            if (el.fqId) {
              return {
                fqId: el.fqId,
                fqAnswer: el.fqAnswer,
                fqOrder: el.fqOrder
              };
            } else {
              return {
                fqAnswer: el.fqAnswer,
                fqOrder: index + 1
              };
            }
          });
          modifyQuestion = {
            questionId: tpqQuestion.questionId,
            questionTitle: tpqQuestion.questionTitle,
            questionTypeId: 2,
            fillQuestion: fillQuestion
          };
          location = "gapFillingList";
          // console.log(modifyQuestion,modifyScore);
          break;
        case "essayQuestionFrom":
          // 处理问答题数据
          modifyScore = {
            tpqId: form.tpqId,
            tpqScore: form.tpqScore
          };
          modifyQuestion = {
            questionId: tpqQuestion.questionId,
            questionTitle: tpqQuestion.questionTitle,
            questionTypeId: 3,
            answerQuestion: tpqQuestion.answerQuestion
          };
          location = "essayQuestionList";
          // console.log(modifyQuestion)
          break;
      }
      // 同步发送数据
      Promise.all([
        this.$api.API_MODIFY_QUESTION(
          modifyQuestion,
          `?paperQuestionId=${form.tpqId}`
        ),
        this.$api.API_MODIFY_SCORE(modifyScore)
      ])
        .then(res => {
          let a = res[0].code;
          let b = res[1].code;
          if (
            (a === 1 || a === 0) &&
            (b === 1 || b === 0) &&
            (a !== 0 || b !== 0)
          ) {
            // console.log('成功了')
            // console.log(this[location][this.changeIndex],this[formName])
            this.$set(this[location], this.changeIndex, this[formName]);
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
        this.radio1 = "Add Mode";
      } else {
        this.radio1 = "Modify Mode";
      }
    },
    radio1(newVal) {
      if (newVal === "Add Mode") {
        this.ModeSwitch = true;
      } else {
        this.ModeSwitch = false;
      }
    }
  }
};
</script>
<style scoped>
.content-left,
.content-right {
  width: 48%;
  height: 90%;
  float: left;
  margin: 0 1%;
}
.content-left {
  border: 1px #ccc solid;
  padding: 15px;
  box-sizing: border-box;

  border-radius: 10px;
}
.header {
  height: 8%;
}
.editTestPaperTabs /deep/ .el-tabs__item {
  border-bottom: 2px solid #e4e7ed;
}
.editTestPaperTabs {
  width: 100%;
  height: 89%;
}
.editTestPaperTabs /deep/ .el-tabs__content::-webkit-scrollbar {
    width:0;
    height:0;
}
.editTestPaperTabs /deep/ .el-tabs__content {
  height: 89%;
  overflow: auto;
}
.score /deep/ .el-input {
  width: 100px;
}
.choice-question /deep/ .el-textarea__inner {
  min-height: 100px !important;
  width: 80%;
}
.options{
  margin-bottom: 10px;
}
.show-area::-webkit-scrollbar{
  width:0;
  height:0;
}
.show-area {
  width: 100%;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
  background-color: #1e1e1e;
  padding: 15px;
  float: left;
  border-radius: 10px;
}
.options /deep/ .el-form-item {
  margin-bottom: 10px;
}

.divide {
  width: 800px;
  margin: 20px auto;
}
.form-btns {
  margin-top: 10px;
}
.h2 {
  margin: 20px 0;
  color: #32bcb0;
}
.topic {
  color: #fff;
}
.optionList {
  margin: 10px 0 10px 52px;
  line-height: 25px;
}
.answer {
  color: #fff;
}
.essay .topic {
  margin: 10px;
}
.essay .answer {
  margin: 10px;
}
</style>
