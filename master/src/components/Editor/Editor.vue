<template>
  <quill-editor
    v-model="content"
    ref="myQuillEditor"
    :options="editorOption"
    @change="onEditorChange($event)"
    style="height: 500px; padding-bottom: 50px"
  >
  </quill-editor>
</template>

<script>
import { quillEditor } from "vue-quill-editor"; // 调用富文本编辑器
import "quill/dist/quill.snow.css"; // 富文本编辑器外部引用样式  三种样式三选一引入即可
// import "quill/dist/quill.core.css";

// import "quill/dist/quill.bubble.css";
import * as Quill from "quill"; // 富文本基于quill
import Video from "./video"; // 插入h5 video视频
Quill.register(Video, true); // 注册video
export default {
  components: { quillEditor },
  props: {
    content: "",
  },
  data() {
    return {
      editorOption: {
        theme: "snow",
        placeholder: "请输入正文",
      },
    };
  },
  methods: {
    // 富文本编辑器 内容改变事件
    onEditorChange(editor) {
      this.$emit("change", editor.html);
    },
  },
  mounted() {
    this.editor = this.$refs.myQuillEditor.quill;
  },
  beforeDestroy() {
    this.editor = null;
    delete this.editor;
  },
};
</script>

<style></style>
