<template>
  <el-tabs v-model="activeName" type="card" class="setDeal">
    <el-tab-pane label="轮播管理" name="carousel" lazy>
      <Carousel />
    </el-tab-pane>
    <el-tab-pane label="新闻公告" name="news" lazy>
      <News />
    </el-tab-pane>
    <el-tab-pane label="关于我们&用户协议" name="notice" lazy>
      <Notice />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Carousel from "./SetItem/Carousel";
import News from "./SetItem/News";
import Notice from "./SetItem/Notice";
export default {
  components: { Carousel, News, Notice },
  data() {
    return {
      activeName: "carousel",
    };
  },
};
</script>

<style lang="less" scoped></style>
