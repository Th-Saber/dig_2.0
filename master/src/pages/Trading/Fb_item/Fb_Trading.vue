<template>
  <div class="page_box fb_trading">
    <Search @search="headSearchFn" isTrad />
    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      show-summary
      tooltip-effect="dark"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column label="姓名" width="120">
        <template slot-scope="scope">{{ scope.row.buyNamed }}</template>
      </el-table-column>
      <el-table-column label="商家" width="120">
        <template slot-scope="scope">{{ scope.row.sellNamed }}</template>
      </el-table-column>
      <el-table-column label="单价" width="160">
        <template slot-scope="scope">{{ scope.row.unitPrice }}</template>
      </el-table-column>
      <el-table-column label="数量" prop="num" align="center" width="120">
      </el-table-column>
      <el-table-column label="总额" prop="allPrice" align="center">
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
      <el-table-column label="交易状态" align="center" width="120">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.dealStatus === 0">
            取消
          </el-tag>
          <el-tag type="success" v-if="scope.row.dealStatus === 1">
            确认
          </el-tag>
          <el-tag type="primary" v-if="scope.row.dealStatus === 2">
            待确认
          </el-tag>
          <el-tag type="warning" v-if="scope.row.dealStatus === 5">
            撤销
          </el-tag>
          <el-tag type="primary" v-if="scope.row.dealStatus === 6">
            确认中
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="交易日期" width="180">
        <template slot-scope="scope">{{ scope.row.buyTime | time }}</template>
      </el-table-column>
      <el-table-column label="操作" width="160" v-if="isAdmin">
        <template slot-scope="scope">
          <div v-if="scope.row.dealStatus === 2">
            <el-button
              type="primary"
              size="small"
              @click="checkDown(scope.row.fiatLogId, true)"
              >审核</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="checkDown(scope.row.fiatLogId, false)"
              >撤销</el-button
            >
          </div>
          <el-button
            v-else-if="scope.row.dealStatus === 6"
            type="warning"
            size="small"
            disabled
            >用户未确认</el-button
          >
          <el-button v-else type="primary" size="small" disabled
            >已操作</el-button
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
import { findTradFiat, checkDealFiat, downDeal } from "@api/trading";
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
        dealType: "",
        time: [],
        dealStatus: "",
        tel: "",
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
      let { page, size, tel, dealType, dealStatus, time } = this.search;
      let params = {
        start: time && time[0],
        end: time && time[1],
        page,
        size,
        tel,
        dealStatus,
        dealType,
      };
      for (const key in params) {
        (params[key] === "" || params[key] === undefined) && delete params[key];
      }
      this.loading = true;
      try {
        let res = await findTradFiat(params);
        this.tableData = res.data.records.map((v) => ({
          ...v.dealFiatLogVo,
          unitPrice: v.unitPrice,
          dealType: v.dealType,
          platform: v.platform,
          allPrice: v.unitPrice * v.num,
        }));
        this.search.total = res.data.total;
      } catch (error) {
        console.log("错误", error);
      } finally {
        this.loading = false;
      }
    },
    // 验证通过
    async checkDown(fiatLogId, isOk) {
      try {
        await checkDealFiat({ fiatLogId, isOk });
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
.fb_trading {
  height: 100%;
  .pay_icon {
    width: 30px;
    height: 30px;
  }
}
</style>
