<template>
  <div class="container main">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      class="login-from"
    >
      <el-form-item label="账号" prop="id">
        <el-input v-model="ruleForm.userMobile"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.userPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    return {
        //表单数据
      ruleForm: {
        userMobile: "13189898989",
        userPassword: "123456"
      },
      //表单验证规则
      rules: {
        userPassword: [{ validator: validatePass, trigger: "blur" }],
        userMobile: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
     submitForm(formName) {
     this.$refs[formName].validate( async (valid) => {
        if (valid) {
            let data = await this.$api.API_LOGIN(`userMobile=${this.ruleForm.userMobile}&userPassword=${this.ruleForm.userPassword}`)
            //登录成功
            if(data.status === 200){
              console.log(data)
               sessionStorage.setItem("USER_ID",data.data.profile.userUid)
               sessionStorage.setItem("USER_TOKEN",'Bearer '+data.data.access_token)
               let router_name = this.$route.query.redirect
               this.$router.replace({name:router_name ? router_name : 'home' })
            }else{
                alert('登录失败')
            }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created(){
    //   console.log(this.$route,this.$router)
  }
};
</script>

<style scoped>
.main {
  background: url("../assets/img/timg.jpg") no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
  position: relative;
}
.login-from {
  width: 300px;
  padding: 30px 70px 20px 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
</style>
