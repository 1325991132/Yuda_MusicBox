<template>
  <div>
    <div class="lightBtnWrapper">
      <!-- <lightBtn class="lightBtn" /> -->
      <h2>界面正在制作中</h2>
    </div>
    <Bear style="margin-top: -50px; margin-bottom: -50px" />
  </div>
</template>

<script>
import { defineComponent } from "vue";

import Bear from '@/components/demo/bear/index.vue';
// import lightBtn from '@/components/demo/lightBtn/index.vue';

export default defineComponent({
  components: {
    // lightBtn,
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