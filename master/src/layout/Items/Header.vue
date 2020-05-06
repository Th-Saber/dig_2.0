<template>
  <div class="head">
    <div class="user_info">{{ username || "..." }}</div>
    <el-dropdown @command="outLogin">
      <span class="el-dropdown-link">
        <el-avatar shape="square" icon="el-icon-user-solid"></el-avatar>
      </span>
      <el-dropdown-menu slot="dropdown" @click="outLogin">
        <el-dropdown-item command="changePwd">修改密码</el-dropdown-item>
        <el-dropdown-item command="outLogin">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 修改密码弹出框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogFormVisible"
      append-to-body
      width="30%"
      @closed="closeDia"
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="passForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="旧密码" prop="oldpass">
          <el-input
            type="password"
            v-model="ruleForm.oldpass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpass">
          <el-input
            type="password"
            v-model="ruleForm.newpass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpass">
          <el-input
            type="password"
            v-model="ruleForm.checkpass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('passForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('passForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { editPass } from "@api/api";
import moment from "moment";
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.newpass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      title: "慧海前端后台管理系统模板",
      imgUrl: require("@/assets/imgs/logo.png"),
      dialogFormVisible: false, //修改密码弹框
      ruleForm: {
        //修改密码扁担数据
        oldpass: "",
        newpass: "",
        checkpass: "",
      },

      rules: {
        oldpass: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
        newpass: [{ required: true, message: "请输入新密码", trigger: "blur" }],
        checkpass: [
          { required: true, message: "请确认新密码", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 退出登录
    outLogin(command) {
      switch (command) {
        case "changePwd":
          this.dialogFormVisible = true;
          break;
        case "outLogin":
          this.$router.push("/login");
          this.$message({
            type: "success",
            message: "退出登录成功",
          });
          break;
        default:
          break;
      }
    },
    // 提交修改密码
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let { oldpass, newpass } = this.ruleForm;
          if (oldpass === newpass) {
            this.$message({
              type: "warning",
              message: "旧密码与新密码一致，请重新输入！",
            });
            return;
          }

          let params = {
            oldPassword: oldpass,
            password: newpass,
          };
          try {
            await editPass(params);
            this.$message({
              type: "success",
              message: "修改密码成功，请重新登录。",
            });
            sessionStorage.clear();
            this.$router.push("/login");
          } catch (error) {
            console.log("error", error);
          } finally {
            this.dialogFormVisible = false;
          }
        } else {
          return false;
        }
      });
    },
    // 提交重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //关闭弹框
    closeDia() {
      this.resetForm("passForm");
    },
  },
  created() {},
  filters: {
    workname(val) {
      return val ? val : "暂无部门";
    },
  },
  computed: {
    username() {
      let userdata = JSON.parse(sessionStorage.userdata);
      return userdata.username;
    },
  },
};
</script>

<style lang="less" scoped>
.head {
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: 0px 5px 5px -5px #3787e5;
  .user_info {
    margin-right: 20px;
  }
}
</style>
