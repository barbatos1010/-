<template>
  <div class="container">
      <el-form
        class="passwordFrom"
        :model="modifyPasswordFrom"
        label-width="100px"
        label-position="left"
        ref="passwordFrom"
      >
        <el-form-item label="现有密码" prop="oldPassword">
          <el-input v-model="modifyPasswordFrom.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="modifyPasswordFrom.newPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="modifyPassword">提交</el-button>
          <el-button @click="fromVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
    data(){
        return{
            modifyPasswordFrom:{
                newPassword:'',
                oldPassword:''
            },
            fromVisible:false
        }
    },
    methods:{
        //提交修改密码
        async modifyPassword(){
            let from = this.modifyPasswordFrom;
            console.log(from.newPassword)
            let data = await this.$api.API_MODIFY_PASSWORD(`uid=${sessionStorage.getItem('USER_ID')}&newPassword=${from.newPassword}&oldPassword=${from.oldPassword}`);
            if(data.data.code == 1){
                this.$router.push({name:'login'})
                sessionStorage.clear()
            }
            console.log(data)
        }
    }
}
</script>

<style scoped>
.container:before{
  content: '';
  display: table;
}
.passwordFrom{
    width: 300px;
    margin: 100px auto;

}
</style>