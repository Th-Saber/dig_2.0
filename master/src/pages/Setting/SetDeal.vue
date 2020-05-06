<template>
  <el-tabs v-model="activeName" type="card">
    <el-tab-pane label="所有设置" name="all" lazy>
      <All />
    </el-tab-pane>
    <el-tab-pane label="合约管理" name="cont" lazy>
      <Cont />
    </el-tab-pane>
    <el-tab-pane label="期权管理" name="two" lazy>
      <Two />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import All from "./DealItem/All";
import Cont from "./DealItem/Cont";
import Two from "./DealItem/Two";
export default {
  components: { All, Cont, Two },
  data() {
    return {
      activeName: "all"
    };
  }
};
</script>

<style lang="less" scoped>
.setDeal {
}
</style>
