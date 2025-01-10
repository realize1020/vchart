<template>
  <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
    :collapse="isCollapse" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
    <h3>{{ isCollapse ? '后台' : '通用后台管理系统' }}</h3>

    <!-- <el-menu-item index="1">
      <i class="el-icon-menu"></i>
      <span slot="title"></span>
    </el-menu-item> -->
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span slot="title">系统管理</span>
      </template>
      <el-menu-item index="1" @click="route('/user/list')">
        <i class="el-icon-menu"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">角色管理</span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-menu"></i>
        <span slot="title">菜单管理</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>
<script>
import router from '@/router';

export default {
  data() {
    return {
      isCollapse: false
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    route(path) {
      if(path === '/user/list'){
        this.$router.push('/role/list');
      }else{
        this.$router.push('/user/list');
      }
      
    },
  }
}
</script>
<style lang="less" scope>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu {
  height: 100vh; //height:100%; //100vh;
  border-right: none;

  h3 {
    color: #fff;
    text-align: center;
    line-height: 48px;
    font-size: 16px;
    font-weight: 400;
  }
}
::-webkit-scrollbar {
    display:none;
}
</style>