<template>
  <div class="customer page_box">
    <el-form :model="search" status-icon :rules="rules" ref="ruleForm" inline>
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="search.name"
          clearable
          placeholder="请输入用户名"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="tel">
        <el-input
          v-model="search.tel"
          placeholder="请输入手机号/邮箱"
          autocomplete="off"
          clearable
        ></el-input>
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
      tooltip-effect="dark"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column label="账号" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="isShowTel">
            {{ scope.row.tel || scope.row.mail }}
          </span>
          <span v-else>
            {{ scope.row.mail || scope.row.tel }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="160">
        <template slot-scope="scope">{{ scope.row.named }}</template>
      </el-table-column>
      <el-table-column label="推荐人" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.inviterAccount }}</template>
      </el-table-column>
      <el-table-column label="推荐人姓名" width="160">
        <template slot-scope="scope">{{ scope.row.inviterName }}</template>
      </el-table-column>
      <el-table-column label="推荐码" align="center" width="120">
        <template slot-scope="scope">
          <el-tag type="primary">
            {{ scope.row.markCode }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="注册时间" width="180">
        <template slot-scope="scope">{{ scope.row.regTime | time }}</template>
      </el-table-column>
      <el-table-column label="账号身份" width="160" align="center">
        <template slot-scope="scope">
          <el-radio-group
            v-model="scope.row.userType"
            size="small"
            @change="setUserType(scope.row)"
          >
            <el-radio-button :label="0">普通</el-radio-button>
            <el-radio-button :label="2">代理商</el-radio-button>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120" align="center">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.certReal === 0">
            未提交
          </el-tag>
          <el-tag type="success" v-else-if="scope.row.certReal === 1">
            已认证
          </el-tag>
          <el-tag type="primary" v-else-if="scope.row.certReal === 2">
            待审核
          </el-tag>
          <el-tag type="danger" v-else-if="scope.row.certReal === 3">
            已拒绝
          </el-tag>
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
    <!-- 审核 -->

    <el-dialog title="审核" :visible.sync="visible">
      <el-form :model="form" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="form.named" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input
            v-model="form.idCard"
            disabled
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <div class="card_img">
            <el-image
              :src="v"
              v-for="(v, i) in form.imgArr"
              :key="i + 'card_img'"
              :preview-src-list="form.imgArr"
              class="img_box_a"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline image-slot_icon"></i>
              </div>
            </el-image>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" :loading="btnLoad" @click="cheackUser(false)"
          >驳回</el-button
        >
        <el-button type="primary" :loading="btnLoad" @click="cheackUser(true)"
          >通过</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  findUser,
  setType,
  resetPass,
  lockUser,
  setMarkCode,
  certUser,
  delUser,
} from "@api/b_apis";
import { imgUrl } from "@api/ip";
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
      visible: false,
      isShowTel: true,
      rules: {
        name: [],
        tel: [{ validator: validatePass, trigger: "blur" }],
      },

      search: {
        tel: "",
        name: "",
        mail: "",
        page: 1,
        size: 10,
        total: 20,
      },
      typeAct: 0,
      options: [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "已审核",
        },
        {
          value: 2,
          label: "审核中",
        },
        {
          value: 3,
          label: "审核未通过",
        },
      ],
      tableData: [],
      form: {},
      btnLoad: false,
    };
  },
  created() {
    this.searchFn();
  },
  methods: {
    async searchFn() {
      this.loading = true;
      try {
        let { tel, name, page, size, mail } = this.search;
        let params = {
          tel,
          name,
          mail,
          page,
          size,
        };
        for (const key in params) {
          params[key] || delete params[key];
        }
        let res = await findUser(params);
        this.tableData = res.data.records.map((v) => ({
          ...v,
          state: v.state === 0,
        }));
        this.isShowTel = tel ? true : !mail;
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
          this.searchFn();
        } else {
          return false;
        }
      });
    },
    // 设置用户类型
    async setUserType(obj) {
      try {
        await setType({ uid: obj.uid, type: obj.userType });
        this.$message({
          type: "success",
          message: "设置成功",
        });
      } catch (error) {
        this.searchFn();
        console.log("error", error);
      }
      // 操作成功
    },
    // 重置密码
    resetUser(uid) {
      this.$confirm("此操作将重置该用户登录密码, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            try {
              await resetPass({ uid });
              this.$message({
                type: "success",
                message: "密码重置成功，初始密码为：123456",
              });
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
    // 锁定用户账号
    async clockUser(obj) {
      try {
        await lockUser({ uid: obj.uid, state: obj.state ? 0 : 1 });
        this.$message({
          type: "success",
          message: obj.state ? "锁定成功" : "解除锁定成功",
        });
      } catch (error) {
        console.log("error", error);
      }
      // 操作成功
    },
    // 设置邀请码
    setCodeFn(obj) {
      this.$prompt(`请输入邀请码`, "设置", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: obj.markCode,
        inputPattern: /^[0-9a-zA-Z]{4}$/,
        inputErrorMessage: "邀请码必须是4位数字或字母的组合",
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            let value = instance.inputValue;
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "修改中...";
            if (value !== obj.markCode) {
              try {
                await setMarkCode({
                  uid: obj.uid,
                  markCode: value,
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
    async cheackUser(isOk) {
      if (this.form.certReal === (isOk ? 1 : 3)) {
        this.visible = false;
        return;
      }
      this.btnLoad = true;
      try {
        await certUser({ uid: this.form.uid, isOk });
        this.$message({
          type: "success",
          message: "操作成功",
        });
        this.searchFn();
      } catch (error) {
        console.log("cuo", error);
      } finally {
        this.visible = false;
        this.btnLoad = false;
      }
    },
    // 显示审核弹出框
    showCheck(obj) {
      if (obj.certReal === 0) {
        this.$alert("该用户暂未提交身份信息", "提示", {
          confirmButtonText: "确定",
        });
        return;
      }
      this.form = {
        uid: obj.uid,
        certReal: obj.certReal,
        named: obj.named,
        idCard: obj.idCard,
        imgArr: [
          imgUrl + "files-upload/" + obj.idCardFront,
          imgUrl + "files-upload/" + obj.idCardBack,
        ],
      };

      this.visible = true;
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
              await delUser({ uid });
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
.customer {
}
</style>
