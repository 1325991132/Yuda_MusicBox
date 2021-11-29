<template>
  <div class="personal-wrap">
    <div class="banner layer"></div>
    <div class="personal-main container">
      <div class="left">
        <div class="user-box shadow">
          <div class="background layer" ref="background"></div>
          <div class="card flex-row">
            <div class="avatar">
              <img
                @click="avatarDialog"
                ref="avatar"
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              />
            </div>
            <div class="info flex-between">
              <p class="name">{{ state.userProfile.nickname || "--" }}</p>
              <!-- <button class="sign-btn sign-btn-active">已签到</button> -->
            </div>
          </div>
          <p class="desc" v-if="state.userDetail.signature">
            {{ state.userDetail.signature }}
          </p>
          <p class="desc" v-else>这个人比较懒，什么都没有写...</p>
          <div class="profile">
            <div class="tag">
              等级：
              <i
                class="iconfont lv-icon"
                :class="`nicelevel-${state.userDetail.level + 1}`"
              ></i>
            </div>
            <div class="tag">
              年龄：
              <span>{{ age }}</span>
              <i
                v-if="state.userProfile.gender === 1"
                class="iconfont niceCRM_icon_nanxing sex-icon men"
              ></i>
              <i
                v-if="state.userProfile.gender === 2"
                class="iconfont niceCRM_icon_nvxing sex-icon women"
              ></i>
            </div>
            <div class="tag">
              地区：
              <span>{{ state.provinceName }} - {{ state.cityName }}</span>
            </div>
            <ul class="follow">
              <li>
                动态<span>{{ state.userProfile.eventCount }}</span>
              </li>
              <li>
                关注<span @click="getFollows(limitStep, state.page.follow)">{{
                  state.userProfile.newFollows
                }}</span>
              </li>
              <li>
                粉丝<span
                  @click="getFolloweds(limitStep, state.page.followeds)"
                  >{{ state.userProfile.followeds }}</span
                >
              </li>
            </ul>
            <!-- <div class="foot flex-center">
              <router-link tag="a" to="/">个人设置</router-link>
              <router-link tag="a" to="/">我的等级</router-link>
            </div> -->
          </div>
        </div>
      </div>
      <div class="right">
        <div class="my module shadow">
          <div class="card-header flex-row">
            <span>我创建的歌单</span>
          </div>
          <song-sheet :sheetList="state.myList" :num="state.num"></song-sheet>
        </div>
        <div class="my collect module shadow">
          <div class="card-header flex-row">
            <span>我收藏的歌单</span>
          </div>
          <song-sheet
            :sheetList="state.collectList"
            :num="state.num"
          ></song-sheet>
        </div>
      </div>
    </div>
    <a-modal
      v-model:visible="state.modalVisible"
      :closable="null"
      centered
      @ok="state.modalVisible = false"
      :footer="null"
    >
      <template v-if="state.followType === 0">
        <ul
          class="userFollowWrapper"
          ref="userFollowWrapper"
          v-if="state.followList.length > 0"
        >
          <li
            class="followItem"
            @click="chooseFollower(item.userId)"
            v-for="item in state.followList"
            :key="item"
          >
            <div class="itemWrapper">
              <div class="avatarWrapper">
                <img class="avatarImg" ref="avatar" :src="item.avatarUrl" />
              </div>
              <div class="infoWrapper">
                <p class="nickName">
                  {{ item.nickname }}
                </p>
                <span class="info ellipsis">{{ item.signature }}</span>
              </div>
            </div>
          </li>
          <a-spin :spinning="state.page.spinning">
            <li
              class="loadAfter"
              v-if="state.userProfile.newFollows > state.followList.length"
            >
              <span @click="loadAfter(state.followType)"
                >点击此处加载更多...</span
              >
            </li>
          </a-spin>
        </ul>
        <p
          v-else-if="state.followList.length == 0"
          style="color: #aaa"
        >
          该用户没有关注任何人哦~
        </p>
      </template>

      <template v-else-if="state.followType === 1">
        <ul
        class="userFollowWrapper"
        ref="userFollowWrapper"
        v-if="state.followedsList.length > 0"
      >
        <li
          class="followItem"
          @click="chooseFollower(item.userId)"
          v-for="item in state.followedsList"
          :key="item"
        >
          <div class="itemWrapper">
            <div class="avatarWrapper">
              <img class="avatarImg" ref="avatar" :src="item.avatarUrl" />
            </div>
            <div class="infoWrapper">
              <p class="nickName">
                {{ item.nickname }}
              </p>
              <span class="info ellipsis">{{ item.signature }}</span>
            </div>
          </div>
        </li>
        <a-spin :spinning="state.page.spinning">
          <li
            class="loadAfter"
            v-if="state.userProfile.followeds > state.followedsList.length"
          >
            <span @click="loadAfter(state.followType)"
              >点击此处加载更多...</span
            >
          </li>
        </a-spin>
      </ul>
      <p
        v-else-if="state.followedsList.length == 0"
        style="color: #aaa"
      >
        此处空空如也~
      </p>
      </template>
      <p v-else>正在开发中...</p>
    </a-modal>
    <a-modal
      v-model:visible="state.imageDialogVisible"
      :closable="null"
      centered
      @ok="state.imageDialogVisible = false"
      :footer="null"
    >
      <img
        style="width: 100%; height: 100%"
        ref="avatarBig"
        :src="
          state.userProfile.avatarUrl
            ? state.userProfile.avatarUrl
            : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        "
      />
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, reactive, onMounted, ref, computed } from "vue";
import {
  getUserDetail,
  getUserArtist,
  getUserFollows,
  getUserFolloweds,
} from "@/api/services/user";
import { useRoute, useRouter } from "vue-router";
import songSheet from "@/components/songSheet/index.vue";
import utils from "@/utils";
// import storage from "good-storage";
import axios from "axios";
import { useStore } from "vuex";

export default defineComponent({
  components: { songSheet },
  setup() {
    const store = useStore();
    const userInfo = computed(() => store.getters.userInfo);
    const route = useRoute();
    const router = useRouter();
    const background = ref(null);
    const avatar = ref(null);
    const avatarBig = ref(null);
    const state = reactive({
      provinceName: "",
      cityName: "",
      myList: [],
      collectList: [],
      songs: [],
      num: 2,
      type: 1,
      userDetail: {},
      userProfile: {},
      isPerson: true,
      modalVisible: false,
      imageDialogVisible: false,
      followList: [], //关注列表,
      followedsList: [], //粉丝列表
      followType: 0, //关注、粉丝的type,关注为0,粉丝为1
      page: {
        follow: 0, //关注列表页
        followeds: 0, //粉丝列表页
        spinning: false,
      },
    });
    const userIdNow = ref("");
    const limitStep = 20;
    const age = computed(() => utils.getAstro(userInfo.value.birthday));
    const userFollowWrapper = ref(null); //关注列表dom元素
    onMounted(() => {
      console.log("userFollowWrapper", userFollowWrapper);
    });
    // 获取省市
    const getArea = () => {
      axios
        .get("https://restapi.amap.com/v3/config/district", {
          params: {
            key: "0f57ee7d5045187c48cd268f9d19d815",
            keywords: state.userProfile.province,
            subdistrict: 1,
            extensions: "base",
          },
        })
        .then((response) => {
          if (response.data.status == 1 && response.data.info == "OK") {
            let districts = response.data.districts[0];
            let subDistricts = response.data.districts[0].districts;
            state.provinceName = districts.name;
            subDistricts.map((item) => {
              if (item.adcode == state.userProfile.city) {
                state.cityName = item.name;
              }
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    const qydgetUserArtist = async () => {
      try {
        let res = await getUserArtist(state.userProfile.userId);
        if (res.code === 200) {
          let list = res.playlist;
          let myList = [];
          let collectList = [];
          list.map((item) => {
            if (item.userId === state.userProfile.userId) {
              myList.push(item);
            } else {
              collectList.push(item);
            }
          });
          state.myList = myList;
          state.collectList = collectList;
        }
      } catch (err) {
        console.log(err);
      }
    };
    // 获取用户信息
    const qydgetUserDetail = async (uid) => {
      try {
        let res = await getUserDetail(uid);
        if (res.code === 200) {
          state.userDetail = res;
          state.userProfile = res.profile;
          _initialize();
        }
        setDom();
      } catch (e) {
        console.log(e);
      }
    };

    // 给背景和头像赋值
    const setDom = () => {
      background.value.style.background = `url(${state.userProfile.backgroundUrl})`;
      avatar.value.src = state.userProfile.avatarUrl;
      avatarBig.value.src = state.userProfile.avatarUrl;
    };

    // 点击呈现头像大图
    const avatarDialog = () => {
      state.imageDialogVisible = true;
      console.log("avatar dialog show");
    };

    // 初始化
    const _initialize = () => {
      getArea();
      qydgetUserArtist();
    };

    onMounted(() => {
      let userid = route.query.id;
      if (userid) {
        userIdNow.value = userid;
        qydgetUserDetail(userid);
      } else {
        userIdNow.value = userid;
        qydgetUserDetail(userInfo.value.userId);
      }
    });

    // 关注/粉丝列表
    const getFollows = async (limit, page) => {
      state.followType = 0
      state.followList = []
      state.followedsList = []
      const res = await getUserFollows(userIdNow.value, limit, page);
      console.log(res);
      if (res.code !== 200) return;
      state.followList = res.follow;
      state.modalVisible = true;
    };

    const getFolloweds = async (limit, page) => {
      state.followType = 1
      state.followList = []
      state.followedsList = []
      console.log(userIdNow.value, limit, page);
      const res = await getUserFolloweds(userIdNow.value, limit, page);
      console.log(res);
      if (res.code !== 200) return;
      state.followedsList = res.followeds;
      console.log(state.followedsList);
      state.modalVisible = true;
    };

    const loadAfter = async (followType) => {
      if (followType == 0) {
        state.page.follow += limitStep;
        state.page.spinning = true;
        const res = await getUserFollows(
          userIdNow.value,
          limitStep,
          state.page.follow
        );
        if (res.code !== 200) return;
        state.page.spinning = false;
        state.followList = utils.uniqueArr(
          [...state.followList, ...res.follow],
          "userId"
        );
      } else if (followType == 1) {
        state.page.followeds += limitStep;
        state.page.spinning = true;
        const res = await getUserFolloweds(
          userIdNow.value,
          limitStep,
          state.page.followeds
        );
        if (res.code !== 200) return;
        state.page.spinning = false;
        state.followedsList = utils.uniqueArr(
          [...state.followedsList, ...res.follow],
          "userId"
        );
      }

      console.log("state.followList", state.followList);
    };
    const chooseFollower = (uid) => {
      router.push({
        name: "personal",
        query: {
          id: uid,
        },
      });
    };
    return {
      state,
      getArea,
      background, //图片
      avatar, //头像
      avatarBig, //大头像
      age,
      getFollows, //获取用户关注列表
      getFolloweds, //获取用户粉丝列表
      chooseFollower,
      userFollowWrapper, //关注列表的dom
      loadAfter, //加载更多
      limitStep, //粉丝、关注列表每次请求的数量
      avatarDialog, //点击呈现大图
    };
  },
});
</script>

<style lang="scss" scoped>
@import './style/pc.scss';
@import './style/mobile.scss';

::v-deep(.ant-spin-dot-item) {
  background: #fa2800;
}
</style>
