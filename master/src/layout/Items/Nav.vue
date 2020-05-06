<template>
  <div class="nav">
    <div class="nav_top">
      <img :src="logo" class="logo" alt="logo" />
    </div>
    <el-menu
      :default-active="$route.path"
      router
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
    >
      <div v-for="(v, i) in navConfig" :key="i + 'nav'">
        <el-submenu :index="v.path" v-if="v.children && checkAuth(v.auth)">
          <template slot="title">
            <svg-icon :icon-class="v.icon" />
            <span class="title_name" v-show="!isCollapse" slot="title">{{
              v.name
            }}</span>
          </template>
          <el-menu-item-group>
            <div
              v-for="(obj, index) in v.children"
              :key="i + '_child_' + index"
            >
              <el-menu-item :index="obj.path" v-if="checkAuth(obj.auth)">{{
                obj.name
              }}</el-menu-item>
            </div>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item v-else-if="checkAuth(v.auth)" :index="v.path">
          <svg-icon :icon-class="v.icon" />
          <span class="title_name" slot="title">{{ v.name }}</span>
        </el-menu-item>
      </div>
    </el-menu>
    <div class="foot_label">
      <el-button type="primary" :icon="iconType" @click="collapseFn()" circle />
    </div>
  </div>
</template>

<script>
import { menuConfig, agencyConfig, orderConfig } from "@/menuConfig";
export default {
  data() {
    return {
      isCollapse: false,
      logo: require("@/assets/imgs/logo.png"),
    };
  },
  methods: {
    collapseFn() {
      this.isCollapse = !this.isCollapse;
    },
    // 检查权限  显示列表
    checkAuth(arr) {
      if (!arr) return true;
      let { authIds } = JSON.parse(sessionStorage.userdata);
      for (const v of arr) {
        if (authIds.indexOf(v) !== -1) return true;
      }
      return false;
    },
  },
  computed: {
    navConfig() {
      let userdata = JSON.parse(sessionStorage.userdata);
      switch (userdata.userType) {
        // 管理员
        case 0:
          return menuConfig;
        case 2:
          return agencyConfig;
        case 3:
          return orderConfig;
        default:
          return menuConfig;
      }
    },
    iconType() {
      return `el-icon-d-arrow-${!this.isCollapse ? "left" : "right"}`;
    },
  },
};
</script>
<style lang="less" scoped>
.nav {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ccc;
  .nav_top {
    align-self: center;
    padding: 10px 0;
    .logo {
      width: 60px;
      height: 60px;
    }
  }

  .el-menu {
    flex: 1;
    border: none;
    &:not(.el-menu--collapse) {
      width: 200px;
    }
    .title_name {
      margin-left: 20px;
    }
  }
  /deep/ .el-menu--collapse {
    .el-submenu__icon-arrow {
      display: none;
    }
  }
  .foot_label {
    padding: 20px 0;
    align-self: center;
  }
}
</style>
