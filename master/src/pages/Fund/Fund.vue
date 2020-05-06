<template>
  <div class="page_box fund">
    <el-form :model="search" :rules="rules" ref="ruleForm" inline>
      <el-form-item label="账号" prop="account">
        <el-input
          v-model="search.account"
          placeholder="请输入手机号/邮箱"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handSubmit('ruleForm')"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column label="账号" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.account }}</template>
      </el-table-column>
      <el-table-column label="总余额" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.totalBalance }}</template>
      </el-table-column>
      <el-table-column label="总收支" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.totalProfit }}</template>
      </el-table-column>
      <el-table-column label="合约总盈亏" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.totalProfitContract
        }}</template>
      </el-table-column>
      <el-table-column label="期权总盈亏" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.totalProfitDual }}</template>
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
import { findFund } from "@api/fund";
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
      loading: true,
      search: {
        account: "",
        page: 1,
        size: 10,
        total: 20,
      },
      rules: {
        account: [{ validator: validatePass, trigger: "blur" }],
      },

      tableData: [],
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
        let { account, page, size } = this.search;
        let params = {
          account,
          page,
          size,
        };
        for (const key in params) {
          params[key] || delete params[key];
        }
        let res = await findFund(params);
        this.tableData = res.data.records;
        this.search.total = res.data.total;
      } catch (error) {
        console.log("error", error);
      } finally {
        this.loading = false;
      }
    },

    // 充值提现
    handSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.searchFn(true);
        } else {
          return false;
        }
      });
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
    time(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

<style lang="less" scoped>
.fund {
}
</style>
