<template>
  <div class="banner container">
    <swiper
      v-if="bannersInit"
      :slidesPerView="slidesPerView"
      :spaceBetween="spaceBetween"
      :slidesPerGroup="slidesPerView"
      :loop="true"
      :loopFillGroupWithBlank="true"
      :pagination="{
        clickable: true,
      }"
      :navigation="false"
      class="mySwiper"
    >
      <swiper-slide v-for="item of state.bannerList" :key="item.imageUrl">
        <img :src="item.imageUrl" :alt="item.typeTitle" />
      </swiper-slide>
    </swiper>
    <div class="swiper-pagination"></div>
  </div>
</template>

<script >
import { reactive, computed, onMounted, ref, nextTick } from "vue";
// import { Swiper, SwiperSlide } from "swiper/vue";

import SwiperCore, { Pagination, Navigation } from "swiper";

import "swiper/swiper-bundle.css"; // css 模块

import { getBanner } from "@/api/services/api";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const spaceBetween = ref(30);
    const slidesPerView = ref(3);
    const getUserDevice = computed(() => store.getters.getUserDevice); //获取用户设备

    SwiperCore.use([Pagination, Navigation]);
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
      if (res.length > 9) {
        state.bannerList = res.filter((item, index) => index < 9);
      } else {
        state.bannerList = res;
      }
    };

    const bannersInit = computed(() => {
      return state.bannerList.length;
    });
    getbanner();

    onMounted(() => {
      nextTick(() => {
        if (getUserDevice.value !== "window") {
          spaceBetween.value = 5;
          slidesPerView.value = 1;
        }
      });
    });

    return {
      state,
      bannersInit,
      spaceBetween,
      slidesPerView,
    };
  },
};
</script>
<style lang="scss" scoped>
@import './style/pc.scss';
@import './style/mobile.scss';
</style>