<template>
  <div class="all">
    <el-card class="box-card" v-for="(v, i) in list" :key="i + 'card'">
      <div class="box-card_body">
        <div class="it_text">
          {{ v.key | showName }}：<span
            >{{ v.value }}{{ v.key | showSuffix }}</span
          >
        </div>
        <el-button type="text" @click="editDataFn(v)" class="its_text_btn"
          >修改</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script>
import { findSetting, byIdSet } from "@api/setting";
export default {
  data() {
    return {
      search: {},
      list: [],
    };
  },

  methods: {
    async searchFn() {
      try {
        let res = await findSetting();
        this.list = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    // 修改数据
    editDataFn(obj) {
      switch (obj.key) {
        case "CONTRACT_AUTO_CLOSE":
          this.$prompt(`请输入爆仓率`, "设置", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputValue: obj.value,
            inputPattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/,
            inputValidator: (value) => {
              if (value > 100) {
                return "输入爆仓率必须小于或等于100%";
              }
              return true;
            },
            inputErrorMessage: "只能输入大于0的数字，最多两位小数",
            beforeClose: async (action, instance, done) => {
              if (action === "confirm") {
                let value = instance.inputValue;
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "修改中...";
                if (value !== obj.value) {
                  try {
                    await byIdSet({
                      setId: obj.setId,
                      value,
                    });
                    this.$message({
                      type: "success",
                      message: "设置成功",
                    });
                    this.searchFn();
                  } catch (error) {
                    console.log("错误", error);
                  } finally {
                    done();
                    setTimeout(() => {
                      instance.confirmButtonLoading = false;
                    }, 300);
                  }
                } else {
                  done();
                }
              } else {
                done();
              }
            },
          })
            .then(() => {})
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消输入",
              });
            });
          break;
        case "TRANSACTION_FEES":
          this.$prompt(`请输入手续费`, "设置", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputValue: obj.value,
            inputPattern: /^[+-]?\d+\.\d{0,4}$/,
            inputValidator: (value) => {
              if (value > 100) {
                return "输入爆仓率必须小于或等于100%";
              }
              return true;
            },
            inputErrorMessage: "只能输入大于0的数字，最多四位小数",
            beforeClose: async (action, instance, done) => {
              if (action === "confirm") {
                let value = instance.inputValue;
                instance.confirmButtonLoading = true;
                instance.confirmButtonText = "修改中...";
                if (value !== obj.value) {
                  try {
                    await byIdSet({
                      setId: obj.setId,
                      value,
                    });
                    this.$message({
                      type: "success",
                      message: "设置成功",
                    });
                    this.searchFn();
                  } catch (error) {
                    console.log("错误", error);
                  } finally {
                    done();
                    setTimeout(() => {
                      instance.confirmButtonLoading = false;
                    }, 300);
                  }
                } else {
                  done();
                }
              } else {
                done();
              }
            },
          })
            .then(() => {})
            .catch(() => {
              this.$message({
                type: "info",
                message: "取消输入",
              });
            });
          break;

        default:
          break;
      }
    },
  },
  filters: {
    showName(val) {
      switch (val) {
        case "CONTRACT_AUTO_CLOSE":
          return "合约-自动平仓";
        case "TRANSACTION_FEES":
          return "合约-手续费";

        default:
          return "";
      }
    },
    showSuffix(val) {
      switch (val) {
        case "CONTRACT_AUTO_CLOSE":
          return "%";
        default:
          return "";
      }
    },
  },
  created() {
    this.searchFn();
  },
};
</script>

<style lang="less" scoped>
.all {
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
