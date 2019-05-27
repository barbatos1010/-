<template>
  <div class="container">
    <!-- top-bar -->
    <div class="header">
      <div class="brand" @click="logo" :style="{width:isCollapse ? '44px' : '220.5px'}">智学无忧it教育</div>
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
      <div class="user">
        {{nickname}}
        <img accept=".jpg" @click="uploadForm = true" class="avatar hand" :src="avatar">
      </div>
    </div>
    <!-- content -->
    <div class="content">
      <!-- 侧边栏 -->
      <el-menu
        class="el-menu-vertical-demo"
        :default-active="selectionTab"
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
            <el-menu-item @click="addTab('planTest','安排测试')" index="planTest">安排测试</el-menu-item>
            <el-menu-item @click="addTab('correctPapers','批阅试卷')" index="correctPapers">批阅试卷</el-menu-item>
            <el-menu-item @click="addTab('papersManagement','试卷管理')" index="papersManagement">试卷管理</el-menu-item>
            <el-menu-item @click="addTab('checkResult','查看成绩')" index="checkResult">查看成绩</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span slot="title">基础数据</span>
          </template>
          <el-menu-item-group>
            <el-menu-item @click="addTab('changePassword','修改密码')" index="changePassword">修改密码</el-menu-item>
            <el-menu-item @click="addTab('teacherManagement','老师管理')" index="teacherManagement">老师管理</el-menu-item>
            <el-menu-item @click="addTab('classManagement','班级管理')" index="classManagement">班级管理</el-menu-item>
            <el-menu-item @click="addTab('studentManagement','学生管理')" index="studentManagement">学生管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
      <!-- 主体视图窗口 -->
      <transition name="el-fade-in-linear">
        <div class="view-window">
          <router-view></router-view>
        </div>
      </transition>
    </div>
    <el-dialog title="上传图片" :visible.sync="uploadForm" width="30%">
      <div class="uploadArea">
         <img class="preview" :src="showArea">
      </div>
      <input ref="file" @change="getFile" type="file" accept="image/*">
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadForm = false">取 消</el-button>
        <el-button type="primary" @click="uploadAvatar">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
      selectionTab: "",
      selectionMenu: "",
      tabs: [],
      nickname: sessionStorage.getItem("USER_NICKNAME"),
      avatar: require("../assets/img/20160203022635285.jpg"),
      showArea: require("../assets/img/20160203022635285.jpg"),
      uploadForm: false,
      img:null
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
        if (tabs.length == 1) {
          this.$router.push({ name: "homePage" });
        }
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
      // console.log(this.selectionTab)
      this.tabs = tabs.filter(tab => tab.name !== targetName);
    },
    logo() {
      this.$router.push({ name: "homePage" });
      this.selectionTab = "";
    },
    //页面创建时获取本地存储
    getStorage() {
      if (sessionStorage.getItem("TAB_CHECKED")) {
        this.selectionTab = sessionStorage.getItem("TAB_CHECKED");
        this.selectionMenu = sessionStorage.getItem("MENU_CHECKED");
        this.tabs = JSON.parse(sessionStorage.getItem("TAB_LIST"));
      }
    },
    //页面刷新时使用会话存储保存数据
    storage() {
      window.addEventListener("beforeunload", () => {
        sessionStorage.setItem("TAB_LIST", JSON.stringify(this.tabs));
        sessionStorage.setItem("TAB_CHECKED", this.selectionTab);
        sessionStorage.setItem("MENU_CHECKED", this.selectionTab);
      });
    },
    //上传头像
    uploadAvatar() {
      this.$api.API_UPLOAD_AVATAR(new FormData().append('avatar',this.img),`userUid=${sessionStorage.getItem('USER_ID')}`)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
      this.uploadForm = false
    },
    getFile() {
      this.img = this.$refs["file"].files[0];
      this.showArea = window.URL.createObjectURL(this.img);
    }
  },
  created() {
    this.getStorage();
    this.storage();
  },
  watch: {
    selectionTab(newVal) {
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
  padding-right: 20px;
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
.avatar {
  width: 30px;
  height: 30px;
  vertical-align: middle;
  border-radius: 50%;
}
.brand {
  padding: 0 10px;
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  float: left;
  line-height: 60px;
  transition: all 0.4s;
  overflow: hidden;
  text-align: center;
}
.content {
  display: flex;
  height: calc(100% - 60px);
}
.view-window {
  width: 100%;
  height: 100%;
  position: relative;
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
.uploadArea{
  width: 165px;
  height: 165px;
}
.preview{
  width: 100%;
  height: 100%;
}
</style>
