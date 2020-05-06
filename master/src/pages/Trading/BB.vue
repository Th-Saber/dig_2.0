<template>
  <el-tabs v-model="activeName" type="card" class="setDeal">
    <el-tab-pane label="充值记录" name="up" lazy>
      <BbUp :isAdmin="isAdmin" />
    </el-tab-pane>
    <el-tab-pane label="提现记录" name="down" lazy>
      <BbDown :isAdmin="isAdmin" />
    </el-tab-pane>
    <el-tab-pane label="可提取币" v-if="isAdmin" name="downBB" lazy>
      <DownBB :isAdmin="isAdmin" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import BbUp from "./BB_item/Bb_up";
import BbDown from "./BB_item/Bb_down";
import DownBB from "./BB_item/Down_BB";
export default {
  components: { BbUp, BbDown, DownBB },
  data() {
    let userdata = JSON.parse(sessionStorage.userdata);
    return {
      activeName: "up",
      isAdmin: userdata.userType !== 2,
    };
  },
};
</script>

<style lang="less" scoped>
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
</style>
