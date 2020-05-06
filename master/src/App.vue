<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {};
</script>

<style lang="less">
@import url("./assets/fonts/fzhtjt/fzhtjt.css");
* {
  padding: 0;
  margin: 0;
}
html,
body {
  height: 100%;
  width: 100%;
}
#app {
  height: 100%;
  font-family: "fzhtjt";
  color: #555;
}

.page_box {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.my_select {
  width: 140px;
}
.my_time {
  width: 360px !important;
}

.el-button {
  border-radius: 4px;
}
.el-table {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-table__body-wrapper {
    flex: 1;
    overflow: auto;
  }
  td {
    height: 50px !important;
    padding: 0 !important;
    // line-height: 50px !important;
  }
}
// tab选项卡
.setDeal {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .el-tabs__content {
    flex: 1;
    .el-tab-pane {
      height: 100%;
    }
  }
}

.clearfix::before,
.clearfix::after {
  content: "";
  display: table;
}

.clearfix::after {
  clear: both;
}
// /*滚动条整体样式*/
// html::-webkit-scrollbar,body::-webkit-scrollbar,.el-dialog__wrapper::-webkit-scrollbar {
//     width: 10px;
//     height: 1px;
// }
// /*滚动条滑块*/
// html::-webkit-scrollbar-thumb,body::-webkit-scrollbar-thumb ,.el-dialog__wrapper::-webkit-scrollbar-thumb{
//     border-radius: 10px;
//     -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
//     background: #ccc;
// }
// /*滚动条轨道*/
// html::-webkit-scrollbar-track,body::-webkit-scrollbar-track ,.el-dialog__wrapper::-webkit-scrollbar-track{
//     -webkit-box-shadow: inset 0 0 1px rgba(0,0,0,0);
//     border-radius: 10px;
//     background: #fff;
// }
</style>
