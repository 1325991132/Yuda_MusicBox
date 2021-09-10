<template>
  <div class="banner container">
    <swiper
      v-if="bannersInit"
      :slidesPerView="3"
      :spaceBetween="30"
      :slidesPerGroup="3"
      :loop="true"
      :loopFillGroupWithBlank="true"
      :pagination="{
        clickable: true,
      }"
      :navigation="true"
      class="mySwiper"
    >
      <swiper-slide v-for="item of state.bannerList" :key="item.imageUrl">
        <img :src="item.imageUrl" :alt="item.typeTitle" />
      </swiper-slide>
    </swiper>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script lang="ts">
import {reactive,computed} from 'vue'
import { Swiper, SwiperSlide } from "swiper/vue";

import SwiperCore, {
  Pagination,Navigation
} from 'swiper';

import "swiper/swiper-bundle.css"; // css 模块

import { getBanner } from "@/api/services/api";
export default {
  setup(): any {
    SwiperCore.use([Pagination,Navigation]);
    const state = reactive({
      bannerList: [], // 轮播图列表
      bannerInit: computed(() => {
        return state.bannerList.length;
      }),
      isLogin: false, // 是否已登录
      loading: true,
    });

    let getbanner = async () => {
      let { banners: res } = await getBanner();
      state.bannerList = res;
    };

    const bannersInit = computed(() => {
      return state.bannerList.length;
    });
    getbanner();

    return {
      state,
      bannersInit,
    };
  },
};
</script>
<style lang="scss" scoped>
.banner {
  display: block;
  position: relative;
  height: 11.5rem;
  width: 100%;
  padding: 0 1.25rem;
  .swiper-container {
    height: 100%;
  }
  .swiper-slide {
    height: 100%;
    img {
      height: 100%;
      border-radius: 3px;
    }
  }
}
.swiper-pagination {
  width: 100%;
  bottom: -20px;
  .swiper-pagination-bullet {
    width: 6px;
    height: 6px;
    background: #a3a3ac;
    opacity: 0.8;
    border-radius: 50%;
    margin: 0 5px;
    &.swiper-pagination-bullet-active {
      opacity: 1;
      width: 15px;
      border-radius: 4px;
      background: $color-theme;
    }
  }
}



</style>