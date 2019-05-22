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
        <span style="color:#303133; line-height:2">模式选择</span>
        <br>
        <el-radio-group size="mini" v-model="radio1" style="margin-bottom:10px;">
          <el-radio-button label="添加模式"></el-radio-button>
          <el-radio-button :disabled="ModeSwitch" label="修改模式"></el-radio-button>
        </el-radio-group>
      </div>
      <el-tabs class="editTestPaperTabs" v-model="activeName">
        <!-- 选择题表单 -->
        <el-tab-pane label="选择题" name="choice">
          <el-form
            ref="choiceQuestionFrom"
            status-icon
            :rules="rules"
            :model="choiceQuestionFrom"
            label-width="80px"
            label-position="right"
            class="choiceQuestionFrom"
            :hide-required-asterisk="true"
          >
            <el-form-item label="分值" prop="tpqScore" class="score">
              <el-input size="mini" placeholder="请输入分值" v-model="choiceQuestionFrom.tpqScore"></el-input>
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
              @click="addNewOption"
              style="margin:0 0 10px 85px;"
              size="mini"
              type="primary"
              icon="el-icon-circle-plus-outline"
              plain
            >新增选项</el-button>
            <el-row
              v-for="(item,index) in choiceQuestionFrom.tpqQuestion.chooseQuestion"
              :key="index"
              class="options"
            >
              <el-col :span="3">
                <el-form-item :prop="`tpqQuestion.chooseQuestion[${index}].cqIsRight`">
                  <el-checkbox :label="'选项'+(index+1)" v-model="item.cqIsRight"></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="15">
                <el-form-item
                  :rules="choiceRule"
                  :prop="`tpqQuestion.chooseQuestion[${index}].cqOption`"
                >
                  <el-input
                    :placeholder="'请输入选项'+(index+1)"
                    v-model="item.cqOption"
                    type="textarea"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <el-button
                  v-if="index>1"
                  style="margin:10px 0 0 10px;"
                  type="warning"
                  size="mini"
                  @click="delOptions(index)"
                  icon="el-icon-delete"
                  plain
                ></el-button>
              </el-col>
            </el-row>
            <el-form-item class="form-btns" size="large">
              <el-button
                type="primary"
                @click="ModeSwitch ? addQuestion('choiceQuestionFrom') : modifyQuestion('choiceQuestionFrom')"
              >{{ModeSwitch ? '添加题目' : '提交修改'}}</el-button>
              <el-button @click="resetForm('choiceQuestionFrom')" type="danger">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 填空题表单 -->
        <el-tab-pane label="填空题" name="gap">
          <el-form
            ref="gapFillingFrom"
            :model="gapFillingFrom"
            status-icon
            label-width="80px"
            label-position="right"
            class="gapFillingFrom"
            :rules="gapRules"
            :hide-required-asterisk="true"
          >
            <el-form-item label="分值" prop="tpqScore" class="score">
              <el-input size="mini" placeholder="请输入分值" v-model="gapFillingFrom.tpqScore"></el-input>
            </el-form-item>
            <!-- 题干 -->
            <el-form-item label="题目" prop="tpqQuestion.questionTitle">
              <el-input
                id="text"
                type="textarea"
                @keydown.insert.native="insertAnswer"
                placeholder="请输入题目"
                v-model="gapFillingFrom.tpqQuestion.questionTitle"
              ></el-input>
              <span class="input-hint">填空处以 TK 表示</span>
            </el-form-item>
            <!-- 答案 -->
            <el-row>
                <el-col :span="4">
                  <el-button
                  style="margin-left:25px" 
                  type="primary" 
                  icon="el-icon-circle-plus-outline" 
                  plain @click="addNewGap" size="mini"
                  >添加填空</el-button>
                </el-col>
            </el-row>
            <el-row
              v-for="(item,i) in gapFillingFrom.tpqQuestion.fillQuestion"
              :key="i"
              class="gap-group"
            >
              <el-col
                style="line-height:40px;text-align:right;color:#606266;font-size:14px;"
                :span="3"
              >填空{{i+1}}：</el-col>
              <el-col :span="8">
                <el-form-item
                  :rules="answerRule"
                  :prop="`tpqQuestion.fillQuestion[${i}].fqAnswer`"
                  label="参考答案"
                >
                  <el-input v-model="item.fqAnswer" size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  v-if="ModeSwitch"
                  :rules="scoreRule"
                  :prop="`tpqQuestion.fillQuestion[${i}].fillQuestionScore[0].fqsScore`"
                  label="分值"
                >
                  <el-input size="mini" v-model="item.fillQuestionScore[0].fqsScore"></el-input>
                </el-form-item>
                <el-form-item
                  v-if="!ModeSwitch"
                  :rules="scoreRule"
                  :prop="`tpqQuestion.fillQuestion[${i}].fillQuestionScore.fqsScore`"
                  label="分值"
                >
                  <el-input size="mini" v-model.number="item.fillQuestionScore.fqsScore"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                  <el-button type="warning" icon="el-icon-delete" plain style="margin:6px 0 0 20px;" @click="deleteGap(i)" size="mini"></el-button>
              </el-col>
            </el-row>
            <el-form-item>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="ModeSwitch ? addQuestion('gapFillingFrom') : modifyQuestion('gapFillingFrom') "
              >{{ModeSwitch ? '添加题目' : '提交修改'}}</el-button>
              <el-button @click="resetForm('gapFillingFrom')" type="danger">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 问答题表单 -->
        <el-tab-pane label="问答题" name="essay">
          <el-form
            ref="essayQuestionFrom"
            :model="essayQuestionFrom"
            status-icon
            label-width="80px"
            label-position="right"
            class="essayQuestionFrom"
            :rules="essayRules"
            :hide-required-asterisk="true"
          >
            <el-form-item label="分值" prop="tpqScore" class="score">
              <el-input size="mini" placeholder="请输入分值" v-model="essayQuestionFrom.tpqScore"></el-input>
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
                @click="ModeSwitch ? addQuestion('essayQuestionFrom') : modifyQuestion('essayQuestionFrom')"
              >{{ModeSwitch ? '添加题目' : '提交修改'}}</el-button>
              <el-button @click="resetForm('essayQuestionFrom')" type="danger">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="content-right">
      <el-row class="testPaperDetails">
          <el-col :span="24" class="paperTitle">
            <div class="testPaperInfo">
              <h2>{{testPaperName}}</h2>
              <div>
                作者：
                <span>{{author}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="4">&nbsp;</el-col>
          <el-col :span="5">总计</el-col>
          <el-col :span="5">选择题</el-col>
          <el-col :span="5">填空题</el-col>
          <el-col :span="5">问答题</el-col>
          <el-col :span="4">分数</el-col>
          <el-col :span="5">{{totalScoreTotal}}</el-col>
          <el-col :span="5">{{choiceScoreTotal}}</el-col>
          <el-col :span="5">{{gapScoreTotal}}</el-col>
          <el-col :span="5">{{essayScoreTotal}}</el-col>
          <el-col :span="4">题目数量</el-col>
          <el-col
            :span="5"
          >{{choiceQuestionList.length+essayQuestionList.length+gapFillingList.length}}</el-col>
          <el-col :span="5">{{choiceQuestionList.length}}</el-col>
          <el-col :span="5">{{gapFillingList.length}}</el-col>
          <el-col :span="5">{{essayQuestionList.length}}</el-col>
        </el-row>
      <div class="show-area">
        <!-- 选择题区域 -->
        <div>选择题</div>
        <div v-for="(item,index1) in choiceQuestionList" :key="index1">
          <div>
            <span
              class="questionTitle"
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

          <ol type="A">
            <li
              v-for="(option,index2) in item.tpqQuestion.chooseQuestion"
              :key="index2"
              :style="{color:option.cqIsRight ? '#5CD656' : '#909399'}"
            >{{option.cqOption}}</li>
          </ol>
        </div>
        <!-- 填空题区域 -->
        <div>填空题</div>
        <div v-for="(item,index) in gapFillingList" :key="index+'a'" class="gap">
          <div>
            <span
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
              v-for="(item1,index2) in item.tpqQuestion.fillQuestion"
              :key="index2+'b'"
            >填空 {{index2+1}} ： {{item1.fqAnswer}} （ {{item1.fillQuestionScore.fqsScore}} 分 ）</li>
          </ul>
        </div>
        <!-- 问答题区域 -->
        <div>问答题</div>
        <div v-for="(item,index) in essayQuestionList" :key="index+'c'">
          <div >
            <span
             
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
          <div>参考答案 ：{{item.tpqQuestion.answerQuestion.aqAnswer}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    function validateScore(rule, value, callback) {
      if (!isNaN(value)) {
        if (value == 0 || value < 0) {
          callback(new Error("分数不能等于或小于0"));
        } else {
          callback();
        }
      } else {
        callback(new Error("分数必须为数字"));
      }
    }
    const RGE=/^\s+|\s+$/gm
    function validateBlank(rule, value, callback){
      if(!value.replace(RGE,'')){
        callback(new Error('输入不能为纯空格'))
      }else{
        callback()
      }
    }
    //分数验证
    const scoreRule = [
      { required: true, message: "分值不能为空", trigger: "blur" },
      { validator: validateScore, trigger: "blur" }
    ];
    //问题验证
    const questionRule = [
      { required: true, message: "问题不能为空", trigger: "blur" },
      { validator: validateBlank, trigger: "blur" }
    ];
    //答案验证
    const answerRule = [
      { required: true, message: "答案不能为空", trigger: "blur" },
      { validator: validateBlank, trigger: "blur" }
    ];
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
      answerRule: answerRule,
      scoreRule: scoreRule,
      choiceRule: [
        { required: true, message: "选项不能为空", trigger: "blur" },
        { validator: validateBlank, trigger: "blur" }
      ],
      // 填空分数不能为空
      rules: {
        tpqScore: scoreRule,
        "tpqQuestion.questionTitle": questionRule
      },
      gapRules: {
        tpqScore: scoreRule,
        "tpqQuestion.questionTitle": questionRule
      },
      essayRules: {
        tpqScore: scoreRule,
        "tpqQuestion.questionTitle": questionRule,
        "tpqQuestion.answerQuestion.aqAnswer": answerRule
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
    delOptions(index) {
      this.choiceQuestionFrom.tpqQuestion.chooseQuestion.splice(index, 1);
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
    //填空题提交前为每个空添加序列
    disposeGap() {
      let gaps = this.gapFillingFrom.tpqQuestion.fillQuestion;
      gaps.forEach((el, i) => {
        el.fqOrder = i + 1;
      });
    },
    //判断选项组是否有勾选一个或多个
    ifCorrect() {
      const arr = this.choiceQuestionFrom.tpqQuestion.chooseQuestion;
      const isRight = arr.some(el => {
        return el.cqIsRight;
      });
      if (!isRight) {
        this.$message.error("请选中一个或多个选项");
      }
      return isRight;
    },
    //新增题目
    addQuestion(formName) {
      this.$refs[formName].validate(async valid => {
        if (formName === "choiceQuestionFrom") {
          if (!this.ifCorrect()) {
            return false;
          }
        }
        if (valid) {
          if (formName === "gapFillingFrom") {
            const gap = this.gapFillingFrom;
            const sum = gap.tpqQuestion.fillQuestion.reduce(
              (prev, cur) =>
                parseFloat(cur.fillQuestionScore[0].fqsScore) +
                parseFloat(prev),
              0
            );
            if (gap.tpqScore != sum) {
              this.$message.error("填空的值总和不能大于或小于题目的分数");
              return;
            }
            this.disposeGap();
          }
          //合并表单对象
          let obj = { tpqPaperId: this.tpqPaperId, ...this[formName] };
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
            this.resetForm(formName);
            this.$message({
              message: "添加成功",
              type: "success"
            });
          }
        } else {
          this.$message.error("请按照提示文本输入");
        }
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
      this.$refs[formName].validate(valid => {
        //选择题提交前判断是否有勾选
        if (formName == "choiceQuestionFrom") {
          if (!this.ifCorrect()) {
            return;
          }
        }
        if (valid) {
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
              //判断填空分数与题目总分是否相等
              const gap = this.gapFillingFrom;
              console.log(gap);
              const sum = gap.tpqQuestion.fillQuestion.reduce(
                (prev, cur) =>
                  parseFloat(cur.fillQuestionScore.fqsScore) + parseFloat(prev),
                0
              );
              if (gap.tpqScore != sum) {
                this.$message.error("填空的值总和不能大于或小于题目的分数");
                return;
              }
              //填空题提交前为每个空添加序列
              this.disposeGap();
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
          // // 同步发送数据
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
                this.$set(
                  this[location],
                  this.changeIndex,
                  JSON.parse(JSON.stringify(this[formName]))
                );
                this.resetForm(formName);
              }
              this.$message({
                message: "修改成功",
                type: "success"
              });
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          this.$message.error("请按照提示文本输入");
        }
      });
    }
  },
  created() {
    // console.log('创建后')
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
      console.log(newVal);
      if (newVal === "添加模式") {
        this.ModeSwitch = true;
      } else {
        this.ModeSwitch = false;
      }
    },
    //一下三个列表监听计算总分
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
  border-right: 1px solid #DCDFE6;
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
.editTestPaperTabs /deep/ .el-tabs__content:-webkit-scrollbar {
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
}
.score /deep/ .el-input {
  width: 100px;
}
.choice-question /deep/ .el-textarea__inner {
  min-height: 100px !important;
  width: 80%;
}
.options {
  margin-bottom: 10px;
}
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
  width:100%;
  height: 150px;
  text-align: center;
  line-height: 30px;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
.paperTitle {
  height: 60px;
}
.input-hint {
  font-size: 12px;
  color: #909399;
}
</style>