<template>
  <transition name="fade">
    <div class="player-bar shadow flex-row" @click.stop="state.showPlaylist = false;" v-show="playList.length">
      <div class="avatar">
        <img :src="currentSong && currentSong.image" alt="nicemusic" />
      </div>
      <div class="info">
        <h2 class="ellipsis">{{ currentSong.name }}</h2>
        <p class="ellipsis">{{ currentSong.singer }}</p>
      </div>
      <div class="player-btn">
        <i class="iconfont icon-prev niceshangyishou" @click.stop="prevSong"></i>
        <i
          class="iconfont icon-play nicebofang2"
          :class="playIcon"
          @click.stop="togglePlaying"
        ></i>
        <i class="iconfont icon-next nicexiayishou" @click.stop="nextSong"></i>
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
          @click.stop="changeMuted"
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
        <span class="iconfont" @click.stop="downloadMusic"
          ><i class="el-icon-download" :style="{ transform: 'scale(0.8)' }"></i
        ></span>
        <i
          class="iconfont icon-heart"
          style="font-size: 16px; color: red"
          @click.stop="likeThisSong(currentSong.id, true)"
          v-if="likeSongsList.indexOf(currentSong.id) == -1"
          title="您暂未喜欢此音乐"
        ></i>
        <i
          style="font-size: 16px; color: red"
          class="iconfont icon-heart1"
          @click.stop="likeThisSong(currentSong.id, false)"
          v-else
          title="您喜欢了此音乐"
        ></i>
        <i class="iconfont" :class="modeIcon" @click.stop="changeMode"></i>
        <i class="iconfont nicegeci32" @click.stop="openLyric"></i>
        <i class="iconfont nicebofangliebiao24" @click.stop="openPlaylist"></i>
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
          <scroll
            class="lyric"
            ref="lyricList"
            :data="state.currentLyric && state.currentLyric.lines"
          >
            <div class="lyric-wrapper">
              <div ref="lyric_box" v-if="state.currentLyric">
                <p
                  ref="lyricLine"
                  class="lyric-text"
                  :class="state.currentLyricNum === index ? 'active' : ''"
                  v-for="(item, index) of state.currentLyric.lines"
                  :key="index"
                >
                  {{ item.txt }}
                </p>
              </div>
              <div class="no-lyric" v-else>暂无歌词，请您欣赏</div>
            </div>
          </scroll>
          <div class="foot"></div>
        </div>
      </transition>
      <transition name="fade">
        <div class="lyric-box playlist-box shadow" v-if="state.showPlaylist">
          <div class="title flex-between">
            播放列表<i
              class="iconfont nicelajitong"
              alt="清空"
              title="清空"
              @click.stop="clearHistory"
            ></i>
          </div>
          <div class="list">
            <div
              class="item flex-row"
              v-for="(item, index) in historyList"
              :key="index"
              :class="currentSong.id == item.id && playing ? 'playing' : ''"
            >
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
                  @click.stop="playSong(index)"
                ></i>
                <i
                  class="iconfont nicezanting1 pause-btn"
                  @click.stop="pauseSong"
                ></i>
              </div>
              <p class="ellipsis">{{ item.name }}</p>
              <i
                class="iconfont niceIcon_cloose"
                @click.stop="deleteHistoryItem(item)"
              ></i>
            </div>
          </div>
          <div class="foot"></div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import {
  defineComponent,
  computed,
  reactive,
  watch,
  ref,
  nextTick,
  onMounted,
} from "vue";
import { useStore } from "vuex";
import utils from "@/utils";
import processBar from "@/components/processBar/index.vue";
import { playMode } from "@/common/playConfig";
import { getLyric, likeSong } from "@/api/services/api";
import { getLikeList } from "@/api/services/user";
import Lyric from "lyric-parser";
import { message } from "ant-design-vue";
import Scroll from "@/components/scroll/index.vue";

export default defineComponent({
  setup() {
    const playing = computed(() => store.getters.playing); //是否正在播放
    const currentSong = computed(() => store.getters.currentSong); //当前歌曲
    const playList = computed(() => store.getters.playList); //列表
    const currentIndex = computed(() => store.getters.currentIndex); //当前播放下标
    const mode = computed(() => store.getters.mode); //当前播放模式
    const sequenceList = computed(() => store.getters.sequenceList); //顺序播放列表
    const historyList = computed(() => store.getters.historyList); //历史播放列表
    const likeSongsList = computed(() => store.getters.likeSongsList); //获取喜欢列表
    const getUserDevice = computed(() => store.getters.getUserDevice); //获取用户设备
    const clearHistoryList = () => {
      store.dispatch("clearHistoryList");
    };
    const playIcon = computed(() =>
      playing.value ? "nicezanting1" : "nicebofang2"
    ); //播放/暂停的图标
    const store = useStore();
    const state = reactive({
      songReady: false, //准备好歌曲了，可以播放
      currentTime: 0,
      currentLyric: null, //歌词
      isPureMusic: false,
      pureMusicLyric: "",
      canLyricPlay: "",
      currentLyricNum: "", //播放到第几行
      playingLyric: "", //当前这一行歌词
      id: "",
      volumeNum: 50,
      volume: 0.5,
      isMuted: false, //是否静音
      timer: null, //超时报错定时器
      showLyric: false, //显示歌词
      showPlaylist: false, //展开歌曲列表
    });
    const audio = ref(null); //audio dom
    const lyricLine = ref(null); //lyricLine dom 歌词
    const lyricList = ref(null); // scroll dom 滚动区域

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
      if (state.currentLyric) {
        state.currentLyric.seek(state.currentTime * 1000);
      }
    };

    // 歌曲错误
    const audioError = () => {
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
      if (!state.songReady) {
        return;
      }
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
      if (!state.songReady) {
        return;
      }
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
      if (state.currentLyric) {
        state.currentLyric.seek(0);
      }
    };

    // 暂停
    const audioPaused = () => {
      store.commit("SET_PLAYING_STATE", false);
      if (state.currentLyric) {
        state.currentLyric.stop();
      }
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
      if (state.currentLyric) {
        state.currentLyric.togglePlay();
      }
    };

    // 下载
    const downloadMusic = async () => {
      console.log("currentSong", currentSong.value.id);
      let url = `https://music.163.com/song/media/outer/url?id=${currentSong.value.id}.mp3`;
      let fileName = currentSong.value.name + ".mp3";
      let link = document.createElement("a");
      link.style.display = "none";
      link.setAttribute("target", "_blank");
      link.href = url;
      link.setAttribute("download", fileName);
      togglePlaying();
      link.click();
    };

    let percent = computed(() => {
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
      console.log("statecurrentLyric", state.currentLyric);
      if (state.currentLyric) {
        state.currentLyric.stop();
        state.currentLyric = null;
        state.playingLyric = "";
        state.currentLyricNum = 0;
      }
      nextTick(() => {
        if (audio.value) {
          audio.value.src = newSong.url;
          audio.value.volume = state.volume;
          audio.value.play();
          store.dispatch("saveHistoryList", newSong);
          console.log("historyList", historyList.value);
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
      if (state.currentLyric) {
        state.currentLyric.seek(state.currentTime * 1000);
      }
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
        if (res.code === 200) {
          let lyric = res.lrc.lyric;
          state.currentLyric = new Lyric(lyric, lyricHandle);
          if (playing.value && state.canLyricPlay) {
            state.currentLyric.seek(state.currentTime * 1000);
          }
        }
      } catch (err) {
        state.currentLyric = null;
        state.playingLyric = "";
      }
    };

    const lyric_box = ref(null);
    // let tt = null;
    // 歌词的回调函数
    const lyricHandle = ({ lineNum, txt }) => {
      if (!lyric_box.value) {
        return;
      }
      state.currentLyricNum = lineNum;
      if (lineNum > 8) {
        let lyricAll = lyric_box.value.querySelectorAll("p"); //获取所有歌词

        let lineEl = lyricAll[lineNum - 8];
        // tt = lyricAll[lineNum + 8];
        if (lyric_box.value) {
          nextTick(() => {
            console.log("scrollToElement", lineEl);
            lyricList.value.scrollToElement(lineEl, 1000);
          });
        }
      } else {
        if (lyricList.value) {
          nextTick(() => {
            lyricList.value.scrollTo(0, 0, 1000);
          });
        }
      }
      state.playingLyric = txt;
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

    // 播放歌曲
    const playSong = (index) => {
      store.dispatch("selectPlay", { list: historyList.value, index });
    };
    // 停止播放歌曲
    const pauseSong = () => {
      store.dispatch("pausePlay");
    };

    // 移除最近播放单曲
    const deleteHistoryItem = (item) => {
      store.dispatch("deleteHistoryList", item);
    };

    // 清空历史播放列表
    const clearHistory = () => {
      clearHistoryList();
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
      if(res){
        qydgetUserLike(id);
      }
    };

    // 判断用户设备
    onMounted(() => {
      nextTick(() => {
        if (getUserDevice.value !== "window") {
          console.log("not window");
        }
      });
    });

    return {
      store,
      state,
      utils,
      lyric_box, //歌词box
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
      lyricLine, //lyricLine歌词 DOM
      lyricList, //歌词滚动区域dom
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
      historyList, //历史播放列表
      openLyric, //显示歌词
      openPlaylist, //展开播放列表
      clearHistory, //清空播放列表
      playSong, //播放歌曲
      pauseSong, //停止播放歌曲
      deleteHistoryItem, // 移除最近播放单曲
      downloadMusic, //下载
      likeThisSong, //喜欢该歌曲
      likeSongsList, //喜欢列表ids数组
    };
  },
  components: {
    processBar,
    Scroll,
  },
});
</script>

<style lang="scss" scoped>
@mixin playerBar() {
  width: 100%;
  height: 4.5rem;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  padding: 0 10px 0 20px;
}

@import './style/pc.scss';
@import './style/mobile.scss';
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