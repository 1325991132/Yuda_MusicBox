import Home from '@/views/home/index.vue';
import Login from '@/views/login/index.vue';
import error from '@/views/404/index.vue';
// const Login = () => import('@/views/login/index.vue')
import UserProfile from '../views/detail/index.vue';
import Layout from '@/views/layout/index.vue'


/**
 * 404
 */
export const pageError: any = {
    path: "/:catchAll(.*)",
    name: '404',
    meta: {
        title: '404-您访问的页面不存在',
        transition: 'fade'
    },
    component: error
}

/**
* 登录注册
*/
export const loginRouter: Array<any> = [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',
            isLogin: true,
            transition: 'fade'
        },
        component: Login
    }
]


export const appRouter: Array<any> = [
    {
        path: '/',
        redirect: {
            name: 'home'
        },
        meta: {
            title: '首页',
            keepAlive: true,
            transition: 'fade'
        },
        component: Layout,
        children: [
            {
                path: 'home',
                meta: {
                    title: '首页',
                    keepAlive: true,
                    transition: 'fade'
                },
                name: 'home',
                component: Home
            }
        ]
    },
    {
        path: '/calc',
        name: 'calc',
        component: () => import('@/views/calc/index.vue')
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

export const routes = [pageError, ...loginRouter, ...appRouter]