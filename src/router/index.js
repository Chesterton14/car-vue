import Vue from 'vue'
import Router from 'vue-router'
import Page404 from '../views/404.vue'
import Index from '../views/Layout/Index.vue'
import store from '../store/index'
import {Message} from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(Router)

const router = new Router({
  //mode: 'history',
  routes: [
    {path: '/', name: 'login', component: () => import('../views/Login.vue')},
    {path: '*', name: '404', component: Page404},
    {
      path: '/index',
      name: 'Index',
      redirect: '/index/home',
      meta: {requiresAuth: true},
      component: Index,
      children: [
        {
          path: 'home',
          component: () => import('../views/Home.vue'),
          meta: {requiresAuth: true},
        }
      ]
    },
    {
      path: '/monitor',
      component: Index,
      redirect: '/monitor/realtime',
      name: 'Monitor',
      isSidebar: true,
      meta: {
        title: '监控中心',
        icon: 'icon-coordinates',
        requiresAuth: true,
        role: 'user',
      },
      children: [
        {
          path: '/monitor/realtime',
          component: () => import('../views/Monitor/realtime.vue'), // Parent router-view
          name: 'Realtime',
          meta: {title: '实时监控', requiresAuth: true},
        },
        {
          path: '/monitor/history',
          component: () => import('../views/Monitor/history.vue'),
          name: 'History',
          meta: {title: '历史轨迹', requiresAuth: true}
        }
      ]
    },
    {
      path: '/setting',
      component: Index,
      redirect: '/setting/user',
      name: 'Setting',
      isSidebar: true,
      meta: {
        title: '信息查看',
        icon: 'icon-search',
        role: 'user'
      },
      children: [
        {
          path: '/setting/user',
          component: () => import('../views/Setting/user.vue'),
          name: 'User',
          meta: {title: '个人中心', requiresAuth: true}
        },
        {
          path: '/setting/company',
          component: () => import('../views/Setting/company.vue'),
          name: 'Company',
          meta: {title: '公司信息', requiresAuth: true}
        },
        {
          path: '/setting/car',
          component: () => import('../views/Setting/car.vue'),
          name: 'carMsg',
          meta: {title: '车辆信息', requiresAuth: true}
        },
        {
          path: '/setting/carPoints',
          component: () => import('../views/Setting/carPoints.vue'),
          name: 'carPoints',
          meta: {title: '行驶信息', requiresAuth: true}
        }
      ]
    },
    {
      path: '/manage',
      component: Index,
      name: 'Manage',
      isSidebar: true,
      meta: {
        title: '管理中心',
        icon: 'icon-setup',
        role: 'admin'
      },
      children: [
        {
          path: '/manage/user',
          name: 'U',
          meta: {title: '用户管理', requiresAuth: true},
          component: () => import('../views/Manage/user.vue')
        },
        {
          path: '/manage/com',
          name: 'C',
          meta: {title: '公司管理', requiresAuth: true},
          component: () => import('../views/Manage/com.vue')
        },
        {
          path: '/manage/car',
          name: 'car',
          meta: {title: '车辆管理', requiresAuth: true},
          component: () => import('../views/Manage/car.vue')
        }
      ]
    }
  ]
});
// 注册全局钩子用来拦截导航
router.beforeEach((to, from, next) => {
  let token = window.localStorage.getItem('token');
  NProgress.start()
  //console.log(token);
  if (to.meta.requiresAuth) {
    if (token) {
      store.dispatch('getUser');
      setTimeout(()=>{
        next()
        NProgress.done() // 结束Progress
      },100)
    } else {
      store.dispatch('logOut');
      Message({
        message: "请先登录！",
        type: 'error',
        center: true,
        duration: 1500
      });

      setTimeout(()=>{
        next({
          path: '/',
          /*query: {redirect: to.fullPath}*/
        })
        NProgress.done() // 结束Progress
      },100)
    }
  } else {

    setTimeout(()=>{
      next()
      NProgress.done() // 结束Progress
    },100)
  }
});
router.afterEach(() => {
  setTimeout(()=>{
    NProgress.done() // 结束Progress
  },100)

})
export default router;
