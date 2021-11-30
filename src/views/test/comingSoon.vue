<template>
  <div>
    <div class="lightBtnWrapper">
      <!-- <lightBtn class="lightBtn" /> -->
      <h2 >界面正在制作中</h2>
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
        color: #1bcebf;
        font-size: 1.875rem;
        font-weight: 700;
        position: fixed;
        top:20vh;
        width:100%;
        text-align: center;        
    }
    position: absolute;
    width: 100%;
    overflow: hidden;
}
</style>