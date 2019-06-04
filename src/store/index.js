import Vue from 'vue'
import Vuex from 'vuex'
import 'babel-polyfill'
import actions from './actions.js'
import * as types from "./types";

Vue.use(Vuex)

const state = {
  token: window.localStorage.getItem('token'),
  userInfo: {},
  loginStatus: false
};

const mutations ={
  [types.LOGIN]: (state, value) => {
    state.token = value
  },
  [types.USERINFO]: (state, info) => {
    state.userInfo = info
  },
  [types.LOGINSTATUS]: (state, bool) => {
    state.loginStatus = bool
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
