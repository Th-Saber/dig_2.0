<template>
  <!-- vue页面通用模板文件 -->
  <div class="page_box news">
    <el-form :model="search" status-icon :rules="rules" ref="searchFrom" inline>
      <el-form-item label="类型" prop="type">
        <el-select
          v-model="search.type"
          class="my_select"
          placeholder="请选择"
          @change="searchFn(true)"
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
      <el-form-item>
        <el-button type="primary" @click="handSubmit('searchFrom')"
          >搜索</el-button
        >
        <el-button type="primary" icon="el-icon-plus" @click="showAdd()"
          >新增</el-button
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
      <el-table-column label="标题" align="center" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" width="260">
        <template slot-scope="scope">{{
          scope.row.createTime | time
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            plain
            @click="examine(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click="delUserFn(scope.row.msgId)"
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
      :title="isAdd ? '新增' : '编辑'"
      width="1000px"
      @closed="dialogClose('formLog')"
      :visible.sync="visible"
    >
      <el-form :model="form" :rules="rules" label-width="80px" ref="formLog">
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入标题"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="文本内容" prop="content">
          <Editor :content="form.content" @change="changeHTML"></Editor>
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
import { findNews, addNews, delNews, editNews } from "@api/setting";
import Editor from "@coms/Editor/Editor";
import moment from "moment";
export default {
  components: { Editor },
  data() {
    return {
      loading: false, //加载中
      visible: false, //点击详情弹出框
      btnLoad: false, //按钮加载
      search: {
        //查询数据
        type: 1,
        page: 1,
        size: 10,
        total: 0,
      },
      //   权限列表
      options: [
        {
          value: 1,
          label: "新闻",
        },
        {
          value: 2,
          label: "公告",
        },
      ],
      isAdd: true,
      //   添加用户
      form: {
        msgId: "",
        title: "",
        content: "",
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
      tableData: [], //表格数据
    };
  },
  methods: {
    // 搜索数据
    async searchFn(refresh) {
      if (refresh) this.search.page = 1;
      let { page, size, type } = this.search;
      let params = {
        type,
        page,
        size,
      };
      for (const key in params) {
        !params[key] && delete params[key];
      }
      this.loading = true;
      try {
        let res = await findNews(params);
        this.tableData = res.data.records;
        this.search.total = res.data.total;
        this.loading = false;
      } catch (error) {
        console.log("e错误", error);
      }
    },
    // 修改
    changeHTML(html) {
      this.form.content = html;
    },
    // 添加用户
    handSubmit(formName, isMe) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (!isMe) {
            this.searchFn();
          } else {
            this.btnLoad = true;
            let { title, content } = this.form;
            try {
              this.isAdd
                ? await await addNews({
                    title,
                    content,
                    type: this.search.type,
                  })
                : await editNews({ ...this.form, type: this.search.type });
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
    // 显示添加弹出框
    showAdd() {
      this.isAdd = true;
      this.form = this.$options.data().form;
      this.visible = true;
    },
    // 点击
    examine(obj) {
      this.isAdd = false;
      this.form.msgId = obj.msgId;
      this.form.title = obj.title;
      this.form.content = obj.content;
      this.visible = true;
    },
    // dialog关闭
    dialogClose(formName) {
      this.$refs[formName].resetFields();
    },
    // 删除用户
    delUserFn(msgId) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            try {
              await delNews({ msgId });
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
    time(value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

<style lang="less" scoped>
.news {
  .header_my {
    padding-bottom: 20px;
  }
}
</style>
