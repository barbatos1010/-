<template>
<el-form-item label="分值" prop="tpqScore" class="score">
    <el-input size="mini" placeholder="请输入分值" v-model="val" @input="$emit('update:value',$event)"></el-input>
</el-form-item>
</template>
<!-- <score :value.sync="formData.tpqScore"></score> -->
<script>
export default {
  props:{
    "value":String
  },
  data(){
      return {
        val:this.value
      }
  }
}
</script>

<style>

</style>
