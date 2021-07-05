/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'swiper/vue' {
  import _Vue from 'vue'
  export class Swiper extends _Vue { }
  export class SwiperSlide extends _Vue { }
}

