import axios from 'axios'
import {Message} from "element-ui";
import router from "../router";

const url = process.env.API

const service = axios.create({
  timeout:5000,
  baseURL:url
})

//请求拦截器
service.interceptors.request.use(
  config=>{
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

//响应拦截器
service.interceptors.response.use(
  response=>{
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          Message({
            message: "登录已过期",
            type: 'error',
            center: true,
            duration: 1500
          });
          router.replace({
            path: '/',
            query: {redirect: router.currentRoute.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
          });
        case 500:
          Message({
            message: "发生错误",
            type: 'error',
            center: true,
            duration: 1500
          });
          router.replace({
            path: '/',
            query: {redirect: router.currentRoute.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
          })
      }
    }
    return Promise.reject(error)
  }
)

export default service
