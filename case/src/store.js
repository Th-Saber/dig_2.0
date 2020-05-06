// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userdata: ""
  },
  mutations: {
    //同步触发  组件中  this.$store.commit("函数名",{参数名：值})

    // 删除token userdata
    changeLen(state, data) {
      state.userdata = data;
    }
  },
  actions: {
    //异步·触发  组件中  this.$store.dispatch("函数名",{参数名：值})
    setToken(context) {
      context.commit("changeLen");
    }
  }
});
