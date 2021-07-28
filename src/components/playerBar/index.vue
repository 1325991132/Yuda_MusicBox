<template>
  <transition name="fade">
    <div class="player-bar shadow flex-row" v-show="playList.length">
      <!-- <span @click="t">test</span> -->
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
        <process-bar
          @percentChange="onPercentBarChange"
          :percent="percent"
        ></process-bar>
        <p class="duration-time">
          {{ formatTime(currentSong.duration) }}
        </p>
      </div>
      <div class="volume-wrap">
        <i
          class="iconfont volume-icon"
          @click="changeMuted"
          :class="state.isMuted ? 'nicejingyin1' : 'niceshengyin1'"
        ></i>
        <div class="process-bar">
          <el-slider
            v-model="state.volumeNum"
            style="width: 100%"
            class="bar-inner"
            :show-tooltip="false"
            @change="changeVolume"
          >
          </el-slider>
        </div>
      </div>
      <div class="tool">
        <i class="iconfont" :class="modeIcon" @click="changeMode"></i>
        <i class="iconfont nicegeci32" @click="openLyric"></i>
        <i class="iconfont nicebofangliebiao24" @click="openPlaylist"></i>
      </div>
      <audio
        ref="audio"
        :src="currentSong.url"
        @playing="audioReady"
        @error="audioError"
        @timeupdate="updateTime"
        @ended="audioEnd"
        @pause="audioPaused"
        :muted="state.isMuted"
        :volume="state.volume"
      ></audio>
      <transition name="fade">
        <div class="lyric-box shadow" v-if="state.showLyric">
          <div class="title flex-between">歌词</div>
          <div class="lyric" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="state.currentLyric">
                <p ref="lyricLine">有歌词</p>
              </div>
              <div class="no-lyric" v-else>暂无歌词，请您欣赏</div>
            </div>
          </div>
          <div class="foot"></div>
        </div>
      </transition>
      <transition name="fade">
        <div class="lyric-box playlist-box shadow" v-if="state.showPlaylist">
          <div class="title flex-between">播放列表</div>
          <div class="list"></div>
          <div class="foot"></div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, watch, ref, nextTick } from "vue";
import { useStore } from "vuex";
import utils from "@/utils";
import processBar from "@/components/processBar/index.vue";
import { playMode } from "@/common/playConfig";
import { getLyric } from "@/api/services/api";
import Lyric from "lyric-parser";
import { message } from "ant-design-vue";

export default defineComponent({
  setup() {
    const playing: any = computed(() => store.getters.playing); //是否正在播放
    const currentSong: any = computed(() => store.getters.currentSong); //当前歌曲
    const playList: any = computed(() => store.getters.playList); //列表
    const currentIndex: any = computed(() => store.getters.currentIndex); //当前播放下标
    const mode: any = computed(() => store.getters.mode); //当前播放模式
    const sequenceList: any = computed(() => store.getters.sequenceList); //顺序播放列表
    const playIcon: any = computed(() =>
      playing.value ? "nicezanting1" : "nicebofang2"
    ); //播放/暂停的图标
    const store = useStore();
    const state: any = reactive({
      songReady: false, //准备好歌曲了，可以播放
      currentTime: 0,
      currentLyric: null, //歌词
      isPureMusic: false,
      pureMusicLyric: "",
      canLyricPlay: "",
      id: "",
      volumeNum: 50,
      volume: 0.5,
      isMuted: false, //是否静音
      timer: null, //超时报错定时器
      showLyric: false, //显示歌词
      showPlaylist: false, //展开歌曲列表
    });
    const audio: any = ref(null); //audio dom
    const lyricLine: any = ref(null); //lyricLine dom
    // 格式化时间
    const formatTime = (interval) => {
      interval = interval | 0;
      const m = (interval / 60) | 0;
      const s = interval % 60;
      return `${utils.formatZero(m, 2)}:${utils.formatZero(s, 2)}`;
    };

    // 静音
    const changeMuted = () => {
      state.isMuted = !state.isMuted;
    };
    // 更改声音
    const changeVolume = (e) => {
      state.volume = e / 100;
      audio.value.volume = e / 100;
    };

    // 播放准备完成
    const audioReady = () => {
      if (state.timer) {
        clearTimeout(state.timer);
      }
      state.canLyricPlay = true;
      state.songReady = true;
    };

    // 歌曲错误
    const audioError = () => {
      console.log("报错了");
      if (state.timer) {
        clearTimeout(state.timer);
      }
      state.songReady = true;
      message.error("该歌曲无音源，已为您播放下一首歌曲");
      nextSong();
    };

    // 播放时间改变
    const updateTime = (e) => {
      state.currentTime = e.target.currentTime;
    };

    // 上一首
    const prevSong = () => {
      console.log("prev song");
      if (playList.value.length === 1) {
        loopSong();
        return;
      } else {
        let index = currentIndex.value - 1;
        if (index === -1) {
          index = playList.value.length - 1;
        }
        store.commit("SET_CURRENT_INDEX", index);
        if (!playing.value) {
          togglePlaying();
        }
      }
    };

    // 下一首
    const nextSong = () => {
      if (playList.value.length === 1) {
        loopSong();
        return;
      } else {
        let index = currentIndex.value + 1;
        if (index === playList.value.length) {
          index = 0;
        }
        store.commit("SET_CURRENT_INDEX", index);
        if (!playing.value) {
          togglePlaying();
        }
      }
    };

    // 单曲循环播放
    const loopSong = () => {
      audio.value.currentTime = 0;
      audio.value.play();
      store.commit("SET_PLAYING_STATE", true);
    };

    // 暂停
    const audioPaused = () => {
      store.commit("SET_PLAYING_STATE", false);
    };

    // 播放模式
    const modeIcon = computed(() => {
      return mode.value == playMode.sequence
        ? "nicexunhuanbofang24"
        : mode.value === playMode.loop
        ? "nicebofangqidanquxunhuan"
        : "nicebofangqisuijibofang";
    });

    // 切换播放模式
    const changeMode = () => {
      const temp_mode = (mode.value + 1) % 3;
      console.log("mode", temp_mode);
      store.commit("SET_PLAY_MODE", temp_mode);
      let list = null;
      const copy_list = JSON.parse(JSON.stringify(sequenceList.value));
      if (mode.value === playMode.random) {
        list = utils.shuffle(copy_list);
      } else {
        list = copy_list;
      }
      resetCurrentIndex(list);
      store.commit("SET_PLAYLIST", list);
    };

    // 按照打乱的列表设置index
    const resetCurrentIndex = (list) => {
      let index = list.findIndex((item) => {
        return item.id === currentSong.value.id;
      });
      store.commit("SET_CURRENT_INDEX", index);
    };

    // 播放暂停
    const togglePlaying = () => {
      if (!state.songReady) return;
      store.commit("SET_PLAYING_STATE", !playing.value);
    };

    let percent: any = computed(() => {
      return state.currentTime / currentSong.value.duration;
    });

    //切换播放状态执行
    watch(
      playing,
      (n) => {
        if (!state.songReady) return;
        if (audio.value) {
          n ? audio.value.play() : audio.value.pause();
        }
      },
      { immediate: false } //首次立即执行
    );

    //切歌的时候执行
    watch(currentSong, (newSong, oldSong) => {
      if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
        return;
      }
      state.songReady = false;
      state.canLyricPlay = false;
      nextTick(() => {
        if (audio.value) {
          audio.value.src = newSong.url;
          audio.value.play();
          state.id = newSong.id;
        }
      });
      // 如果5s没播放，则认为超时，修改状态确保可以切换歌曲
      if (state.timer) {
        clearTimeout(state.timer);
      }
      state.timer = setTimeout(() => {
        state.songReady = true;
      }, 5000);
      qyd_getLyric(newSong.id);
    });

    //移动歌曲进度条
    const onPercentBarChange = (percent) => {
      const currentTime = currentSong.value.duration * percent;
      state.currentTime = audio.value.currentTime = currentTime;
      if (!playing.value) {
        togglePlaying();
      }
    };

    // 播放完成
    const audioEnd = () => {
      state.currentTime = 0;
      if (mode.value === playMode.loop) {
        loopSong();
      } else {
        nextSong();
      }
    };

    // ---------------------------------------------------------
    // 打开歌词
    const openLyric = () => {
      state.showPlaylist = false;
      if (state.showLyric) {
        state.showLyric = false;
      } else {
        state.showLyric = true;
      }
    };

    // 获取歌词
    const qyd_getLyric = async (id) => {
      try {
        const res = await getLyric(id);
        console.log(res);
        if (res.code === 200) {
          let lyric = res.lrc.lyric;

          state.currentLyric = new Lyric(lyric, lyricHandle);
          console.log("state.currentLyric", state.currentLyric.lrc);

          if (playing.value && state.canLyricPlay) {
            state.currentLyric.seek(state.currentTime * 1000);
          }
          console.log('state.currentLyric1',state.currentLyric);
          // nextTick(()=>{
          //   console.log("lyricLine.value",audio.value);
          // })

          // qyd
          // if(state.isPureMusic){
          //   const timeExp = /\[(\d{2}):(\d{2}):(\d{2})]/g
          //   state.pureMusicLyric = state.currentLyric.lrc
          // }
        }
      } catch (err) {
        state.currentLyric = null;
      }
    };

    // 歌词的回调函数
    const lyricHandle = ({ lineNum, txt }) => {
      console.log("1111111111111");
    };

    // 展开播放列表
    const openPlaylist = () => {
      state.showLyric = false;
      if (state.showPlaylist) {
        state.showPlaylist = false;
      } else {
        state.showPlaylist = true;
      }
    };

    return {
      store,
      state,
      formatTime, //格式化时间
      modeIcon, //模式icon显示
      audioReady, //音频准备好了
      changeMode, //切换播放模式
      percent, //给进度条传的百分比
      onPercentBarChange, //移动歌曲进度条
      currentSong, //当前歌曲
      changeMuted, //点击喇叭，切换静音
      changeVolume, //修改声音
      audio, //audio DOM
      prevSong, //上一首
      nextSong, //下一首
      playing, //是否正在播放
      playIcon, //图标
      updateTime, //播放时间改变
      togglePlaying, //播放暂停
      audioPaused, //暂停
      audioError, //歌曲错误
      audioEnd, //播放结束后回调
      playList, //当前播放列表
      mode, //当前播放模式
      currentIndex, //当前播放下标
      sequenceList, //顺序播放列表
      openLyric, //显示歌词
      openPlaylist, //展开播放列表
    };
  },
  components: {
    processBar,
  },
});
</script>

<style lang="scss" scoped>
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
  .tool {
    .iconfont {
      font-size: 1.5rem;
      margin: 0 10px;
      cursor: pointer;
      &:active {
        opacity: 0.7;
      }
    }
  }
  .lyric-box {
    width: 22.5rem;
    height: 36.25rem;
    position: absolute;
    right: 0;
    bottom: 80px;
    border-radius: 3px;
    padding: 1.875rem;
    overflow: hidden;
    .title {
      font-weight: 500;
      font-size: 1rem;
      margin: 10px 0 30px;
    }
  }
}

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
</style>