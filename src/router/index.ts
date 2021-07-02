import { createRouter, createWebHistory, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '@/views/login/index.vue';
// const Login = () => import('@/views/login/index.vue')
import UserProfile from '../views/detail/index.vue';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条样式

const routes: Array<RouteRecordRaw> = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404.vue')
  },
  {
    path:'/calc',
    name:'calc',
    component:()=>import('@/views/calc/index.vue')
  },
  {
    path: '/',
    name: 'Home',
    meta: { transition: 'slide-right-enter' },
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    // meta: { transition: 'slide-right-enter' },
    component: Login
  },
  {
    path: '/about',
    name: 'About',
    meta: { transition: 'slide-right-enter' },
    component: () => import('@/views/About.vue')
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('@/views/user/index.vue'),
    children: [
      {
        path: 'detail',
        component: UserProfile
      }
    ],
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
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

