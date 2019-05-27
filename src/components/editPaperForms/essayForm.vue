<template>
  <el-form
    ref="essayQuestionFrom"
    :model="formData"
    label-width="80px"
    label-position="right"
    :hide-required-asterisk="true"
    :rules="rules"
    class="essayForm"
  >
    <el-form-item label="分值" prop="tpqScore" class="score">
      <el-input size="mini" placeholder="请输入分值" v-model="formData.tpqScore"></el-input>
    </el-form-item>
    <el-form-item label="题目" prop="tpqQuestion.questionTitle">
      <el-input type="textarea" v-model="formData.tpqQuestion.questionTitle" placeholder="请输入题目"></el-input>
    </el-form-item>
    <el-form-item label="参考答案" prop="tpqQuestion.answerQuestion.aqAnswer">
      <el-input
        type="textarea"
        v-model="formData.tpqQuestion.answerQuestion.aqAnswer"
        placeholder="请输入参考答案"
      ></el-input>
    </el-form-item>
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
      formName: "essayQuestionFrom",
      rules: {
        tpqScore: scoreRule,
        "tpqQuestion.questionTitle": balnkRule,
        "tpqQuestion.answerQuestion.aqAnswer": balnkRule
      }
    };
  },
  methods: {
    submit() {
      const formName = this.formName;
      this.$refs[formName].validate(valid => {
        if (valid) {
          const formData = this.formData;
          const { tpqId, tpqScore, tpqQuestion } = formData;
          const data = {
            formData,
            formName
          };
          if (this.modeSwitch) {
            //添加问题
            this.$emit("submitAdd", data);
          } else {
            //修改问题
            const modifyScore = {
              tpqId,
              tpqScore
            };
            const modifyQuestion = {
              questionId: tpqQuestion.questionId,
              questionTitle: tpqQuestion.questionTitle,
              questionTypeId: 3,
              answerQuestion: tpqQuestion.answerQuestion
            };
            this.$emit("submitModify", {
              listName: "essayQuestionList",
              modifyScore,
              modifyQuestion,
              ...data
            });
          }
        } else {
          this.$message.error("请按照提示文本输入");
        }
      });
    },
    resetForm() {
      this.$refs[this.formName].resetFields();
    }
  },
  components: {
    
  }
};
</script>
<style>
.essayForm /deep/ .el-input__inner{
  width: 100px;
}
</style>
