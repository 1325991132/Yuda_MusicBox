
<template>
  <div class="banner">
    <swiper
      class="swiper"
      :slides-per-view="swiperOption.slidesPerView"
      :space-between="swiperOption.spaceBetween"
      :slides-per-group="swiperOption.slidesPerGroup"
      :loop="swiperOption.loop"
      :loop-fill-group-with-blank="swiperOption.loopFillGroupWithBlank"
      :centered-slides="swiperOption.centeredSlides"
      :pagination-clickable="swiperOption.paginationClickable"
      :grab-cursor="swiperOption.grabCursor"
    >
      <swiper-slide
        v-for="(banner, bannerIdx) in state.bannerList"
        :key="bannerIdx"
      >
        <div class="img_wapper">
          <img :src="banner.imageUrl" alt="" />
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script lang="ts">
import {
  UnwrapRef,
  reactive,
  computed,
  Ref,
  ref,
  onMounted,
  nextTick,
} from "vue";
import { getBanner } from "@/api/services/api";
export default {
  setup(props, { emit }) {
    interface swiperObj {
      slidesPerView: number;
      spaceBetween: number;
      slidesPerGroup: number;
      loop: boolean;
      loopFillGroupWithBlank: boolean;
      centeredSlides: boolean;
      paginationClickable: boolean;
      grabCursor: boolean;
      pagination: string;
    }
    const swiperOption: UnwrapRef<swiperObj> = reactive({
      slidesPerView: 3,
      spaceBetween: 30,
      slidesPerGroup: 3,
      loop: true,
      loopFillGroupWithBlank: true,
      centeredSlides: true,
      paginationClickable: true,
      grabCursor: true,
      pagination: ".swiper-pagination",
    });

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

    getbanner();

    return {
      swiperOption,
      state,
    };
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.banner >>> .swiper-pagination {
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
      // background: $color-theme;
    }
  }
}
.banner {
  display: none;
  position: relative;
  height: 200px;
  width: 100%;
  padding: 0 20px;
  .img_wapper {
    width: 100%;
    border: solid 1px red;

    img {
      width: auto;
      border-radius: 3px;
    }
  }
}
</style>