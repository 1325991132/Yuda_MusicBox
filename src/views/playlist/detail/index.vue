<template>
  <div class="playlist-detail container">
    <div class="left shadow">
      <a-skeleton active :loading="!detail.coverImgUrl" avatar />
      <div class="top" v-show="detail.coverImgUrl">
        <div class="avatar">
          <img
            ref="avatar"
            :title="youLikeList"
            @click="handleLikeThisList"
            :src="
              detail.coverImgUrl ? detail.coverImgUrl + '?param=200y200' : ''
            "
          />
          <div :class="youLikeFlag ? 'isLike' : 'isNotLike'">
            <!-- <i
            class="iconfont icon-heart"
            @click.stop="likeThisSong(item.id, true)"
            v-if="likeSongsList.indexOf(item.id) == -1"
            title="您暂未喜欢此音乐"
          ></i> -->
            <i class="iconfont icon-heart1" title="您喜欢了此音乐"></i>
          </div>
        </div>

        <div class="info">
          <div class="title flex-between">
            <span>{{ detail.name }}</span>
            <!-- <div></div> -->
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
            <!-- <pre class="ellipsis-two">{{detail.description}}</pre> -->
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
          @initDetail="initDetail"
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
    width="900"
    @ok="modalVisible = false"
    :footer="null"
  >
    <pre>{{ detail.description }}</pre>
  </a-modal>
</template>

<script>
import { computed, onMounted, reactive, toRefs } from "@vue/runtime-core";
import { useRouter, useRoute } from "vue-router";
import {
  getPlayListDetail,
  getSubscribersPlaylist,
  getSongDetail,
  collectPlaylist,
} from "@/api/services/api";
import { getUserArtist } from "@/api/services/user";
import ArtistList from "@/components/artistList/index.vue";
import { message } from "ant-design-vue";
import { createSong } from "@/model/song";
import { useStore } from "vuex";
import utils from "@/utils";

export default {
  setup() {
    const store = useStore();
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
      // 当前用户喜欢的列表
      collectList: [],
      youLikeList: null,
      youLikeFlag: false,
    });
    const userInfo = computed(
      () => store.getters.userInfo || window.localStorage.getItem("userInfo")
    );

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

    const qydgetUserArtist = async () => {
      try {
        let res = await getUserArtist(userInfo.value.userId);
        if (res.code === 200) {
          let list = res.playlist;
          let myList = [];
          let collectList = [];
          list.map((item) => {
            if (item.userId === userInfo.value.userId) {
              myList.push(item);
            } else {
              collectList.push(item);
            }
          });

          state.collectList = collectList;

          let myCreated = myList.some((item) => {
            return item.id == route.query.id;
          });
          if (myCreated) {
            state.youLikeList = "你创建了此歌单";
            state.youLikeFlag = true;
          } else {
            state.youLikeFlag =
              collectList.filter((item) => {
                return item.id == route.query.id;
              }).length > 0;
            state.youLikeList = state.youLikeFlag
              ? "你喜欢了此歌单"
              : "点击喜欢此歌单";
          }
        }
      } catch (err) {
        console.log(err);
      }
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

    // 点击喜欢此歌单
    const handleLikeThisList = async ()=> {
      let t = state.youLikeFlag ? 2 : 1;
      try {
        const res = await collectPlaylist(t, route.query.id);
        if (res.code === 200) {
          let str = t == 2 ? "移除收藏成功 ！" : "收藏成功 ！";
          str+="操作已在队列中，受网络原因影响可能数据更新同步较慢，不要重复点击哦~"
          message.success(str);
          state.youLikeFlag = (t == 1?true:false)
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

    const initDetail = function () {
      console.log("执行init");
      id = route.query.id;
      state.artistId = id;
      if (id) {
        _initialize(id);
      }
    };

    onMounted(() => {
      initDetail();
      qydgetUserArtist();
    });
    return {
      utils,
      ...toRefs(state),
      defaultImg,
      toUser,
      openDesc,
      initDetail,
      handleLikeThisList,
    };
  },
  components: { ArtistList },
};
</script>

<style lang="scss" scoped>
@import "./style/pc.scss";
@import "./style/mobile.scss";
</style>