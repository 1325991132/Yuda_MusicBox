<template>
  <div >
    <Banner></Banner>
    <RecommendSongs></RecommendSongs>
  </div> 

</template>

<script lang="ts">
import { defineComponent } from "vue";
import Banner from "@/components/home/banner/index.vue";
import RecommendSongs from 'components/home/recommend-songs/index.vue'

export default defineComponent({
  components: {
    Banner,
    RecommendSongs
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
</style>