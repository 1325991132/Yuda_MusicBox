<template>
  <div class="artist-box">
    <div class="tool-head">
      <div class="item play-item" @click="playAllSong">
        <i class="iconfont niceOutlined_Play"></i>播放全部
      </div>
    </div>
    <table class="artist-table">
      <thead>
        <tr>
          <th class="th-index" >序号</th>
          <th class="th-name">歌曲</th>
          <th class="th-artist">歌手</th>
          <th class="th-album" v-if="getUserDevice==='window'">专辑</th>
          <th class="th-duration" v-if="getUserDevice==='window'">时长</th>
          <th class="th-info" >选项</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in songs"
          :key="index"
          :class="currentSong.id == item.id && playing ? 'playing' : ''"
          @click="playSong(item,index)"
        >
          <td>
            <div class="index-container flex-center">
              <span class="num">{{ utils.formatZero(index + 1, 2) }}</span>
              <div class="play-icon">
                <div class="line" style="animation-delay: -1.2s"></div>
                <div class="line" style="animation-delay: -1s"></div>
                <div class="line" style="animation-delay: -1.5s"></div>
                <div class="line" style="animation-delay: -0.9s"></div>
                <div class="line" style="animation-delay: -0.6s"></div>
              </div>
              <i
                class="iconfont nicebofang2 play-btn" 
                @click.stop="playSong(item, index)"
              ></i>
              <i
                class="iconfont nicezanting1 pause-btn"
                @click="pauseSong(item, index)"
              ></i>
            </div>
          </td>
          <td>
            <div class="name-container">
              <div class="avatar" v-if="getUserDevice==='window'">
                <el-image
                  :key="item.image + '?param=100y100'"
                  :src="item.image + '?param=100y100'"
                  lazy
                  ><template #error>
                    <div class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </template>
                </el-image>
              </div>
              <p class="name ellipsis" :title="item.name">{{ item.name }}</p>
            </div>
          </td>
          <td>
            <div class="artist-container">
              <p class="author ellipsis" :title="item.singer">
                {{ item.singer }}
              </p>
            </div>
          </td>
          <td v-if="getUserDevice==='window'"> 
            <div class="album-container" > 
              <p :title="item.album" class="ellipsis">{{ item.album }}</p>
            </div>
          </td>
          <td  v-if="getUserDevice==='window'">
            <div class="duration-container">
              <p>{{ utils.formatSecondTime(item.duration) }}</p>
            </div>
          </td>
          <td >
            <div class="info-container">
              <div class="song-tools">
                <i
                  class="iconfont icon-heart"
                  @click.stop="likeThisSong(item.id, true)"
                  v-if="likeSongsList.indexOf(item.id) == -1"
                  title="您暂未喜欢此音乐"
                ></i>
                <i
                  class="iconfont icon-heart1"
                  @click.stop="likeThisSong(item.id, false)"
                  v-else
                  title="您喜欢了此音乐"
                ></i>
                <!-- <i
                  class="el-icon-download"
                  style="margin-left: 5px"
                  title="下载"
                ></i> -->
                <!-- <i class="iconfont niceicon-heart" title="喜欢"></i> -->
                <!-- <i class="iconfont nicedot" title="更多"></i> -->
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { defineComponent, toRaw, computed } from "vue";
import { useStore } from "vuex";
import utils from "@/utils/index.js";
import { likeSong } from "@/api/services/api";
import { getLikeList } from "@/api/services/user";

export default defineComponent({
  props: {
    songs: {
      type: Array,
    },
  },
  setup(props) {
    const store = useStore();
    const likeSongsList = computed(() => store.getters.likeSongsList); //获取喜欢列表
    const getUserDevice = computed(() => store.getters.getUserDevice); //获取用户设备
    console.log("likeSongsList", likeSongsList);
    const playSong = (item, index) => {
      store.dispatch("selectPlay", { list: toRaw(props.songs), index });
    };
    const playAllSong = () => {
      store.dispatch("playAll", { list: toRaw(props.songs) });
    };
    // 停止播放歌曲
    const pauseSong = () => {
      store.dispatch("pausePlay");
    };

    // 获取喜欢列表
    const qydgetUserLike = async (id) => {
      try {
        let res = await getLikeList(id);
        if (res.code !== 200) return;
        store.commit("SET_LIKE_SONGS", res.ids);
      } catch (err) {
        console.log(err);
      }
    };

    // 喜欢这首歌
    const likeThisSong = async (id, like) => {
      console.log(id, like);
      const res = await likeSong(id, like);
      console.log(res);
      qydgetUserLike(id);
    };

    return {
      playSong,
      pauseSong,
      playAllSong,
      currentSong: computed(() => store.getters.currentSong),
      playing: computed(() => store.getters.playing),
      utils,
      likeThisSong,
      likeSongsList, //喜欢列表id
      getUserDevice, //用户设备
    };
  },
});
</script>

<style lang="scss" scoped>
$color-theme: red;
@import './style/pc.scss';
@import './style/mobile.scss'
</style>