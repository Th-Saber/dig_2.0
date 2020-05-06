<template>
  <el-tabs v-model="activeName" type="card" class="setDeal">
    <el-tab-pane label="发布记录" name="all" lazy v-if="isAdmin">
      <FbRelease :isAdmin="isAdmin" />
    </el-tab-pane>
    <el-tab-pane label="交易记录" name="cont" lazy>
      <FbTrading :isAdmin="isAdmin" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import FbRelease from "./Fb_item/Fb_Release";
import FbTrading from "./Fb_item/Fb_Trading";
export default {
  components: { FbRelease, FbTrading },
  data() {
    let userdata = JSON.parse(sessionStorage.userdata);
    return {
      activeName: userdata.userType !== 2 ? "all" : "cont",
      isAdmin: userdata.userType !== 2,
    };
  },
};
</script>

<style lang="less" scoped></style>
