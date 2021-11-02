import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueKinesis from "vue-kinesis";
import 'common/styles/base.scss'
import '@/common/styles/iconfont.css';
import '@/assets/font_heart/iconfont.css';
import 'ant-design-vue/dist/antd.css';
import { loadAllPlugins } from './plugins'

const app = createApp(App)
loadAllPlugins(app)

app
.use(store)
.use(router)
.use(VueKinesis)
.mount('#app')
