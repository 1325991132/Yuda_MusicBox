<template>
  <transition name="fade">
    <div class="player-bar shadow flex-row" v-show="playList.length">
      <!-- <span>{{ currentSong }}</span> -->
      <div class="avatar">
        <img :src="currentSong && currentSong.image" alt="nicemusic" />
      </div>
      <div class="info">
        <h2 class="ellipsis">{{ currentSong.name }}</h2>
        <p class="ellipsis">{{ currentSong.singer }}</p>
      </div>
      <div class="player-btn">
        <i class="iconfont icon-prev niceshangyishou" @click="prevSong"></i>
        <i
          class="iconfont icon-play nicebofang2"
          :class="playIcon"
          @click="togglePlaying"
        ></i>
        <i class="iconfont icon-next nicexiayishou" @click="nextSong"></i>
      </div>
      <div class="process-wrap" ref="process-wrap">
        <p class="current-time">{{ formatTime(state.currentTime) }}</p>
        <process-bar></process-bar>
        <p class="duration-time">
          {{ formatTime(currentSong.duration) }}
        </p>
      </div>
      <div class="volume-wrap">
        <i class="iconfont volume-icon niceshengyin1"></i>
        <div class="process-bar">
          <el-slider style="width: 100%" class="bar-inner"> </el-slider>
        </div>
      </div>
      <audio
        ref="audio"
        :src="currentSong.url"
        @playing="audioReady"
        @error="audioError"
        @timeupdate="updateTime"
        @ended="audioEnd"
        @pause="audioPaused"
      ></audio>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, watch, ref, nextTick } from "vue";
import { useStore } from "vuex";
import utils from "@/utils";
import processBar from "@/components/processBar/index.vue";

export default defineComponent({
  setup() {
    const playing = computed(() => store.getters.playing); //是否正在播放
    const currentSong = computed(() => store.getters.currentSong); //当前歌曲
    const store = useStore();
    const state = reactive({
      songReady: false, //准备好歌曲了，可以播放
      currentTime: 0,
      id: "",
    });
    // 格式化时间
    const formatTime = (interval) => {
      interval = interval | 0;
      const m = (interval / 60) | 0;
      const s = interval % 60;
      return `${utils.formatZero(m, 2)}:${utils.formatZero(s, 2)}`;
    };

    // 播放准备完成
    const audioReady = () => {
      state.songReady = true;
    };

    // 歌曲错误
    // const audioError = ()=> {
    //   clearTimeout(.timer)
    //   this.songReady = true
    // },

    watch(
      playing,
      (n, o) => {
        console.log(n, o);
        if (!state.songReady) return;
        const audio: any = ref(null).value;
        if (audio) {
          n ? audio.play() : audio.pause();
        }
      },
      { immediate: false } //首次立即执行
    );

    watch(currentSong, (newSong, oldSong) => {
      if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
        return;
      }
      state.songReady = false;
      nextTick(() => {
        const audio: any = ref(null).value;
        if (audio) {
          audio.src = newSong.url;
          audio.play();
          state.id = newSong.id;
        }
      });
    });
    return {
      store,
      state,
      formatTime,
      audioReady,
      currentSong,
      playList: computed(() => store.getters.playList),
      mode: computed(() => store.getters.mode),
      playing,
      currentIndex: computed(() => store.getters.currentIndex),
      sequenceList: computed(() => store.getters.sequenceList),
      playIcon: computed(() =>
        playing.value ? "nicezanting1" : "nicebofang2"
      ),
    };
  },
  components: {
    processBar,
  },
});
</script>

<style lang="scss" scoped>
.fade-enter {
  opacity: 0;
  transform: translate3d(0, 30px, 0);
}

.fade-enter-active {
  transition: all 0.5s;
}

.fade-leave-to {
  opacity: 0;
  transform: translate3d(0, 30px, 0);
}

.fade-leave-active {
  transition: all 0.5s;
}

.player-bar {
  width: 100%;
  height: 4.5rem;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding: 0 10px 0 20px;
  justify-content: space-between;
  .avatar {
    width: 3.75rem;
    height: 3.75rem;
    border-radius: 5px;
    margin-right: 1.875rem;
    img {
      width: 3.75rem;
      height: 3.75rem;
      border-radius: 5px;
    }
  }
  .info {
    margin-right: 15px;
    width: 7.5rem;
    h2 {
      font-size: 0.875rem;
      color: #333;
      margin-bottom: 0.9375rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    p {
      font-size: 0.75rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      color: #999;
    }
  }
  .player-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    i {
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
    .icon-prev {
      font-size: 40px;
    }
    .icon-play {
      font-size: 60px;
      margin: 0 10px;
    }
    .icon-next {
      font-size: 40px;
    }
  }
  .process-wrap {
    border: solid 2px yellow;
    display: flex;
    width: 40.625rem;
    height: 100%;
    display: flex;
    align-items: center;
    margin-left: 5rem;
    flex: 1;
    p {
      font-size: 0.875rem;
    }
  }
  .volume-wrap {
    width: 11.25rem;
    margin: 0 5rem 0 2.5rem;
    display: flex;
    align-items: center;
    .volume-icon {
      font-size: 26px;
      font-weight: bold;
      cursor: pointer;
    }
    .process-bar {
      position: relative;
      width: 100%;
      flex: 1;
      height: 2px;
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 2px;
      cursor: pointer;
      margin-left: 10px;
      .bar-inner {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        .progress {
          width: 50px;
          background: $color-theme;
          height: 2px;
          border-radius: 2px;
        }
        .progress-btn {
          position: absolute;
          z-index: 100;
          right: -4px;
          width: 10px;
          height: 10px;
          top: -4.5px;
          background: $color-theme;
          box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
          border-radius: 50%;
          &::after {
            position: absolute;
            content: " ";
            top: 50%;
            left: 50%;
            margin: -3px 0 0 -3px;
            width: 6px;
            height: 6px;
            background: #ffffff;
            border-radius: 50%;
          }
        }
      }
    }
  }
}


</style>