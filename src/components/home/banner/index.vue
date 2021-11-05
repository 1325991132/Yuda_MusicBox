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
  @media only screen and (min-width: 769px) {
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
}
 @media only screen and (max-width: 768px) {
  .banner {
    display: block;
    position: relative;
    height: 9rem;
    width: 100%;
    padding: 0 0.75rem;
    .swiper-container {
      height: 100%;
      border-radius: 10px;
    }
    .swiper-slide {
      height: 100%;
      width: 100%;
      display: flex;
      border-radius: 10px;
      img {
        width: 100%;
        border-radius: 3px;
      }
    }
    ::v-deep(.swiper-pagination-bullet) {
      display: none;
    }

    ::v-deep(.swiper-button-next) {
      display: none;
    }

    ::v-deep(.swiper-button-prev) {
      display: none;
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