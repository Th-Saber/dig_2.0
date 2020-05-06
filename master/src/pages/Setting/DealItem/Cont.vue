<template>
  <div class="cont">
    <el-card class="box-card" v-for="(v, i) in list" :key="i + 'card'">
      <div class="box-card_body">
        <div class="it_text">
          {{ v.coinType }}：<span>{{ v.contractHandNum }}/手</span><br />
          点差：<span>{{ v.contractDrop || "未设置" }}</span>
        </div>
        <el-button type="text" @click="editDataFn(v)" class="its_text_btn"
          >修改</el-button
        >
      </div>
    </el-card>

    <!-- 审核 -->

    <el-dialog title="设置" width="20%" top="30vh" :visible.sync="visible">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="手数" prop="contractHandNum">
          <el-input
            v-model="form.contractHandNum"
            placeholder="请设置手数"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="点差" prop="contractDrop">
          <el-input
            v-model="form.contractDrop"
            placeholder="请设置点差"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="btnLoad"
          @click="handSubmit('ruleForm')"
          >通过</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getHandNum, setHandNUm } from "@api/setting";
export default {
  data() {
    return {
      visible: false,
      btnLoad: false,
      list: [],
      form: {
        contractHandNum: "",
        contractDrop: "",
      },
      rules: {
        contractHandNum: [
          {
            required: true,
            message: "手数设置不能为空",
            trigger: "blur",
          },
          {
            pattern: /^\d*$/,
            message: "只能输入大于0的整数",
            trigger: "change",
          },
        ],
      },
    };
  },

  methods: {
    async searchFn() {
      try {
        let res = await getHandNum();
        this.list = res.data;
      } catch (error) {
        console.log("error", error);
      }
    },
    // 提交修改密码
    handSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.btnLoad = true;
          try {
            await setHandNUm(this.form);
            this.$message({
              type: "success",
              message: "设置成功",
            });
            this.visible = false;
            this.searchFn();
          } catch (error) {
            console.log("错误", error);
          } finally {
            this.btnLoad = false;
          }
        } else {
          return false;
        }
      });
    },
    editDataFn(obj) {
      this.form = { ...obj };
      this.visible = true;
    },
  },
  created() {
    this.searchFn();
  },
};
</script>

<style lang="less" scoped>
.cont {
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 25%);
  .box-card {
    margin: 10px;
  }
  .box-card_body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      color: #67c23a;
    }
  }
}
</style>
