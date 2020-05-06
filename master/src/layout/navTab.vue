<template>
  <el-container class="navTab">
    <Nav />
    <el-container>
      <el-header>
        <Header />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer> </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import Nav from "./Items/Nav";
import Header from "./Items/Header";

export default {
  components: { Nav, Header },
  data() {
    return {};
  },
  methods: {},
  created() {},
};
</script>

<style lang="less" scoped>
.navTab {
  height: 100%;
  .el-header {
    // background-color: #161f2e;
  }
  .el-main {
    // background-color: #1c2940;
  }
  .el-footer {
    // background-color: #1c2940;
    text-align: center;
    line-height: 60px;
    font-size: 12px;
  }
}
</style>
