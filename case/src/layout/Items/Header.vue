<template>
  <div class="head">
    <div class="logo">
      <img :src="require('@imgs/logo.jpg')" alt="logo" />
      <span>币行</span>
    </div>
    <div class="path_coms">
      <div class="path_item" v-for="(v, i) in menuConfig" :key="i + 'path'">
        <span
          @click="jumpRouter(v.path)"
          :class="['path_text', $route.path === v.path && 'path_text_act']"
          >{{ v.name }}</span
        >
      </div>
    </div>
    <div class="btn_group">
      <button type="button" disabled class="btn">
        登录
      </button>
    </div>
  </div>
</template>

<script>
import { menuConfig } from "../../menuConfig";
export default {
  data() {
    return {
      menuConfig,
    };
  },
  methods: {
    jumpRouter(path) {
      if (this.$route.path === path) return;
      //   document.querySelector(".navTab").scrollTop(0);
      this.$router.push(path);
    },
  },
  created() {},
};
</script>

<style lang="less" scoped>
@import url("../../assets/styles/theme.less");
.head {
  height: 100%;
  padding: 0 40px;
  display: flex;
  align-items: center;

  .logo {
    display: flex;
    align-items: center;
    img {
      height: 40px;
      width: 40px;
      border-radius: 8px;
    }
    span {
      font-size: 24px;
      color: @white;
      margin-left: 20px;
    }
  }
  // 首页导航
  .path_coms {
    justify-self: flex-start;
    display: flex;
    .path_item {
      margin-left: 24px;
      text-align: center;
      .path_text {
        font-size: 18px;
        transition: all 0.5s;
        color: @white-deep;
        cursor: pointer;

        &.path_text_act {
          color: @white-primary;
        }
        &:hover {
          color: @white-primary;
        }
      }
    }
  }
  .btn_group {
    flex: 1;
    text-align: right;
  }
}
</style>
