<template>
  <div class="notice" v-loading="loading">
    <div class="mt_head">
      <el-select
        v-model="search.type"
        class="my_select"
        placeholder="请选择"
        @change="searchFn()"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <el-button type="primary" :loading="btnload" @click="handSubmit()"
        >提交</el-button
      >
    </div>
    <Editor :content="form.content" @change="changeHTML" />
  </div>
</template>

<script>
import { findNews, addNews, editNews } from "@api/setting";
import Editor from "@coms/Editor/Editor";
import moment from "moment";
export default {
  components: { Editor },
  data() {
    return {
      loading: false,
      btnload: false,
      search: {
        type: 3,
      },

      isAdd: true, //是否添加
      form: {
        msgId: 0,
        content: "",
      },
      //   权限列表
      options: [
        {
          value: 3,
          label: "关于我们",
        },
        {
          value: 4,
          label: "用户协议",
        },
      ],
    };
  },
  methods: {
    async searchFn() {
      this.loading = true;
      let { type } = this.search;
      try {
        let res = await findNews({ type, page: 1, size: 1 });
        let data = res.data.records[0];
        if (data) {
          this.isAdd = false;
          this.form.content = data.content;
          this.form.msgId = data.msgId;
        } else {
          this.isAdd = true;
          this.form = this.$options.data().form;
        }
      } catch (error) {
        console.log("错误", error);
      } finally {
        this.loading = false;
      }
    },
    changeHTML(html) {
      this.form.content = html;
    },
    async handSubmit() {
      let { content, msgId } = this.form;
      let { type } = this.search;
      let title = type === 3 ? "关于我们" : "用户协议";
      this.btnload = true;
      let param = { type, content, title, msgId };
      try {
        this.isAdd
          ? await addNews({ type, content, title })
          : await editNews(param);
        this.$message({
          type: "success",
          message: "操作成功",
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.btnload = false;
      }
    },
  },
  created() {
    this.searchFn();
  },
};
</script>
<style lang="less" scoped>
.notice {
  .mt_head {
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
