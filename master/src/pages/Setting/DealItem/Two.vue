<template>
  <div class="two">
    <el-card class="box-card" v-for="(v, i) in list" :key="i + 'card'">
      <div class="box-card_body">
        <div class="it_text">
          {{ v.minute }}分钟：<span>{{ v.profit }}%</span>
        </div>
        <el-button type="text" @click="editDataFn(v)" class="its_text_btn"
          >修改</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script>
import { getDual, setDual } from "@api/setting";
export default {
  data() {
    return {
      list: [],
    };
  },

  methods: {
    async searchFn() {
      try {
        let res = await getDual();
        this.list = res.data;
      } catch (error) {
        console.log("error", error);
      }
    },
    editDataFn(obj) {
      this.$prompt(`请输入${obj.minute}分钟利润`, "设置", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: obj.profit,
        inputPattern: /^\d*$/,
        inputValidator: (value) => {
          if (value > 100) {
            return "利润必须小于或等于100%";
          }
          return true;
        },
        inputErrorMessage: "只能输入大于0的整数",
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            let value = instance.inputValue;
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "修改中...";
            if (value !== obj.profit) {
              try {
                await setDual({
                  profitId: obj.profitId,
                  minute: obj.minute,
                  profit: value,
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
    },
  },
  created() {
    this.searchFn();
  },
};
</script>

<style lang="less" scoped>
.two {
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
