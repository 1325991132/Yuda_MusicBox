import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueKinesis from "vue-kinesis";
import 'common/styles/base.scss'

import 'ant-design-vue/dist/antd.css';
import Antd from './plugins/Ant'
import swiper from '@/plugins/swiper'
// import Antd from 'ant-design-vue';


createApp(App)
.use(store)
.use(router)
.use(Antd)
.use(VueKinesis)
.use(swiper)
.mount('#app')
