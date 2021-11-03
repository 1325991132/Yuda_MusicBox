<template>
  <div class="playlist-detail container">
    <div class="left shadow">
      <a-skeleton active :loading="!detail.coverImgUrl" avatar />
      <div class="top" v-show="detail.coverImgUrl">
        <div class="avatar">
          <img
            ref="avatar"
            :src="
              detail.coverImgUrl
                ? detail.coverImgUrl + '?param=200y200'
                : ''
            "
          />
        </div>
        <div class="info">
          <div class="title flex-between">
            <span>{{ detail.name }}</span>
            <div></div>
          </div>
          <div class="user flex-row">
            <div class="avatar" @click="toUser(creator.userId)">
              <img
                :src="
                  creator.avatarUrl
                    ? creator.avatarUrl + '?param=100y100'
                    : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                "
                alt=""
                @error="defaultImg"
              />
            </div>
            <p class="nickname" @click="toUser(creator.userId)">
              {{ creator.nickname }}
            </p>
            <p class="createTime" v-if="detail.createTime">
              {{ utils.dateFormat(detail.createTime, "YYYY-MM-DD") }}创建
            </p>
          </div>
          <div
            class="tag flex-row"
            v-if="detail.tags && detail.tags.length > 0"
          >
            <span>标签:</span
            ><a v-for="item of detail.tags" :key="item" @click="tag(item)">{{
              item
            }}</a>
          </div>
          <div class="desc">
            <p class="ellipsis-two" v-html="detail.description"></p>
            <span
              @click="openDesc(detail.description)"
              class="flex-row"
              v-if="detail.description && detail.description.trim().length > 30"
              >全部<i
                class="iconfont niceiconfontyoujiantou-copy-copy-copy-copy"
              ></i
            ></span>
          </div>
        </div>
      </div>
      <div class="content" v-loading="loading">
        <artist-list
          :songs="songs"
          :isPerson="ordered ? true : false"
          :subscribed="detail.subscribed"
        />
      </div>
    </div>
    <div class="right">
      <div class="like module shadow">
        <div class="card-header flex-row">
          <span>喜欢这个歌单的人</span>
        </div>
        <ul v-if="subscribers.length > 0">
          <li v-for="item of subscribers" :key="item.userId">
            <div class="avatar" @click="toUser(item.userId)">
              <img
                :src="item.avatarUrl + '?param=150y150'"
                :alt="item.nickname"
                :title="item.nickname"
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <a-modal
    v-model:visible="modalVisible"
    :closable="null"
    centered
    @ok="modalVisible = false"
    :footer="null"
  >
    <p>{{ detail.description }}</p>
  </a-modal>
</template>

<script>
import { onMounted, reactive, toRefs } from "@vue/runtime-core";
import { useRouter, useRoute } from "vue-router";
import {
  getPlayListDetail,
  getSubscribersPlaylist,
  getSongDetail,
} from "@/api/services/api";
import ArtistList from "@/components/artistList/index.vue";
import { message } from "ant-design-vue";
import { createSong } from "@/model/song";
import utils from "@/utils";
export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      // 歌单详情
      detail: {},
      // 歌单创建者信息
      creator: {},
      // 收藏这个歌单的人
      subscribers: [],
      // 相关歌单
      relatedList: [],
      // 相似歌单
      simiList: [],
      // 评论
      comments: [],
      // 歌曲列表
      songs: [],
      // 收藏这个歌单的人数量
      s: 32,
      artistId: "",
      loading: false,
      // 是否是我喜欢的歌单
      ordered: false,
      // 弹框
      modalVisible: false,
    });
    let id = "";

    // 图片报错赋默认图
    const defaultImg = (e) => {
      e.target.src =
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
    };

    const toUser = (id) => {
      router.push({
        name: "personal",
        query: {
          id,
        },
      });
    };

    // 歌单详情
    const qydgetPlayListDetail = async (id, s) => {
      let timestamp = new Date().valueOf();
      try {
        let res = await getPlayListDetail(id, s, timestamp);
        if (res.code !== 200) {
          return message.error("您的网络有问题，请检查您的网络连接");
        }
        // if (res.playlist.description !== null) {
        //   res.playlist.description = res.playlist.description.replace(
        //     /(\r\n|\n|\r)/gm,
        //     "<br />"
        //   );
        // }
        state.detail = res.playlist;
        state.creator = res.playlist.creator;
        let trackIds = res.playlist.trackIds;
        let arrLength = 1000;
        let sliceArr = [];
        for (let i = 0; i < trackIds.length; i += arrLength) {
          sliceArr.push(trackIds.slice(i, arrLength));
        }
        qydgetSongDetail(sliceArr);
      } catch (err) {
        message.error("您的网络有问题，请检查您的网络连接");
      }
    };

    // 获取歌单收藏者
    const qydgetSubscribersPlaylist = async (id) => {
      let params = {
        id,
        limit: 28,
        offset: 0,
      };
      try {
        let res = await getSubscribersPlaylist(params);
        if (res.code === 200) {
          state.subscribers = res.subscribers;
        }
      } catch (error) {
        message.error(error);
      }
    };

    // 获取歌曲列表
    const qydgetSongDetail = async (sliceArr) => {
      state.loading = true;
      let timestamp = new Date().valueOf();
      let before = sliceArr[0];
      let after = sliceArr[1];
      let beforeIds = [];
      let afterIds = [];
      before.map((item) => {
        beforeIds.push(item.id);
      });
      beforeIds = beforeIds.join(",");
      if (after) {
        after.map((item) => {
          afterIds.push(item.id);
        });
        afterIds = afterIds.join(",");
      }
      try {
        if (after) {
          let beforeRes = await getSongDetail(beforeIds, timestamp);
          let afterRes = await getSongDetail(afterIds, timestamp);
          let res = beforeRes.songs.concat(afterRes.songs);
          state.songs = _normalizeSongs(res);
        } else {
          let beforeRes = await getSongDetail(beforeIds, timestamp);
          let res = beforeRes.songs;
          state.songs = _normalizeSongs(res);
        }
        state.loading = false;
      } catch (err) {
        console.log(err);
      }
    };

    const _normalizeSongs = (list) => {
      let res = [];
      list.map((item) => {
        if (item.id) {
          res.push(createSong(item));
        }
      });
      return res;
    };

    const openDesc = () => {
      state.modalVisible = true;
      console.log("展开详情");
    };

    const _initialize = (id) => {
      qydgetPlayListDetail(id, 100);
      // qydgetRelatedPlaylist(id)
      qydgetSubscribersPlaylist(id);
      // qydgetCommentPlaylist(id)
    };

    onMounted(() => {
      id = route.query.id;
      state.artistId = id;
      if (id) {
        _initialize(id);
      }
    });
    return {
      utils,
      ...toRefs(state),
      defaultImg,
      toUser,
      openDesc,
    };
  },
  components: { ArtistList },
};
</script>

<style lang="scss" scoped>
.playlist-detail {
  display: flex;
  align-items: flex-start;
  .left {
    flex: 1;
    width: 59.375rem;
    padding: 15px;
    border-radius: 8px;
    margin-right: 20px;
    .top {
      display: flex;
      > .avatar {
        width: 12.5rem;
        height: 12.5rem;
        margin-right: 30px;
        border-radius: 8px;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          position: relative;
        }
        &::before {
          content: "";
          position: absolute;
          width: 95%;
          height: 95%;
          right: -5px;
          top: 0.9375rem;
          border-radius: 8px;
          display: block;
          background: rgba(0, 0, 0, 0.2);
          z-index: 0;
        }
      }
      .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        .title {
          width: 100%;
          font-size: 24px;
          font-weight: 700;
          margin-top: 10px;
          margin-bottom: 20px;
          overflow: hidden;
        }
        .tag {
          margin-top: 15px;
          margin-bottom: 15px;
          span {
            margin-right: 15px;
          }
          a {
            color: #fff;
            background-color: $color-theme;
            border-radius: 15px;
            padding: 2px 10px;
            font-size: 8px;
            margin-right: 15px;
          }
        }
        .user {
          margin-left: 15px;
          .avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            margin-right: 15px;
            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .nickname {
            margin-right: 30px;
            font-size: 14px;
            cursor: pointer;
            &:hover {
              color: $color-theme;
            }
          }
          .createTime {
            font-size: 14px;
            color: #808080;
          }
        }
        .desc {
          display: flex;
          flex-direction: column;
          line-height: 1.6;
          margin-top: 15px;
          span {
            flex-shrink: 0;
            color: $color-theme;
            cursor: pointer;
          }
          p {
            line-height: 1.6;
            font-weight: 400;
            flex: 1;
            font-size: 14px;
            width: 520px;
            text-align: left;
          }
        }
      }
    }
    .content {
      box-sizing: border-box;
      margin-top: 20px;
      overflow: hidden;
    }
  }
  .right {
    width: 350px;
    flex-shrink: 0;
    .module {
      border-radius: 8px;
      width: 100%;
      padding: 15px;
      margin-bottom: 20px;
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          flex: 0 0 14%;
          max-width: 14%;
          padding: 0 5px 10px;
          .avatar {
            width: 100%;
            border-radius: 3px;
            img {
              width: 100%;
              border-radius: 3px;
            }
          }
        }
      }
    }

    .card-header {
      border-left: 3px solid $color-theme;
      padding-left: 1rem;
      font-size: 1rem;
      height: 20px;
      font-weight: bold;
      margin-bottom: 15px;
      .icon-like {
        font-size: 20px;
      }
    }
  }
}
</style>