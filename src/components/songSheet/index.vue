<template>
  <div class="list">
    <div
      class="item"
      :class="numClass"
      v-for="item of prop_sheetList"
      :key="item.id"
      @click="toDetail(item)"
    >
      <div class="wrapper">
        <div class="cover">
          <div class="image">
            <el-image
              :key="
                item.coverImgUrl
                  ? item.coverImgUrl + '?param=300y300'
                  : item.picUrl
              "
              :src="
                item.coverImgUrl
                  ? item.coverImgUrl + '?param=300y300'
                  : item.picUrl
              "
              lazy
            >
              <template #placeholder>
                <div class="image-slot flex-center flex-column">
                  <i class="iconfont niceicon-3"></i>
                  加载中<span class="dot">...</span>
                </div>
              </template>
              <template #error>
                <div class="image-slot flex-center">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </template>
            </el-image>
          </div>
          <div class="count">
            <i class="arrow"></i>
            <!-- <span>{{ item.playCount }}</span> -->
          </div>
        </div>
      </div>
      <div class="info">
        <h2 class="name ellipsis-two">
          {{ item.name }}
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/runtime-core";
import { watch, ref } from "vue";
import { useRouter } from "vue-router";

export default {
  props: {
    sheetList: {
      type: Array,
    },
    num: {
      type: Number,
    },
  },
  setup(props) {
    const router = useRouter();
    const prop_sheetList = ref([]);

    watch(
      () => props.sheetList,
      (n) => {
        prop_sheetList.value = n;
        // console.log(prop_sheetList.value);//推荐歌单
      }
    );

    const numClass = computed(() => {
      return props.num == 2 ? "two" : "eight";
    });
    const toDetail = (item) => {
      console.log(item);
      let query = { id: item.id };
      router.push({
        name: "playlistDetail",
        query,
      });
    };
    return {
      toDetail,
      numClass,
      prop_sheetList,
    };
  },
};
</script>

<style lang="scss" scoped>
 @import './style/pc.scss';
 @import './style/mobile.scss';
</style>