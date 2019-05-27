<template>
  <el-form
    ref="choiceQuestionFrom"
    :rules="rules"
    :model="formData"
    label-width="80px"
    label-position="right"
    :hide-required-asterisk="true"
    class="choiceForm"
  >
    <el-form-item label="分值" prop="tpqScore" class="score">
      <el-input size="mini" placeholder="请输入分值" v-model="formData.tpqScore"></el-input>
    </el-form-item>
    <el-form-item class="choice-question" prop="tpqQuestion.questionTitle" label="题目">
      <el-input type="textarea" placeholder="请输入题目" v-model="formData.tpqQuestion.questionTitle"></el-input>
    </el-form-item>
    <!-- 选择题选项 -->
    <el-button
      @click="addNewOption"
      style="margin:0 0 10px 85px;"
      size="mini"
      type="primary"
      icon="el-icon-circle-plus-outline"
      plain
      :disabled="canAdd"
    >新增选项</el-button>
    <el-row
      v-for="(item,index) in formData.tpqQuestion.chooseQuestion"
      :key="index"
      class="options"
    >
      <el-col :span="3">
        <el-form-item :prop="`tpqQuestion.chooseQuestion[${index}].cqIsRight`">
          <el-checkbox :label="'选项 '+serialNumber[index]" v-model="item.cqIsRight"></el-checkbox>
        </el-form-item>
      </el-col>
      <el-col :span="15">
        <el-form-item :rules="optionsRule" :prop="`tpqQuestion.chooseQuestion[${index}].cqOption`">
          <el-input :placeholder="'请输入选项'+serialNumber[index]" v-model="item.cqOption" type="textarea"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="1">
        <el-button
          :disabled="canDel"
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
      formName: "choiceQuestionFrom",
      rules: {
        tpqScore: scoreRule,
        "tpqQuestion.questionTitle": balnkRule
      },
      optionsRule: balnkRule,
      serialNumber:['A','B','C','D','E','F','G'],
      canAdd:true,
      canDel:false
    };
  },
  methods: {
    //提交问题的数据到父组件方法
    submit() {
      const formName = this.formName;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.ifCorrect()) {
            const formData = this.formData;
            const { tpqId, tpqScore, tpqQuestion } = formData;
            const { questionId, questionTitle, chooseQuestion } = tpqQuestion;
            //添加题目数据
            const data = {
              formData,
              formName
            };
            if (this.modeSwitch) {
              this.$emit("submitAdd", data);
            } else {
              //修改分数数据
              const modifyScore = {
                tpqId,
                tpqScore
              };
              chooseQuestion.forEach(el => {
                delete el.cqQuestionId;
              });
              //修改题目数据
              const modifyQuestion = {
                questionId,
                questionTitle,
                questionTypeId: 1,
                chooseQuestion
              };
              this.$emit("submitModify", {
                modifyScore,
                modifyQuestion,
                listName: "choiceQuestionList",
                ...data
              });
            }
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
    //新增选项
    addNewOption() {
      const options = this.formData.tpqQuestion.chooseQuestion;
      options.push({ cqOption: "", cqIsRight: false });
    },
    //删除选项
    delOptions(index) {
      this.formData.tpqQuestion.chooseQuestion.splice(index, 1);
    },
    //判断选项组是否有勾选一个或多个
    ifCorrect() {
      const arr = this.formData.tpqQuestion.chooseQuestion;
      const isRight = arr.some(el => {
        return el.cqIsRight;
      });
      if (!isRight) {
        this.$message.error("请选中一个或多个选项");
      }
      return isRight;
    }
  },
  watch:{
    "formData.tpqQuestion.chooseQuestion"(newVal){
      const length = newVal.length;
      if(length == 2){
         this.canDel = true
      }else if(length == 4){
        this.canAdd = true
      }else{
        this.canDel = false
        this.canAdd = false
      }
    }
  }
};
</script>

<style>
.choiceForm /deep/ .el-input__inner{
  width: 100px;
}
</style>
