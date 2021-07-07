
<template>
  <div class="banner">
    <swiper class="mySwiper" :options="swiperOption">
      <swiper-slide>Slide 1</swiper-slide><swiper-slide>Slide 2</swiper-slide
      ><swiper-slide>Slide 3</swiper-slide><swiper-slide>Slide 4</swiper-slide
      ><swiper-slide>Slide 5</swiper-slide><swiper-slide>Slide 6</swiper-slide>
    </swiper>
  </div>
</template>
<script lang="ts">
import { UnwrapRef, reactive, computed,Ref,ref } from "vue";
import { getBanner } from "@/api/services/api";
export default {
  setup(props,{emit}) {
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

    // 初始化banner数组
    let banners:any[] = reactive([])
    // 实时获取banner数组长度
    let bannerInit = computed(()=>{
      return banners.length
    })
    // let getbanner = async ()=>{

    // }

    return {
      swiperOption,
      bannerInit
    };
  },
  methods:{
    
  }
};
</script>
<style lang="scss" scoped>
.swiper-container {
  width: 100%;
  height: 100%;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>