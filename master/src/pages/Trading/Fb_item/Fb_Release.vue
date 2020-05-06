<template>
  <div class="page_box fb_release">
    <Search @search="headSearchFn" />
    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column label="商家" width="120">
        <template slot-scope="scope">{{ scope.row.named }}</template>
      </el-table-column>
      <el-table-column label="单价" width="160">
        <template slot-scope="scope">{{ scope.row.unitPrice }}</template>
      </el-table-column>
      <el-table-column label="数量" prop="num" align="center" width="120">
      </el-table-column>
      <el-table-column label="总额" align="center">
        <template slot-scope="scope">{{
          scope.row.unitPrice * scope.row.num
        }}</template>
      </el-table-column>
      <el-table-column label="交易限额(USDT)" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.low || 0 }}~{{ scope.row.high || 0 }}
        </template>
      </el-table-column>

      <el-table-column label="支付方式" align="center" width="120">
        <template slot-scope="scope">
          <svg-icon
            className="pay_icon"
            :icon-class="scope.row.platform | showPay"
          />
        </template>
      </el-table-column>
      <el-table-column label="订单类型" align="center" width="120">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.dealType === 1">
            买入
          </el-tag>
          <el-tag type="danger" v-else>
            卖出
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布日期" width="180">
        <template slot-scope="scope">{{ scope.row.joinTime | time }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100" v-if="isAdmin">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="small"
            @click="checkDown(scope.row.fiatId)"
            >下架</el-button
          >
        </template>
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

    <!-- 做单弹出框 -->
  </div>
</template>

<script>
import { findDealFiat, checkDealFiat, downDeal } from "@api/trading";
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
        tel: "",
        time: [],
        dealType: "",
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
      let { page, size, dealStatus, tel, dealType, time } = this.search;
      let params = {
        start: time && time[0],
        end: time && time[1],
        page,
        size,
        dealStatus,
        tel,
        dealType,
      };
      for (const key in params) {
        (params[key] === "" || params[key] === undefined) && delete params[key];
      }
      this.loading = true;
      try {
        let res = await findDealFiat(params);
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
.fb_release {
  height: 100%;
  .pay_icon {
    // font-size: 40px;?
    width: 30px;
    height: 30px;
  }
}
</style>
