<template>
  <!-- vue页面通用模板文件 -->
  <div class="wrapper foot">
    <div class="foot_menu">
      <div class="foot_left">
        <img class="logo" :src="require('@imgs/logo.jpg')" alt="logo" />
      </div>
      <div class="foot_right">
        <div class="foot_item" v-for="(v, i) in footList" :key="i + 'foot'">
          <span @click="jumpRouter(v.path)">
            {{ v.name }}
          </span>
        </div>
      </div>
      <div class="foot_email">
        <!-- 啥大事啊ui收到是对啊是大哈斯u的哈岁的华师大上帝啊上帝啊hi的话深度 -->
        <div class="mail_box" v-for="(v, i) in emailList" :key="i + 'email'">
          <div class="label">{{ v.label }}:</div>
          <div class="content">
            {{ v.email }}
          </div>
        </div>
      </div>
    </div>
    <div class="foot_tip">
      <!-- 邮箱：xxxx@xxxx.com -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      footList: [
        {
          name: "关于我们",
        },
        {
          name: "商务合作",
        },
        {
          name: "商家申请",
        },
        {
          name: "用户服务",
        },
        {
          name: "用户协议",
        },
        {
          name: "隐私协议",
        },
        {
          name: "交易费率",
        },
        {
          name: "法律声明",
        },
      ],
      emailList: [
        {
          label: "商务合作",
          email: "vip@btch.com.cn",
        },
        {
          label: "客户服务",
          email: "btch@btch.com.cn",
        },
        {
          label: "商户申请",
          email: "c2c@btch.com.cn",
        },
      ],
    };
  },
  methods: {
    jumpRouter(path) {
      console.log("数据");
    },
  },
  created() {},
};
</script>

<style lang="less" scoped>
@import url("../../assets/styles/theme.less");
.foot {
  height: 100%;
  .foot_menu {
    height: 86%;
    display: flex;
    .foot_left {
      width: 20%;
      display: flex;
      align-items: center;
      .logo {
        height: 100px;
        width: 100px;
        border-radius: 10px;
      }
    }
    .foot_right {
      flex: 1;
      padding-top: 60px;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      .foot_item {
        margin-bottom: 20px;
        cursor: pointer;
        color: @white;
        &:not(:nth-child(4n)) {
          width: 200px;
        }
      }
    }
    .foot_email {
      width: 240px;
      margin-left: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .mail_box {
        font-size: 16px;
        color: @white;
        text-align: right;
        // display: flex;
        // align-items: flex-start;
        .label {
          //   margin-bottom: 10px;
          color: @info-text;
        }
        .content {
          white-space: normal;
          word-break: break-all;
          margin: 5px 0;
        }
      }
    }
  }
  .foot_tip {
    text-align: center;
    color: @white;
    font-size: 12px;
  }
}
</style>
