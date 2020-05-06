<template>
  <div class="kui-error-page">
    <template v-if="error.statusCode === 403">
      <img class="error-image" src="../assets/images/error403.svg" />
      <div class="error-content">
        <h1 class="title">403</h1>
        <div class="desc">抱歉，你无权访问该页面</div>
        <div class="button">
          <Button class="btn" type="primary" @click="backHome">返回首页</Button>
          <Button class="btn" type="primary" @click="backPrev">返回上级</Button>
        </div>
      </div>
    </template>
    <template v-if="error.statusCode === 404">
      <img class="error-image" src="../assets/images/error404.svg" />
      <div class="error-content">
        <h1 class="title">404</h1>
        <div class="desc">抱歉，你访问的页面不存在</div>
        <div class="button">
          <Button class="btn" type="primary" @click="backHome">返回首页</Button>
          <Button class="btn" type="primary" @click="backPrev">返回上级</Button>
        </div>
      </div>
    </template>
    <template v-if="error.statusCode === 500">
      <img class="error-image" src="../assets/images/error500.svg" />
      <div class="error-content">
        <h1 class="title">500</h1>
        <div class="desc">抱歉，服务器出错了</div>
        <div class="button">
          <Button class="btn" type="primary" @click="backHome">返回首页</Button>
          <Button class="btn" type="primary" @click="backPrev">返回上级</Button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    // props: ['error'],
    data(){
        return{
            error:{
                statusCode:404
            }
        }
    },
    methods: {
      backHome() {
        this.$router.replace('/')
      },
      backPrev() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="less">
  .kui-error-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 500px;
    height: 80%;
    .error-image {
      flex: 0 0 360px;
      max-width: 360px;
    }
    .error-content {
      flex: 0 0 auto;
      padding: 0 48px;
      .title {
        color: #434e59;
        font-size: 68px;
        font-weight: 500;
      }
      .desc {
        color: #434e59;
        font-size: 18px;
      }
      .button {
        margin-top: 24px;
        .btn+.btn {
          margin-left: 24px;
        }
      }
    }
  }
</style>

