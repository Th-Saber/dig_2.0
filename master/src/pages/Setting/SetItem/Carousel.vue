<template>
  <div class="carousel">
    <div class="header_my">
      <span class="tip">最多添加6张轮播图</span>
      <el-upload
        class="upload-demo"
        ref="upload"
        action="#"
        :disabled="list.length > 5"
        :show-file-list="false"
        :http-request="handUpload"
        :file-list="fileList"
        :auto-upload="true"
      >
        <el-button
          slot="trigger"
          :loading="btnLoad"
          :disabled="list.length > 5"
          icon="el-icon-plus"
          type="primary"
          >添加轮播图</el-button
        >
      </el-upload>
    </div>
    <div class="card_box">
      <el-card class="box-card" v-for="(v, i) in list" :key="i + 'img'">
        <el-image :src="v.uri" :preview-src-list="srcList">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <div class="box_card_body">
          <span>{{ v.createTime | time }}</span>
          <el-button
            type="text"
            @click="delImg(v.carouselId)"
            class="its_text_btn"
            >删除</el-button
          >
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { findCarousel, addCarousel, delCarousel } from "@api/setting";
import { imgUrl } from "@api/ip";
import moment from "moment";
export default {
  data() {
    return {
      content: "",
      btnload: false,
      fileList: [],
      srcList: [],
      list: [],
    };
  },
  methods: {
    async searchFn() {
      try {
        let res = await findCarousel();
        let list = [],
          srcList = [];
        res.data.forEach((v) => {
          let uri = imgUrl + "files-upload/" + v.uri;
          list.push({ ...v, uri });
          srcList.push(uri);
        });
        this.list = list;
        this.srcList = srcList;
      } catch (error) {
        console.log("错误", error);
      }
    },
    async handUpload({ file }) {
      console.log("file", file);
      let formData = new FormData();
      formData.append("file", file);
      try {
        this.btnload = true;
        await addCarousel(formData);
        this.$message({
          type: "success",
          message: "上传成功",
        });
        this.searchFn();
      } catch (error) {
        console.log("失败", error);
      } finally {
        this.btnload = false;
      }
    },
    // 修改
    delImg(carouselId) {
      this.$confirm("此操作将永久删除轮播图, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            try {
              await delCarousel({ carouselId });
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
.carousel {
  height: 100%;
  overflow: auto;
  .card_box {
    display: flex;
    flex-wrap: wrap;
    .el-image {
      width: 320px;
      height: 180px;
    }
    .box-card {
      //   width: 33.3%;
      margin: 20px;
    }
    .box_card_body {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .header_my {
    // padding-bottom: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .tip {
      margin-right: 20px;
      color: #909399;
      font-size: 16px;
    }
  }
}
</style>
