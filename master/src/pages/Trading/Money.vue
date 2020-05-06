<template>
  <div class="page_box money">
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
      <el-table-column label="姓名" width="160">
        <template slot-scope="scope">{{ scope.row.named }}</template>
      </el-table-column>

      <el-table-column label="账号状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.state === 0">
            已锁定
          </el-tag>
          <el-tag type="success" v-else>
            正常
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="账号身份" width="140" align="center">
        <template slot-scope="scope">
          <el-tag type="warning" v-if="scope.row.userType === 0">
            普通用户
          </el-tag>
          <el-tag type="primary" v-else-if="scope.row.userType === 1">
            商家
          </el-tag>
          <el-tag type="success" v-else>
            代理商
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="法币余额" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.num }}</template>
      </el-table-column>
      <el-table-column label="币币余额" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.coinNum }}</template>
      </el-table-column>
      <el-table-column label="合约余额" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.contractNum }}</template>
      </el-table-column>
      <el-table-column label="期权余额" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.dualNum }}</template>
      </el-table-column>

      <el-table-column label="操作" width="150" v-if="isAdmin">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="topUp(scope.row.uid, true)"
            >充值</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="topUp(scope.row.uid, false)"
            >提现</el-button
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
    <!-- 充值弹出框 -->
    <el-dialog
      :title="form.method ? '充值' : '提现'"
      width="40%"
      top="30vh"
      @closed="dialogClose('formLog')"
      :visible.sync="visible"
    >
      <el-form :model="form" label-width="80px" :rules="rules" ref="formLog">
        <el-form-item label="账户类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio-button label="FIAT">法币</el-radio-button>
            <el-radio-button label="COIN">币币</el-radio-button>
            <el-radio-button label="CONTRACT">合约</el-radio-button>
            <el-radio-button label="DUAL">期权</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="金额" prop="num">
          <el-input
            v-model="form.num"
            placeholder="请输入金额"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="btnLoad"
          @click="handSubmit('formLog', true)"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { goTopUp, addUSDT, findUSDT } from "@api/api";
import moment from "moment";
export default {
  data() {
    let userdata = JSON.parse(sessionStorage.userdata);
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
      visible: false,
      search: {
        account: "",
        page: 1,
        size: 10,
        total: 20,
      },
      isAdmin: userdata.userType !== 2,
      rules: {
        account: [{ validator: validatePass, trigger: "blur" }],
        type: [
          {
            required: true,
            message: "请选择提币类型",
            trigger: "blur",
          },
        ],
        num: [
          {
            required: true,
            message: "金额不能设置为空",
            trigger: "blur",
          },
          {
            pattern: /^\d*$/,
            message: "只能输入大于0的整数",
            trigger: "change",
          },
        ],
      },
      form: {
        uid: 0,
        method: true, //true 充值  false 提现
        type: "FIAT",
        num: "",
      },
      loading: true,
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
        let res = await findUSDT(params);
        this.tableData = res.data.records;
        this.search.total = res.data.total;
      } catch (error) {
        console.log("error", error);
      } finally {
        this.loading = false;
      }
    },
    dialogClose(formName) {
      this.$refs[formName].resetFields();
    },
    // 充值
    topUp(uid, method) {
      this.form.uid = uid;
      this.form.method = method;
      this.visible = true;
    },
    // 充值提现
    handSubmit(formName, isLog) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (!isLog) {
            this.searchFn(true);
          } else {
            this.btnLoad = true;
            try {
              await addUSDT(this.form);
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
.money {
}
</style>
