<template>
  <div class="page_box bb_up">
    <Search @search="headSearchFn" />
    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      show-summary
      tooltip-effect="dark"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column label="账号" width="200" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.account }}</template>
      </el-table-column>

      <el-table-column label="订单号" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.payId }}</template>
      </el-table-column>
      <el-table-column
        label="充值币数"
        prop="money"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="充值状态" width="160" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.payStatus === 1">
            成功
          </el-tag>
          <el-tag type="danger" v-else-if="scope.row.payStatus === 0">
            失败
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="充值日期" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.createTime | time
        }}</template>
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
import { findDealFiat, checkDealFiat, downDeal, bbTypeUp } from "@api/trading";
import moment from "moment";
import Search from "./Search";
export default {
  components: { Search },
  props: {
    isAdmin: {
      type: Boolean,
      value: false,
    },
  },
  data() {
    return {
      loading: true,
      search: {
        time: [],
        account: "",
        page: 1,
        size: 10,
        total: 0,
      },

      tableData: [],
    };
  },
  created() {
    this.searchFn();
  },
  methods: {
    headSearchFn(obj) {
      this.search = { ...this.search, ...obj };
      this.searchFn(true);
    },
    async searchFn(isFlash) {
      if (isFlash) this.search.page = 1;
      let { page, size, account, time } = this.search;
      let params = {
        start: time && time[0],
        end: time && time[1],
        page,
        size,
        account,
      };
      for (const key in params) {
        (params[key] === "" || params[key] === undefined) && delete params[key];
      }
      this.loading = true;
      try {
        let res = await bbTypeUp(params);
        this.tableData = res.data.records;
        this.search.total = res.data.total;
      } catch (error) {
        console.log("错误", error);
      } finally {
        this.loading = false;
      }
    },
    //
    // 验证通过
    async checkDown(fiatId) {
      try {
        await downDeal({ fiatId });
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.searchFn();
      } catch (error) {
        console.log("error", error);
      }
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
    buyType(type) {
      if (type === 1) {
        return "买入";
      }
      return "卖出";
    },
    payType(type) {
      switch (type) {
        case 0:
          return "银行卡";
        case 1:
          return "支付宝";
        case 2:
          return "paypal";
        default:
          return "";
      }
    },
    time(time) {
      return time ? moment(time).format("YYYY-MM-DD HH:mm:ss") : "";
    },
    showPay(type) {
      switch (type) {
        case 0:
          return "bank";
        case 1:
          return "alipay";
        case 2:
          return "paypal";

        default:
          return "bank";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.bb_up {
  height: 100%;
  .pay_icon {
    // font-size: 40px;?
    width: 30px;
    height: 30px;
  }
}
</style>
