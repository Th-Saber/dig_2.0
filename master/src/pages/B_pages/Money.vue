<template>
  <!-- vue页面通用模板文件 -->
  <div class="money page_box">
    <el-form
      :model="search"
      status-icon
      :rules="searchRules"
      ref="searchFrom"
      inline
    >
      <el-form-item label="姓名" prop="name">
        <el-input v-model="search.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="user">
        <el-input
          v-model="search.user"
          placeholder="请输入手机号/邮箱"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchSubmit('searchFrom')"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      v-loading="loading"
    >
      <el-table-column label="录件人" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.operator }}</template>
      </el-table-column>
      <el-table-column label="参评单位" width="200">
        <template slot-scope="scope">{{ scope.row.dname }}</template>
      </el-table-column>
      <el-table-column
        label="服务对象姓名"
        align="center"
        width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.nam }}</template>
      </el-table-column>
      <el-table-column label="日期" align="center">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            plain
            @click="examine(scope.row)"
            >查看</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="delUserFn(scope.row.uid)"
            >删除</el-button
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

    <!-- 弹出框详情 -->
    <el-dialog title="弹出框" :visible.sync="showInDialog">
      <div>弹出框内容</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showInDialog = false">取 消</el-button>
        <el-button type="primary" @click="showInDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
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
      loading: false, //加载中
      showInDialog: false, //点击详情弹出框
      search: {
        //查询数据

        name: "",
        user: "",
        time: "",
        page: 1,
        size: 10,
        total: 0,
      },
      searchRules: {
        user: [{ validator: validatePass, trigger: "blur" }],
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = moment().format("YYYY-MM-DD HH:mm:ss");
              const start = moment()
                .subtract(1, "week")
                .format("YYYY-MM-DD 00:00:00");
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = moment().format("YYYY-MM-DD HH:mm:ss");
              const start = moment()
                .subtract(1, "month")
                .format("YYYY-MM-DD 00:00:00");
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = moment().format("YYYY-MM-DD HH:mm:ss");
              const start = moment()
                .subtract(3, "month")
                .format("YYYY-MM-DD 00:00:00");
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
      tableData: [], //表格数据
    };
  },
  methods: {
    // 搜索数据
    async searchFn(refresh) {
      if (refresh) this.search.page = 1;
      let { name, time, page, size } = this.search;
      let params = {
        name,
        time,
        page,
        size,
      };
      for (const key in params) {
        !params[key] && delete params[key];
      }
      this.loading = true;
      setTimeout(() => {
        this.$message({
          type: "success",
          message: "刷新成功",
        });
        this.loading = false;
      }, 2000);
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
    //查看数据
    examine(row) {
      this.showInDialog = true;
    },
    // 删除用户
    delUserFn(uid) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            try {
              this.$message({
                type: "success",
                message: "删除成功!",
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
    //当前页长度
    handleSizeChange(val) {
      this.search.size = val;
      this.searchFn();
    },
    //当前页
    handleCurrentChange(val) {
      this.search.page = val;
      this.searchFn();
    },
    //-------------------------//
    // // 自定义表格索引
    // indexMethod(index) {
    //   let { page, size } = this.search;
    //   let newIndex = index + 1 + (page - 1) * size;
    //   return newIndex;
    // },
    // 刷新数据
    reloadData() {
      this.searchFn();
    },
  },
  created() {
    this.searchFn();
  },
};
</script>

<style lang="less" scoped>
.money {
}
</style>
