<template>
  <div style="display: none">
    <Banner></Banner>
  </div> 
  <div class="lightBtnWrapper">
      <h2>占位Demo，具体内容敬请期待</h2>
      <lightBtn class="lightBtn" />
  </div>
  <Bear style="margin-top:-50px;margin-bottom:-50px;"/>

</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import Banner from "@/components/home/banner/index.vue";
import Bear from '@/components/demo/bear/index.vue';
import lightBtn from '@/components/demo/lightBtn/index.vue';

export default defineComponent({
  components: {
    Banner,
    lightBtn,
    Bear
  },
  setup() {
   
    return {};
  },
});
</script>

<style lang="scss" scoped>
.lightBtnWrapper{
    h2{
        color: #1bcebf7a;
        font-size: 30px;
        font-weight: 700;
    }
    position: absolute;
    width: 100%;
}
</style>