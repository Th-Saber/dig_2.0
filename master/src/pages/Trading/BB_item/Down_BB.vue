<template>
  <div class="page_box down_BB">
    <Search @search="headSearchFn" />
    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column label="账号" width="200">
        <template slot-scope="scope">{{ scope.row.account }}</template>
      </el-table-column>
      <el-table-column label="可提数量" width="160">
        <template slot-scope="scope">{{ scope.row.totalNum }}</template>
      </el-table-column>
      <el-table-column label="提币地址类型" width="160">
        <template slot-scope="scope">{{ scope.row.coinName }}</template>
      </el-table-column>
      <el-table-column label="提币地址" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.address }}</template>
      </el-table-column>

      <!-- <el-table-column label="提币状态" align="center" width="120">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.state === 1">
            已确认
          </el-tag>
          <el-tag type="primary" v-if="scope.row.state === 2">
            审核中
          </el-tag>
          <el-tag type="danger" v-if="scope.row.state === 0">
            已驳回
          </el-tag>
        </template>
      </el-table-column>
     -->
      <el-table-column label="操作" width="160" v-if="isAdmin">
        <template slot-scope="scope">
          <!-- <div v-if="scope.row.state === 2"> -->
          <el-button type="primary" size="small" @click="checkDown(scope.row)"
            >全部提取</el-button
          >
          <!-- <el-button
              type="danger"
              size="small"
              @click="checkDown(scope.row.withdrawId, false)"
              >驳回</el-button
            > -->
          <!-- </div>
          <el-button v-else type="primary" size="small" disabled
            >已操作</el-button
          > -->
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
import { onTiInfo, pullTi } from "@api/trading";
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
        account: "",
        state: "",
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
      let { page, size, account, state, time } = this.search;
      let params = {
        start: time && time[0],
        end: time && time[1],
        page,
        size,
        account,
        state,
      };
      for (const key in params) {
        (params[key] === "" || params[key] === undefined) && delete params[key];
      }
      this.loading = true;
      try {
        let res = await onTiInfo(params);
        this.tableData = res.data.records;
        this.search.total = res.data.total;
      } catch (error) {
        console.log("错误", error);
      } finally {
        this.loading = false;
      }
    },
    // 验证通过
    checkDown(obj, isOk) {
      this.$confirm(`该操作将提取所有可提现币, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            try {
              await pullTi({ uid: obj.uid, coinName: obj.coinName });
              this.$message({
                type: "success",
                message: "操作成功!",
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
            message: "已取消删除",
          });
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
      return time ? moment(time).format("YYYY-MM-DD HH:mm:ss") : "";
    },
  },
};
</script>

<style lang="less" scoped>
.down_BB {
  height: 100%;
  .pay_icon {
    width: 30px;
    height: 30px;
  }
}
</style>
