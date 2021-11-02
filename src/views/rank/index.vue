<template>
  <div class="rank-wrap container" v-loading="fullscreenLoading">
    <div class="module">
      <h2 class="title flex-row">云音乐特色榜</h2>
      <song-sheet :sheetList="featureList" />
    </div>
    <div class="module">
      <h2 class="title flex-row">全球媒体榜</h2>
      <song-sheet :sheetList="globalList" />
    </div>
  </div>
</template>

<script>
import { getToplist } from "@/api/services/api";
import { computed, onMounted, reactive, toRefs } from "@vue/runtime-core";
import songSheet from "@/components/songSheet/index.vue";
export default {
  setup() {
    const state = reactive({
      ranks: [],
      fullscreenLoading: false,
    });
    const qydgetToplist = async () => {
      try {
        let res = await getToplist();
        if (res.code === 200) {
          state.ranks = res.list;
          console.log("state.ranks", state.ranks);
          state.fullscreenLoading = false;
        }
      } catch (err) {
        console.log(err);
      }
    };
    const featureList = computed(() => {
      return state.ranks.slice(0, 4);
    });
    const globalList = computed(() => {
      return state.ranks.slice(4, state.ranks.length);
    });
    onMounted(() => {
      qydgetToplist();
    });
    return {
      ...toRefs(state),
      featureList,
      globalList,
    };
  },
  components: {
    songSheet,
  },
};
</script>

<style lang="scss" scoped>
.rank-wrap {
  .module {
    .title {
      font-weight: bold;
      position: relative;
      padding-left: 15px;
      margin-bottom: 20px;
      &::before {
        content: "";
        width: 3px;
        height: 20px;
        background: $color-theme;
        position: absolute;
        left: 0;
        top: 2px;
      }
    }
  }
}
</style>