/* eslint-disable */
import { createRouter, createWebHistory,createWebHashHistory, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条样式
import {routes} from './routes'


const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})


// 判断是否可以通过路由
const canUserAccess = (to: RouteLocationNormalized): boolean => {
  return to ? false : false
}
/**
 * 路由守卫
 */
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  next()
});

router.afterEach(() => {
  NProgress.done()
})


export default router

