<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {};
</script>

<style lang="less">
@import url("./assets/styles/theme.less");
@import url("./assets/fonts/font.css");
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
  font-family: "方正黑体简体", "fzhtjt", "微软雅黑";
}
#KLT-INVITE {
  display: none;
}
.wrapper {
  width: 1200px;
  margin: 0 auto;
}
.pt_80 {
  padding-top: 80px;
}
.btn {
  line-height: 1em;
  font-size: 16px;
  color: @white;
  height: 34px;
  width: 80px;
  border-radius: 50px;
  text-align: center;
  outline: none;
  border: none;
  background: @primary;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: no-drop;
  }
}

.down_load {
  height: 800px;
  background: url("assets/imgs/download.png") no-repeat center;
  background-size: cover;
}
// 禁止选中文本
.no_select {
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
}

// /*滚动条整体样式*/
// html::-webkit-scrollbar,
// body::-webkit-scrollbar,
// .el-dialog__wrapper::-webkit-scrollbar {
//   width: 10px;
//   height: 1px;
// }
// /*滚动条滑块*/
// html::-webkit-scrollbar-thumb,
// body::-webkit-scrollbar-thumb,
// .el-dialog__wrapper::-webkit-scrollbar-thumb {
//   border-radius: 10px;
//   -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
//   background: #ccc;
// }
// /*滚动条轨道*/
// html::-webkit-scrollbar-track,
// body::-webkit-scrollbar-track,
// .el-dialog__wrapper::-webkit-scrollbar-track {
//   -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
//   border-radius: 10px;
//   background: #fff;
// }
</style>
