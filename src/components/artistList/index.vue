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
          <th class="th-index">序号</th>
          <th class="th-name">歌曲</th>
          <th class="th-artist">歌手</th>
          <th class="th-album">专辑</th>
          <th class="th-duration">时长</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in songs"
          :key="index"
          :class="currentSong.id == item.id && playing ? 'playing' : ''"
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
                @click="playSong(item, index)"
              ></i>
              <i
                class="iconfont nicezanting1 pause-btn"
                @click="pauseSong(item, index)"
              ></i>
            </div>
          </td>
          <td>
            <div class="name-container">
              <div class="avatar">
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
          <td>
            <div class="album-container">
              <p :title="item.album" class="ellipsis">{{ item.album }}</p>
            </div>
          </td>
          <td>
            <div class="duration-container">
              <p>{{ utils.formatSecondTime(item.duration) }}</p>
              <!-- <div class="song-tools">
                <i class="iconfont niceicon-heart" title="喜欢"></i>
                <i class="iconfont nicexiazai" title="下载"></i>
                <i class="iconfont nicedot" title="更多"></i>
              </div> -->
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRaw, computed } from "vue";
import { useStore } from "vuex";
import utils from "@/utils/index.js";

export default defineComponent({
  props: {
    songs: {
      type: Array,
    },
  },
  setup(props: any) {
    const store = useStore();
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
    return {
      playSong,
      pauseSong,
      playAllSong,
      currentSong: computed(() => store.getters.currentSong),
      playing: computed(() => store.getters.playing),
      utils,
    };
  },
});
</script>

<style lang="scss" scoped>
$color-theme: red;
.artist-box {
  width: 100%;
  .tool-head {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 0.9375rem 0;
    .item {
      background: #f2f2f2;
      color: #333;
      padding: 0.4375rem 0.9375rem;
      border-radius: 50px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s;
      i {
        margin-right: 0.3125rem;
      }
    }
    .play-item {
      background-color: $color-theme;
      color: #fff;
    }
  }
  .artist-table {
    width: 100%;
    thead {
      width: 100%;
      height: 3.125rem;
      line-height: 3.125rem;
      background-color: #fafafa;
      color: #999;
      th {
        padding: 0 0.5625rem;
        text-align: left;
        font-weight: 300;
        &.th-index {
          width: 10%;
          text-align: center;
        }
        &.th-name {
          width: 40%;
        }
        &.th-artist {
          width: 25%;
        }
        &.th-album {
          width: 15%;
        }
        &.th-duration {
          width: 15%;
          text-align: right;
          padding-right: 40px;
        }
      }
    }
    tbody {
      width: 100%;
      tr {
        height: 50px;
        line-height: 50px;
        transition: background-color 0.2s ease-in-out;
        td {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
          vertical-align: middle;
        }
        .index-container {
          .num {
            color: #4a4a4a;
            font-weight: 500;
          }
          .play-icon {
            height: 1rem;
            max-width: 20px;
            overflow: hidden;
            display: none;
            .line {
              width: 2px;
              height: 100%;
              margin-left: 2px;
              background-color: #ff410f;
              animation: play 0.9s linear infinite alternate;
            }
          }
          .play-btn {
            color: $color-theme;
            font-size: 30px;
            display: none;
            text-align: left;
            cursor: pointer;
          }
          .pause-btn {
            color: $color-theme;
            font-size: 30px;
            display: none;
            text-align: left;
            cursor: pointer;
          }
        }
        .name-container {
          display: flex;
          align-items: center;
          .avatar {
            width: 35px;
            height: 35px;
            flex-shrink: 0;
            border-radius: 5px;
            margin-right: 10px;
            .el-image {
              height: 100%;
              width: 100%;
              border-radius: 5px;
            }
          }
          p {
            max-width: 21.875rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .artist-container {
          p {
            padding-left: 10px;
            max-width: 21.875rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .album-container {
          p {
            padding-left: 10px;
            max-width: 21.875rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .duration-container {
          text-align: right;
          padding-right: 15px;
          position: relative;
          p {
            padding-right: 15px;
          }
        }
        &.playing {
          p {
            color: $color-theme;
          }
          i {
            color: $color-theme;
          }
          .index-container {
            .num {
              display: none;
            }
            .play-icon {
              display: flex;
            }
            .play-btn {
              display: none;
            }
          }
        }
        &:hover {
          background: #e8e9ed;
          .index-container {
            .num {
              display: none;
            }
            .play-btn {
              display: block;
            }
          }
          &.playing {
            .index-container {
              .play-btn {
                display: none;
              }
              .play-icon {
                display: none;
              }
              .pause-btn {
                display: block;
              }
            }
          }
        }
      }
    }
  }
}
</style>