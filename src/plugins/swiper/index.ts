import { App } from 'vue'

// swiper 额外组件配置
import SwiperCore, { Pagination } from 'swiper'

// swiper 单独样式 （less / scss）
import 'swiper/swiper.less'
import 'swiper/components/pagination/pagination.less'

// swiper 必备组件
import { Swiper, SwiperSlide } from 'swiper/vue'

// 使用额外组件
SwiperCore.use([Pagination])

// 全局注册 swiper 必备组件
const plugins = [Swiper, SwiperSlide]

const swiper = {
  install: function (app: App<Element>) {
    plugins.forEach(item => {
      app.component(item.name, item)
    })
  }
}

export default swiper

