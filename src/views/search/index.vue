<template>
  <div class="search-wrap">
    <div class="banner">
      <div class="search-inner">
        <div class="search-box flex-row">
          <input
            type="text"
            class="input"
            maxlength="120"
            placeholder="搜索音乐"
            v-model="state.keyword"
            @keyup.enter="search_key(1)"
          />
          <i
            class="iconfont nicesearch-o search-icon"
            @click="search_key(1)"
          ></i>
        </div>
      </div>
    </div>
    <div class="main container">
      <div class="tab flex-row">
        <h2>搜索结果</h2>
      </div>
      <div class="content">
        <artist-list :songs="state.songs"></artist-list>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { search, getSongDetail } from "@/api/services/api";
import  { createSong } from "@/model/song";
import artistList from "@/components/artistList/index.vue";

export default defineComponent({
  setup() {
    const route = useRoute();
    console.log(route.query.keyword);
    const state: any = reactive({
      keyword: "",
      limit: 30,
      offset: 0,
      type: 1,
      songs: [],
    });
    // 判断是否为空
    const isKeyword = computed(() => {
      return state.keyword.split(" ").join("").length == 0;
    });
    // 搜索
    const search_key = async (type: number) => {
      let res = await search(state.keyword, state.limit, state.offset, type);
      if (res.code === 200) {
        switch (type) {
          case 1: {
            let lists: Array<any> = res.result.songs;
            let sliceArr: Array<string> = [];
            lists.forEach((item) => {
              sliceArr.push(item.id);
            });
            my_getSongDetail(sliceArr);
            break;
          }
        }
      }
    };

    onMounted(() => {
      if (route.query.keyword) {
        state.keyword = route.query.keyword;
        search_key(1);
      }
    });
    // 获取歌曲详细
    const my_getSongDetail = async (sliceArr: Array<string>) => {
      try {
        let res = await getSongDetail(sliceArr.join(","), new Date().valueOf());
        state.songs = normalizeSongs(res.songs);
      } catch (e) {
        console.log(e);
      }
    };
    // 格式化所需的歌曲内容
    const normalizeSongs = (list: Array<any>) => {
      let normal_list: Array<any> = [];
      list.forEach((item) => {
        if (item.id) {
          normal_list.push(createSong(item));
        }
      });
      console.log(normal_list);
      return normal_list;
    };
    return {
      isKeyword,
      search_key,
      state,
    };
  },
  components: {
    artistList,
  },
});
</script>

<style lang="scss" scoped>
.search-wrap {
  // margin-top: -1.25rem;
  margin-top: -1.5rem;
  .banner {
    width: 100%;
    height: 15.625rem;
    background: url("@/assets/images/personal.jpg");
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    position: relative;
    .search-inner {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 45rem;
      transform: translate(-50%, -50%);
      .search-box {
        position: relative;
        z-index: 10;
        padding-left: 8px;
        border-radius: 2px;
        background: #f5f5f5;
        input {
          display: inline-block;
          height: 3.375rem;
          line-height: 3.375rem;
          border: none;
          margin-right: 1.5rem;
          padding-left: 0.625rem;
          background-color: #f5f5f5;
          flex: 1;
        }
        .search-icon {
          font-size: 20px;
          padding: 1rem;
          cursor: pointer;
        }
      }
    }
  }
  .main {
    padding-top: 2.6875rem;
    padding-bottom: 2.625rem;
    width: 100%;
    .tab {
      h2 {
        font-size: 22px;
        font-weight: 600;
        line-height: 30px;
        margin-right: 40px;
      }
    }
  }
}
</style>