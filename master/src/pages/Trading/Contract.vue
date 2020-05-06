<template>
  <div class=" page_box cont">
    <el-form :model="search" :rules="rules" ref="ruleForm" inline>
      <el-form-item label="账号" prop="tel">
        <el-input
          v-model="search.search"
          placeholder="请输入手机号/邮箱"
          autocomplete="off"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="交易状态" prop="dealStatus">
        <el-select
          v-model="search.dealStatus"
          class="my_select"
          placeholder="请选择"
          clearable
          @change="searchFn()"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起始时间" prop="time">
        <el-date-picker
          v-model="search.time"
          type="datetimerange"
          class="my_time"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-ddTHH:mm:ss"
          align="right"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchSubmit('ruleForm')"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      show-summary
      tooltip-effect="dark"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column label="账号" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.account }}</template>
      </el-table-column>
      <el-table-column label="币类型" width="120">
        <template slot-scope="scope">{{ scope.row.coinType }}</template>
      </el-table-column>
      <el-table-column label="买卖类型" width="80" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.dealType === 1">
            做多
          </el-tag>
          <el-tag type="danger" v-else> 做空 </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="建仓价" width="120">
        <template slot-scope="scope">{{ scope.row.unitPrice }}</template>
      </el-table-column>
      <el-table-column label="建仓时间" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.dealTime | time }}</template>
      </el-table-column>
      <el-table-column label="数量" width="120">
        <template slot-scope="scope">{{ scope.row.num }}</template>
      </el-table-column>
      <el-table-column label="保证金" width="120">
        <template slot-scope="scope">{{ scope.row.margin }}</template>
      </el-table-column>

      <el-table-column label="手续费" prop="tfPrice" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="交易状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.dealStatus === 1">
            持仓中
          </el-tag>
          <el-tag type="warning" v-else-if="scope.row.dealStatus === 2">
            委托中
          </el-tag>
          <el-tag type="success" v-else-if="scope.row.dealStatus === 3">
            已平仓
          </el-tag>
          <el-tag type="danger" v-else-if="scope.row.dealStatus === 4">
            爆仓
          </el-tag>
          <el-tag type="danger" v-else-if="scope.row.dealStatus === 5">
            已撤单
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="平仓价" width="120">
        <template slot-scope="scope">{{ scope.row.closePrice }}</template>
      </el-table-column>
      <el-table-column label="盈亏" width="160" prop="outKui">
      </el-table-column>
      <el-table-column label="平仓时间" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.closeTime | time }}</template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="search.page"
      :page-sizes="[10, 50, 100]"
      :page-size="search.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="search.total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { findContAll } from "@api/trading";
import moment from "moment";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        return callback();
      }
      if (value.indexOf("@") !== -1) {
        let reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
        reg.test(value) ? callback() : callback(new Error("邮箱格式不正确!"));
      } else {
        let reg = /^\d+$/;
        reg.test(value) ? callback() : callback(new Error("手机格式不正确!"));
      }
    };
    return {
      options: [
        {
          value: 1,
          label: "持仓中",
        },
        {
          value: 2,
          label: "委托中",
        },
        {
          value: 3,
          label: "已平仓",
        },
        {
          value: 5,
          label: "已撤单",
        },
      ],
      search: {
        search: "",
        dealStatus: "",
        time: [],
        page: 1,
        size: 10,
        total: 20,
      },
      rules: {
        tel: [{ validator: validatePass, trigger: "blur" }],
      },
      loading: true,
      tableData: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = moment().format("YYYY-MM-DDTHH:mm:ss");
              const start = moment()
                .subtract(1, "week")
                .format("YYYY-MM-DDT00:00:00");
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = moment().format("YYYY-MM-DDTHH:mm:ss");
              const start = moment()
                .subtract(1, "month")
                .format("YYYY-MM-DDT00:00:00");
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = moment().format("YYYY-MM-DDTHH:mm:ss");
              const start = moment()
                .subtract(3, "month")
                .format("YYYY-MM-DDT00:00:00");
              picker.$emit("pick", [start, end]);
            },
          },
        ],
        //禁用未来时间
        disabledDate(time) {
          if (Date.now() <= time) {
            return true;
          }
          return false;
        },
      },
    };
  },
  created() {
    this.searchFn();
  },
  methods: {
    async searchFn(isFlash) {
      if (isFlash) this.search.page = 1;
      this.loading = true;
      try {
        let { search, page, size, dealStatus, time } = this.search;
        let params = {
          start: time && time[0],
          end: time && time[1],
          search,
          dealStatus,
          page,
          size,
        };
        for (const key in params) {
          params[key] || delete params[key];
        }
        let res = await findContAll(params);
        this.tableData = res.data.records.map((v) => ({
          ...v,
          outKui: this.setKui(v),
        }));
        this.search.total = res.data.total;
      } catch (error) {
        console.log("error", error);
      } finally {
        this.loading = false;
      }
    },
    // 提交修改密码
    searchSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.searchFn(true);
        } else {
          return false;
        }
      });
    },
    // 充值
    topUp(obj, method) {
      let str = method ? "充值" : "提现";
      this.$prompt(`请输入${str}USDT数量`, str, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,
        inputValidator: (value) => {
          if (value <= 0) {
            return "输入金额必须大于0";
          }
          if (!method && value > obj.usdtNum) {
            return "输入金额大于可提现金额";
          }
          return true;
        },
        inputErrorMessage: "金额格式不正确",
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            let value = instance.inputValue;
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "操作中...";
            try {
              await addUSDT({ method, uid: obj.uid, num: value });
              this.$message({
                type: "success",
                message: "操作成功",
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
    // 计算盈亏
    setKui(obj) {
      if (!obj.closePrice || !obj.unitPrice) {
        return "";
      }
      let str = (obj.closePrice - obj.unitPrice) * obj.num;
      return str.toFixed(4);
    },
    // 驳回
    handleSizeChange(val) {
      this.search.size = val;
      this.searchFn();
    },
    handleCurrentChange(val) {
      this.search.page = val;
      this.searchFn();
    },
  },
  filters: {
    certReal(str) {
      if (str === 0) {
        return "未实名";
      } else {
        return "已实名";
      }
    },

    time(time) {
      return time ? moment(time).format("YYYY-MM-DD HH:mm:ss") : "";
    },
  },
};
</script>

<style lang="less" scoped>
.cont {
}
</style>
