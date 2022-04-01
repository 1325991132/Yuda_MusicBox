import Home from '@/views/home/index.vue';
import Login from '@/views/login/index.vue';
import Search from '@/views/search/index.vue';
import error from '@/views/404/index.vue';
import PersonalChart from '@/views/personal/chart.vue'
import Personal from '@/views/personal/index.vue'
// const Login = () => import('@/views/login/index.vue')
import UserProfile from '../views/detail/index.vue';
import Layout from '@/views/layout/index.vue'
import ComingSoon from '@/views/test/comingSoon.vue';


/**
 * 404
 */
export const pageError: any = {
    path: "/:catchAll(.*)",
    name: '404',
    meta: {
        title: '404-您访问的页面不存在',
        transition: 'fade',
        is404:true
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
    },
    {
        path: '/test',
        name: 'test',
        meta: {
            title: '测试',
            isLogin: true,
            transition: 'fade'
        },
        component: PersonalChart
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
                name: 'home',
                meta: {
                    title: '首页',
                    keepAlive: true,
                    transition: 'fade'
                },
                component: Home
            },
            {
                path: '/comingSoon',
                name: 'comingSoon',
                meta: {
                    title: '首页',
                    keepAlive: true,
                    transition: 'fade'
                },
                component: ComingSoon
            },
            {
                path: '/calc',
                name: 'calc',
                meta: {
                    title: 'calc',
                    keepAlive: true,
                    transition: 'fade'
                },
                component: () => import('@/views/calc/index.vue')
            },
            {
                path: '/search',
                name: 'search',
                meta: {
                    title: 'search',
                    keepAlive: true,
                    transition: 'fade'
                },
                component: Search
            },
            {
                path: '/personal',
                name: 'personal',
                meta: {
                    title: 'personal',
                    keepAlive: true,
                    transition: 'fade'
                },
                component: Personal
            },
            {
                path: 'playlist-detail',
                meta: {
                  title: '详情',
                  keepAlive: true
                },
                name: 'playlistDetail',
                component: () => import('@/views/playlist/detail/index.vue')
              },
              {
                path: 'playlist',
                meta: {
                  title: '歌单',
                  keepAlive: true
                },
                name: 'playlist',
                component: () => import('@/views/playlist/index.vue')
              },
              {
                path: 'rank',
                meta: {
                  title: '排行榜',
                  keepAlive: true
                },
                name: 'rank',
                component: () => import('@/views/rank/index.vue')
              },
        ]
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