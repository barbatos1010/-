<template>
  <div class="container">
    <!-- top-bar -->
    <div class="header">
      <div class="brand" :style="{width:isCollapse ? '24px' : '201px'}">智学无忧it教育</div>
      <!-- 侧边栏控制器 -->
      <div class="menu-control" @click="isCollapse = !isCollapse">
        <span v-show="isCollapse" class="el-icon-d-arrow-right"></span>
        <span v-show="!isCollapse" class="el-icon-d-arrow-left"></span>
      </div>
      <!-- 选项卡 -->
      <el-tabs
        v-if="tabs.length > 0"
        class="tab-bar"
        v-model="selectionTab"
        type="card"
        closable
        @tab-remove="removeTab"
      >
        <el-tab-pane
          v-for="(item) in tabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >{{item.content}}</el-tab-pane>
      </el-tabs>
      <div class="user">avatar &amp; nickname</div>
    </div>
    <!-- content -->
    <div class="content">
      <!-- 侧边栏 -->
      <el-menu
        class="el-menu-vertical-demo"
        default-active="1"
        :collapse="isCollapse"
        background-color="#000"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">在线测试</span>
          </template>
          <el-menu-item-group>
            <el-menu-item @click="addTab('planTest','安排测试')" index="1-1">安排测试</el-menu-item>
            <el-menu-item @click="addTab('correctPapers','批阅试卷')" index="1-2">批阅试卷</el-menu-item>
            <el-menu-item @click="addTab('createPapers','老师出卷')" index="1-3">老师出卷</el-menu-item>
            <el-menu-item @click="addTab('papersManagement','试卷管理')" index="1-4">试卷管理</el-menu-item>
            <el-menu-item @click="addTab('checkResult','查看成绩')" index="1-5">查看成绩</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">基础数据</span>
          </template>
          <el-menu-item-group>
            <el-menu-item @click="addTab('changePassword','修改密码')" index="2-1">修改密码</el-menu-item>
            <el-menu-item @click="addTab('teacherManagement','老师管理')" index="2-2">老师管理</el-menu-item>
            <el-menu-item @click="addTab('classManagement','班级管理')" index="2-3">班级管理</el-menu-item>
            <el-menu-item @click="addTab('studentManagement','学生管理')" index="2-4">学生管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
      <!-- 主体视图窗口 -->
      <div class="view-window">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: true,
      selectionTab: "",
      tabs: []
    };
  },
  methods: {
    addTab(targetName, title) {
      let index = this.tabs.findIndex(el => el.name == targetName);
      if (index == -1) {
        this.tabs.push({
          title: title,
          name: targetName
        });
        this.selectionTab = targetName;
      } else {
        this.selectionTab = this.tabs[index].name;
      }
    },
    removeTab(targetName) {
      let tabs = this.tabs;
      let activeName = this.selectionTab;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.selectionTab = activeName;
      this.tabs = tabs.filter(tab => tab.name !== targetName);
    }
  },
  watch: {
    selectionTab(newVal) {
      console.log(newVal);
      this.$router.push({ name: newVal });
    }
  }
};
</script>

<style scoped>
.header {
  background-color: black;
  height: 60px;
  box-sizing: border-box;
  padding: 0 20px;
  display: flex;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 285.5px;
  min-height: 400px;
}
.el-menu-vertical-demo.el-menu--collapse {
  height: 100%;
}
.user {
  float: right;
  color: #fff;
  position: absolute;
  right: 20px;
  line-height: 60px;
}
.brand {
  padding-right: 20px;
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  float: left;
  line-height: 60px;
  transition: all 0.4s;
  overflow: hidden;
}
.content {
  display: flex;
  height: calc(100% - 60px);
}
.view-window {
  width: 100%;
  height: 100%;
}
.menu-control {
  margin-right: 20px;
  color: #fff;
  line-height: 60px;
  font-size: 1.5rem;
  width: 35px;
  text-align: center;
  background-color: #7ac5cd;
}
.tab-bar .el-tabs__header {
  margin-top: 20px;
}
.tab-bar {
  width: 70%;
}
</style>
