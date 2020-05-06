<template>
  <el-form
    :model="search"
    status-icon
    :rules="searchRules"
    ref="ruleForm"
    inline
  >
    <el-form-item label="账号" prop="account">
      <el-input
        v-model="search.account"
        placeholder="请输入手机号/邮箱"
        autocomplete="off"
        clearable
      ></el-input>
    </el-form-item>

    <el-form-item label="提币状态" v-if="isTrad" prop="state">
      <el-select
        v-model="search.state"
        class="my_select"
        placeholder="请选择"
        @change="searchFn()"
        clearable
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
    <el-form-item label="起始时间" prop="time">
      <el-date-picker
        v-model="search.time"
        type="datetimerange"
        class="my_time"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-ddTHH:mm:ss"
        align="right"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="searchSubmit('ruleForm')"
        >搜索</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import moment from "moment";
export default {
  props: {
    isTrad: {
      type: Boolean,
      value: false,
    },
  },
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
      options: [
        {
          value: 0,
          label: "已驳回",
        },
        {
          value: 1,
          label: "已确认",
        },
        {
          value: 2,
          label: "待审核",
        },
      ],
      search: {
        account: "",
        state: "",
        time: [],
      },
      searchRules: {
        tel: [{ validator: validatePass, trigger: "blur" }],
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = moment().format("YYYY-MM-DDTHH:mm:ss");
              const start = moment()
                .subtract(1, "week")
                .format("YYYY-MM-DDT00:00:00");
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = moment().format("YYYY-MM-DDTHH:mm:ss");
              const start = moment()
                .subtract(1, "month")
                .format("YYYY-MM-DDT00:00:00");
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = moment().format("YYYY-MM-DDTHH:mm:ss");
              const start = moment()
                .subtract(3, "month")
                .format("YYYY-MM-DDT00:00:00");
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
    };
  },
  methods: {
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
    // 是要
    searchFn() {
      this.$emit("search", this.search);
    },
  },
};
</script>

<style></style>
