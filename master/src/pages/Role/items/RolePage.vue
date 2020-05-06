<template>
  <!-- vue页面通用模板文件 -->
  <div class="page_box role_page">
    <div class="header_my">
      <el-button type="primary" icon="el-icon-plus" @click="visible = true"
        >添加角色</el-button
      >
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      v-loading="loading"
    >
      <el-table-column label="角色" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.named }}</template>
      </el-table-column>

      <el-table-column label="权限" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{
          scope.row.authNames | authNames
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <!-- <el-button
            type="primary"
            size="small"
            plain
            @click="examine(scope.row)"
            >查看</el-button
          > -->
          <el-button
            type="danger"
            size="small"
            @click="delUserFn(scope.row.roleId)"
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
    <el-dialog
      title="添加角色"
      width="500px"
      top="30vh"
      @closed="dialogClose('formLog')"
      :visible.sync="visible"
    >
      <el-form :model="form" :rules="rules" label-width="80px" ref="formLog">
        <el-form-item label="用户名" prop="named">
          <el-input
            v-model="form.named"
            placeholder="请输入角色名"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色权限" prop="authIds">
          <el-select v-model="form.authIds" multiple placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.authId"
              :label="item.named"
              :value="item.authId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="btnLoad"
          @click="handSubmit('formLog')"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findRole, allRole, findAuth, addRole, delRole } from "@api/role";
import moment from "moment";
export default {
  data() {
    return {
      loading: false, //加载中
      visible: false, //点击详情弹出框
      btnLoad: false, //按钮加载
      search: {
        //查询数据
        page: 1,
        size: 10,
        total: 0,
      },
      //   权限列表
      options: [],
      //   添加用户
      form: {
        named: "",
        authIds: "",
      },
      rules: {
        named: [{ required: true, message: "请输入角色名", trigger: "blur" }],
        authIds: [
          { required: true, message: "请选择角色权限", trigger: "blur" },
        ],
      },
      tableData: [], //表格数据
    };
  },
  methods: {
    // 搜索数据
    async searchFn(refresh) {
      if (refresh) this.search.page = 1;
      let { page, size } = this.search;
      let params = {
        page,
        size,
      };
      for (const key in params) {
        !params[key] && delete params[key];
      }
      this.loading = true;
      try {
        let res = await findRole(params);
        console.log("所有角色", res.data);
        this.tableData = res.data.records;
        this.search.total = res.data.total;
        this.loading = false;
      } catch (error) {
        console.log("e错误", error);
      }
    },
    // 搜索数据
    async searchAuth() {
      try {
        let res = await findAuth();
        this.options = res.data;
      } catch (error) {
        console.log("error", error);
      }
    },
    // 添加用户
    handSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.btnLoad = true;
          try {
            await addRole(this.form);
            this.$message({
              type: "success",
              message: "操作成功",
            });
            this.searchFn();
          } catch (error) {
            console.log("错误", error);
          } finally {
            this.btnLoad = false;
            this.visible = false;
          }
        } else {
          return false;
        }
      });
    },
    // dialog关闭
    dialogClose(formName) {
      this.$refs[formName].resetFields();
    },
    // 删除用户
    delUserFn(roleId) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            try {
              await delRole({ roleId });
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
  },
  created() {
    this.searchFn();
    this.searchAuth();
  },
  filters: {
    authNames(value) {
      return value.join("，");
    },
  },
};
</script>

<style lang="less" scoped>
.role_page {
  .header_my {
    padding-bottom: 20px;
  }
}
</style>
