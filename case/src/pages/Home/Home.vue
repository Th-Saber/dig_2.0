<template>
  <!-- vue页面通用模板文件 -->
  <div class="home">
    <el-carousel height="680px" arrow="never">
      <el-carousel-item
        v-for="(item, index) in carouselList"
        :key="index + 'slide'"
      >
        <img class="carousel_item" :src="item" alt="轮播" />
      </el-carousel-item>
    </el-carousel>
    <div class="wrapper">
      <el-carousel
        height="80px"
        arrow="never"
        direction="vertical"
        indicator-position="none"
      >
        <el-carousel-item v-for="(v, i) in noticeList" :key="i + 'notice'">
          <div class="home_notice">
            <p class="title">{{ v.title }}</p>
            <span class="time">{{ v.time }}</span>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="list_icon">
      <div class="wrapper list_box">
        <img
          class="icon_item"
          v-for="(v, i) in listIcons"
          :key="i + 'img'"
          :src="v"
          alt="图标"
        />
      </div>
    </div>
    <div class="down_load" />
    <div class="wrapper link_box">
      <div class="link_img" v-for="(v, i) in linkList" :key="i + 'img'">
        <img
          :src="v.img"
          @click="jumpPath(v.url)"
          class="img_link"
          alt="友情链接"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      carouselList: [
        require("@imgs/slider_1.jpg"),
        require("@imgs/slider_1.jpg"),
        require("@imgs/slider_1.jpg"),
      ],
      listIcons: [
        require("@imgs/list_img_1.png"),
        require("@imgs/list_img_2.png"),
        require("@imgs/list_img_3.png"),
      ],
      linkList: [
        {
          img: require("@imgs/link/link_1.svg"),
          url: "https://www.feixiaohao.com",
        },
        {
          img: require("@imgs/link/link_2.svg"),
          url: "https://www.coindesk.com/",
        },
        {
          img: require("@imgs/link/link_3.svg"),
          url: "https://www.jinse.com/",
        },
        {
          img: require("@imgs/link/link_4.svg"),
          url: "http://www.huoxing24.com/",
        },
        {
          img: require("@imgs/link/link_5.png"),
          url: "http://chainb.com/",
        },
        {
          img: require("@imgs/link/link_6.png"),
          url:
            "https://tether.to/?__cf_chl_jschl_tk__=fc1db06a6f43dfc8553d9ab415ac32e73c9c50df-1588143935-0-AR-xmwYfOPTdWQ1sOA9Jf5q4qcVpVVMd8z8fD2E1YWjEdGL7y8zG0l-wvd3r2bhENtjbry0Z6siS6kEOabWAaA1oyOFWDv4QG2NzGMWKDpv404F3t2-7x9gqCRpHmVLWD7xO-YhGLkDo5m3yGOllLrh0ed20n-8eql2ye3CkAs-vsjpGg1-E3cxosyxSaJ6Th0gVKR5v9gNxCCDJb6cSDK2iT6JCmCELc6YqJzJBAcWXX1xGKaPFpHRRYkhhAQEpG1cq-51Vgn4I50UXVlu1SeQ",
        },
        {
          img: require("@imgs/link/link_7.svg"),
          url: "https://bitcoin.org/en/",
        },
        {
          img: require("@imgs/link/link_8.png"),
          url: "https://ethereum.org/",
        },
        {
          img: require("@imgs/link/link_9.svg"),
          url: "https://cn.idgcapital.com/",
        },
        {
          img: require("@imgs/link/link_10.png"),
          url: "https://fenbushi.vc/index_en.html",
        },
        {
          img: require("@imgs/link/link_11.svg"),
          url:
            "https://www.8btc.com/wiki/bitcoin-a-peer-to-peer-electronic-cash-system",
        },
        {
          img: require("@imgs/link/link_12.svg"),
          url: "https://v.youku.com/v_show/id_XNjQ1NTY0NjQ4.html",
        },
      ],
      noticeList: [
        {
          title: "想知道更多币行咨询？请下载币行app了解最新行情。。。",
          time: "2020-04-29 10:00:00",
        },
        {
          title: "想知道更多币行咨询？请下载币行app了解最新行情。。。",
          time: "2020-04-29 10:00:00",
        },
      ],
    };
  },
  methods: {
    jumpPath(url) {
      console.log("url", url);
      window.open(url);
    },
  },
  created() {},
};
</script>

<style lang="less" scoped>
@import url("../../assets/styles/theme.less");
.home {
  .carousel_item {
    height: 100%;
    width: 100%;
  }
  .home_notice {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      color: @main-text;
      font-size: 16px;
    }
    .time {
      color: @info-text;
      font-size: 14px;
    }
  }
  .list_icon {
    height: 800px;
    background: url("../../assets/imgs/banner_bg.png") no-repeat center;
    background-size: cover;
    .list_box {
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .icon_item {
        transition: all 0.5s;
        &:hover {
          transform: scale(1.2);
        }
      }
    }
  }
  // 友情链接
  .link_box {
    display: grid;
    grid-template-columns: repeat(5, 20%);
    align-items: center;
    .link_img {
      padding: 40px;
      //   width: 100%;
      //   height: 80px;
    }
    .img_link {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
}
</style>
