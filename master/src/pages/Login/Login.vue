<template>
  <div class="login">
    <div class="login_box">
      <!-- 登录标题 -->
      <div class="title">登录</div>
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="80px"
        label-position="right"
      >
        <el-form-item
          label="账号"
          prop="account"
          autocomplete="on"
          :rules="[
            {
              required: true,
              message: '用户名不能为空',
              trigger: 'blur',
            },
            userRule,
          ]"
        >
          <el-input
            v-model="ruleForm.account"
            placeholder="请输入账号或手机号"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="pass"
          :rules="[
            {
              required: true,
              message: '密码不能为空',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            type="password"
            v-model="ruleForm.pass"
            placeholder="请输入密码"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item class="login_btn" label-width="0">
          <el-button
            type="primary"
            :loading="btnLoad"
            @click="submitForm('ruleForm')"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { login } from "@api/api";
export default {
  data() {
    return {
      ruleForm: {
        account: "", //账号
        pass: "", //密码
        code: "", //验证码
        btnLoad: false,
        currentTimes: moment().valueOf(), //验证码时间戳
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.btnLoad = true;
          try {
            let res = await login({
              username: this.ruleForm.account,
              password: this.ruleForm.pass,
            });
            sessionStorage.userdata = JSON.stringify(res.data);
            this.$message({
              type: "success",
              message: "登录成功，欢迎使用后台系统",
            });
            switch (res.data.userType) {
              case 0:
                this.$router.replace("/user");
                break;
              case 2:
                this.$router.replace("/b_customer");
                break;
              default:
                let { authIds } = res.data;
                if (authIds) {
                  if (authIds.indexOf(1) !== -1 || authIds.indexOf(6) !== -1) {
                    this.$router.replace("/user");
                  } else if (authIds.indexOf(4) !== -1) {
                    this.$router.replace("/setDeal");
                  } else if (authIds.indexOf(3) !== -1) {
                    this.$router.replace("/fb");
                  } else if (authIds.indexOf(2) !== -1) {
                    this.$router.replace("/fund");
                  }
                } else {
                  this.$router.replace("/user");
                }
                break;
            }
          } catch (error) {
            console.log("error", error);
          } finally {
            this.btnLoad = false;
          }
        } else {
          return false;
        }
      });
    },
  },
  computed: {
    // 验证规则
    userRule() {
      let rule = /^\d*$/; //只能输入整数
      let flag = rule.test(this.ruleForm.account);
      if (flag) {
        return {
          pattern: /^[1]\d{10}$/,
          message: "请输入正确的手机号码",
          trigger: "blur",
        };
      } else {
        return {};
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  width: 100%;
  background-size: cover;
  background: url("../../assets/imgs/login_bg-min.jpg") no-repeat center;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_box {
    width: 500px;
    // height: 300px;
    border-radius: 6px;
    box-shadow: 0px 0px 5px #000;
    background: rgba(255, 255, 255, 0.1);
    .el-form-item {
      padding-right: 30px;
      .rule_code {
        display: flex;
        .code_input {
          flex: 2;
        }
        .img_code {
          height: 40px;
          flex: 1;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .title {
      text-align: center;
      font-size: 26px;
      padding: 20px 0;
    }
    .login_btn {
      text-align: center;
      padding: 0;
    }
  }
}
</style>
