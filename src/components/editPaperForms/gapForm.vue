<template>
  <el-form
    ref="gapFillingFrom"
    :model="formData"
    label-width="80px"
    label-position="right"
    :rules="rules"
    :hide-required-asterisk="true"
    class="gapForm"
  >
    <el-form-item label="分值" prop="tpqScore" class="score">

      <el-input size="mini" placeholder="请输入分值" v-model="formData.tpqScore"></el-input>
    </el-form-item>
    <!-- 题干 -->
    <el-form-item label="题目" prop="tpqQuestion.questionTitle">
      <el-input
        id="text"
        type="textarea"
        placeholder="请输入题目"
        v-model="formData.tpqQuestion.questionTitle"
      ></el-input>
      <span class="input-hint">填空处以 TK 表示</span>
    </el-form-item>
    <!-- 答案 -->
    <!-- <el-row>
      <el-col :span="4">
        <el-button
          style="margin-left:25px"
          type="primary"
          icon="el-icon-circle-plus-outline"
          plain
          @click="addNewGap"
          size="mini"
        >添加填空</el-button>
      </el-col>
    </el-row> -->
    <el-row v-for="(item,i) in formData.tpqQuestion.fillQuestion" :key="i" class="gap-group">
      <el-col
        style="line-height:40px;text-align:right;color:#606266;font-size:14px;"
        :span="3"
      >填空 {{i+1}}：</el-col>
      <el-col :span="8">
        <el-form-item
          :rules="fillRules"
          :prop="`tpqQuestion.fillQuestion[${i}].fqAnswer`"
          label="答案"
        >
          <el-input v-model="item.fqAnswer" size="mini"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item
          v-if="modeSwitch"
          :rules="scoreRule"
          :prop="`tpqQuestion.fillQuestion[${i}].fillQuestionScore[0].fqsScore`"
          label="分值"
        >
          <el-input size="mini" v-model="item.fillQuestionScore[0].fqsScore"></el-input>
        </el-form-item>
        <el-form-item
          v-if="!modeSwitch"
          :rules="scoreRule"
          :prop="`tpqQuestion.fillQuestion[${i}].fillQuestionScore.fqsScore`"
          label="分值"
        >
          <el-input size="mini" v-model.number="item.fillQuestionScore.fqsScore"></el-input>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="3">
        <el-button
          v-if="i>0"
          type="warning"
          icon="el-icon-delete"
          plain
          style="margin:6px 0 0 20px;"
          @click="deleteGap(i)"
          size="mini"
        ></el-button>
      </el-col> -->
    </el-row>
    <el-form-item></el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">{{modeSwitch ? '添加题目' : '提交修改'}}</el-button>
      <el-button @click="resetForm" type="danger">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
//表单验证规则
import { balnkRule, scoreRule } from "../../validationRule";

export default {
  props: ["formData", "modeSwitch"],
  data() {
    return {
      formName: "gapFillingFrom",
      rules: {
        tpqScore: scoreRule,
        "tpqQuestion.questionTitle": balnkRule
      },
      fillRules: balnkRule,
      scoreRule
    };
  },
  methods: {
    submit() {
      const formName = this.formName;
      this.$refs[formName].validate(valid => {
        if (valid) {
          const formData = this.formData;
          const { tpqId, tpqScore, FillQuestionScore, tpqQuestion } = formData;
          let { fillQuestion, questionId, questionTitle } = tpqQuestion;
          //判断总分是否对等所有填空的合集
          console.log(fillQuestion, this.modeSwitch);
          const sum = fillQuestion.reduce((prev, cur) => {
            if (this.modeSwitch) {
              return (
                parseFloat(cur.fillQuestionScore[0].fqsScore) + parseFloat(prev)
              );
            } else {
              return (
                parseFloat(cur.fillQuestionScore.fqsScore) + parseFloat(prev)
              );
            }
          }, 0);
          if (tpqScore != sum) {
            this.$message.error("填空的值总和不能大于或小于题目的分数");
            return;
          }
          const data = {
            formName,
            formData
          };
          if (this.modeSwitch) {
            //为每个填空答案添加序列号
            fillQuestion.forEach((el, i) => {
              el.fqOrder = i + 1;
            });
            this.$emit("submitAdd", data);
          } else {
            //为新增的填空添加序列
            let fillQuestions = fillQuestion.map((el, index) => {
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
            //修改分数需要的数据
            const modifyScore = {
              tpqId,
              tpqScore,
              FillQuestionScore
            };
            //修改问题需要的数据
            const modifyQuestion = {
              questionId,
              questionTitle,
              questionTypeId: 2,
              fillQuestion: fillQuestions
            };
            this.$emit("submitModify", {
              modifyScore,
              modifyQuestion,
              listName: "gapFillingList",
              ...data
            });
          }
        } else {
          this.$message.error("请按照提示文本输入");
        }
      });
    },
    //重置表单
    resetForm() {
      this.$refs[this.formName].resetFields();
    },
    addNewGap() {
      let gaps = this.formData.tpqQuestion.fillQuestion;
      gaps.push({
        fqOrder: "",
        fqAnswer: "",
        fillQuestionScore: [{ fqsScore: "" }]
      });
    },
    //删除填空处
    deleteGap(index) {
      let gaps = this.formData.tpqQuestion.fillQuestion;
      this.formData.tpqQuestion.fillQuestion.splice(index, 1);
    }
  },
  watch: {
    "formData.tpqQuestion.questionTitle"(newVal) {
      // console.log(newVal.match(/TK/g));
      const tkArr = newVal.match(/TK/g);
      //
      if (tkArr && tkArr.length > 0) {
        const tkArrLength = tkArr.length;
        let answers = this.formData.tpqQuestion.fillQuestion;
        const answerLength = answers.length
        if (tkArrLength != answerLength) {
          if (tkArrLength > answerLength) {
            answers.push({
              fqOrder: "",
              fqAnswer: "",
              fillQuestionScore: [{ fqsScore: "" }]
            })
          }else{
            answers.pop()
          }
        }
      }
    }
  }
};
</script>

<style>
.input-hint{
  font-size: 12px;
  color: #909399;
}
.gapForm /deep/ .el-input__inner{
  width: 100px;
}
</style>
