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
      <div class="tab flex-row" v-show="state.songs.length>0">
        <h2>搜索结果</h2>
      </div>
      <div class="tab flex-row" :style="{justifyContent:'center',backgroundColor:'#f5f5f5',borderRadius:'10px'}" v-show="!state.songs.length>0">
        <img :style="{width:'50px'}" src="~@/assets/logo/yd.png" alt="">
        <p >暂未找到音源...</p>
      </div>
      <div class="content"  v-if="state.songs.length>0">
        <artist-list :songs="state.songs"></artist-list>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { search, getSongDetail } from "@/api/services/api";
import { createSong } from "@/model/song";
import artistList from "@/components/artistList/index.vue";

export default defineComponent({
  setup() {
    const route = useRoute();
    console.log(route.query.keyword);
    const state = reactive({
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
    const search_key = async (type) => {
      let res = await search(state.keyword, state.limit, state.offset, type);
      if (res.code === 200) {
        switch (type) {
          case 1: {
            let lists = res.result.songs || [];
            let sliceArr = [];
            if (lists.length > 0) {
              lists.forEach((item) => {
                sliceArr.push(item.id);
              });
            }
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
    const my_getSongDetail = async (sliceArr) => {
      try {
        if(sliceArr.length == 0){
          state.songs = []
          return
        }  
        let res = await getSongDetail(sliceArr.join(","), new Date().valueOf());
        state.songs = normalizeSongs(res.songs);
      } catch (e) {
        console.log(e);
      }
    };
    // 格式化所需的歌曲内容
    const normalizeSongs = (list) => {
      let normal_list = [];
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
@import './style/pc.scss';
@import './style/mobile.scss';
</style>