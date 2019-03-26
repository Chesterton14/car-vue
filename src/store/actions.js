import * as types from './types'
import { instance, login, getUserInfo } from '../api'

export default {
  toLogin ({ commit }, info) {
    return new Promise((resolve, reject) => {
      login(info).then(res => {
        //console.log(info);
        //console.log(res);
        if (res.status === 200) {
          //console.log(res.data.token);
          commit(types.LOGIN, res.data.token);
          commit(types.LOGINSTATUS, true);
          instance.defaults.headers.common['Authorization'] = `Bearer ` + res.data.token;
          window.localStorage.setItem('token', res.data.token);
          //console.log(window.localStorage.getItem('token'));
          resolve(res)
        }
      }).catch((error) => {
        console.log(error);
        reject(error)
      })
    })
  },
  getUser ({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(res => {
        //console.log(res);
        if (res.status === 200) {
          commit(types.USERINFO, res.data)
          //console.log(types.USERINFO);
        }
      }).catch((error) => {
        reject(error)
      })
    })
  },
  logOut ({ commit }) {
    return new Promise((resolve, reject) => {
      commit(types.USERINFO, null);
      commit(types.LOGINSTATUS, false);
      commit(types.LOGIN, '');
      window.localStorage.removeItem('token')
    })
  }
}
