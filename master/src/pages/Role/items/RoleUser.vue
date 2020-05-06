<template>
  <!-- vue页面通用模板文件 -->
  <div class="page_box role_user">
    <el-form :model="search" status-icon :rules="rules" ref="searchFrom" inline>
      <el-form-item label="账号" prop="account">
        <el-input
          v-model="search.account"
          placeholder="请输入手机号/邮箱"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handSubmit('searchFrom')"
          >搜索</el-button
        >
        <el-button type="primary" icon="el-icon-plus" @click="showAdd()"
          >添加用户</el-button
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
      <el-table-column label="账号" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.username }}</template>
      </el-table-column>
      <el-table-column label="角色名" width="160">
        <template slot-scope="scope">{{ scope.row.named }}</template>
      </el-table-column>
      <el-table-column label="创建日期" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.joinTime | time }}</template>
      </el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            :disabled="scope.row.roleId === 2"
            @click="cutUser(scope.row)"
            >切换角色</el-button
          >
          <el-button
            type="warning"
            size="small"
            @click="examine(scope.row.adminId)"
            >重置密码</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="delUserFn(scope.row.adminId)"
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
      :title="isCut ? '切换用户' : '添加用户'"
      width="500px"
      top="30vh"
      @closed="dialogClose('formLog')"
      :visible.sync="visible"
    >
      <el-form :model="form" label-width="80px" :rules="rules" ref="formLog">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="form.username"
            :disabled="isCut"
            placeholder="请输入手机号/邮箱"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色类型" prop="roleId">
          <el-select
            v-loading="selectLoad"
            v-model="form.roleId"
            placeholder="请选择"
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
        <el-form-item label="初始密码">
          <el-input value="123456" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="btnLoad"
          @click="handSubmit('formLog', true)"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  findAdmin,
  addUser,
  findRole,
  delAdmin,
  resetUserPass,
  cutAdmin,
} from "@api/role";
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
      visible: false, //点击详情弹出框
      btnLoad: false, //按钮加载
      selectLoad: false, //log框 select加载按钮
      search: {
        //查询数据
        account: "",
        page: 1,
        size: 10,
        total: 0,
      },
      options: [],
      //   添加用户
      isCut: false, //切换用户
      form: {
        adminId: "",
        username: "",
        roleId: "",
      },
      rules: {
        account: [{ validator: validatePass, trigger: "blur" }],
        username: [
          { required: true, message: "请输入手机号/邮箱", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
        ],
        roleId: [
          { required: true, message: "请选择角色类型", trigger: "blur" },
        ],
      },
      tableData: [], //表格数据
    };
  },
  methods: {
    // 搜索数据
    async searchFn(refresh) {
      if (refresh) this.search.page = 1;
      let { account, time, page, size } = this.search;
      let params = {
        username: account,
        time,
        page,
        size,
      };
      for (const key in params) {
        !params[key] && delete params[key];
      }
      this.loading = true;
      try {
        let res = await findAdmin(params);
        this.tableData = res.data.records;
        this.search.total = res.data.total;
        this.loading = false;
      } catch (error) {
        console.log("e错误", error);
      }
    },
    // 搜索数据
    async searchRole() {
      try {
        this.selectLoad = true;
        let res = await findRole({ page: 1, size: 30 });
        let arr = [];
        res.data.records.forEach((v) => {
          if (v.roleId !== 2) {
            arr.push({
              value: v.roleId,
              label: v.named,
            });
          }
        });
        this.options = arr;
      } catch (error) {
        console.log("error", error);
      } finally {
        this.selectLoad = false;
      }
    },
    // 添加用户
    handSubmit(formName, isLog) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (!isLog) {
            this.searchFn(true);
          } else {
            this.btnLoad = true;
            let { adminId, username, roleId } = this.form;
            try {
              this.isCut
                ? await cutAdmin({ adminId, roleId })
                : await addUser({ username, roleId });
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
          }
        } else {
          return false;
        }
      });
    },
    // 显示添加模态框
    showAdd() {
      this.searchRole();
      this.isCut = false;
      this.visible = true;
    },
    // 显示切换模态框
    cutUser(row) {
      this.form.adminId = row.adminId;
      this.form.username = row.username;
      this.form.roleId = row.roleId;
      this.searchRole();
      this.isCut = true;
      this.visible = true;
    },
    // dialog关闭
    dialogClose(formName) {
      this.$refs[formName].resetFields();
    },
    // 重置密码
    examine(adminId) {
      this.$confirm("此操作将重置该用户密码, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            try {
              await resetUserPass({ adminId });
              this.$message({
                type: "success",
                message: "重置成功!",
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
            message: "已取消操作",
          });
        });
    },
    // 删除用户
    delUserFn(adminId) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            try {
              await delAdmin({ adminId });
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
  },
  filters: {
    time(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

<style lang="less" scoped>
.role_user {
}
</style>
