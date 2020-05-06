<template>
  <div class="navTab">
    <div class="header">
      <Header />
    </div>
    <div class="main_box">
      <router-view />
    </div>
    <div class="footer">
      <Footer />
    </div>
    <el-backtop target=".navTab" bottom="160">
      <div class="to_top">
        UP
      </div>
    </el-backtop>
  </div>
</template>

<script>
import Header from "./Items/Header";
import Footer from "./Items/Footer";

export default {
  components: { Header, Footer },
  data() {
    return {};
  },
  methods: {},
  created() {},
};
</script>

<style lang="less" scoped>
@import url("../assets/styles/theme.less");
.navTab {
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  .header {
    position: fixed;
    top: 0;
    width: 100%;
    height: 80px;
    background-color: rgba(0, 20, 58, 0.8);
    z-index: 4;
  }
  .main_box {
    // padding-top: 80px;
  }
  .footer {
    height: 300px;
    background-color: @bg-clr;
  }
  .case_me {
    position: fixed;
    right: 0;
    bottom: 80px;
    height: 60px;
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 40px 0 0 40px;
    background-color: @main-line;
    cursor: pointer;
    transition: all 1s;
    &:hover {
      background-color: @primary;
    }
    span {
      margin-left: 10px;
      font-size: 16px;
      color: @white;
    }
  }
  .to_top {
    height: 100%;
    width: 100%;
    background-color: @main-line;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
    text-align: center;
    line-height: 40px;
    color: @white;
    border-radius: 6px;
  }
}
</style>
