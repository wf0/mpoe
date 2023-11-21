// 需要使用 数组实现文件夹的父级关系 【1，2，3，4】
import { createStore } from "vuex";
export default createStore({
  name: "inedx",
  state: {
    topCreateData: {},
    searchKeyWord: "",
    WebsocketProvider: null,
  },
  mutations: {
    setTopCreateData(state, data) {
      state.topCreateData = data;
    },
    setSearchKeyWord(state, data) {
      state.searchKeyWord = data;
    },

    setWebsocketProvider(state, data) {
      state.WebsocketProvider = data;
    },
  },
  actions: {},
});
