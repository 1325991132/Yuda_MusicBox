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
                粉丝<span>{{ state.userProfile.followeds }}</span>
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
            <span @click="loadAfter">点击此处加载更多...</span>
          </li>
        </a-spin>
      </ul>
      <p v-else style="color: #aaa">该用户没有关注任何人哦~</p>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, reactive, onMounted, ref, computed } from "vue";
import {
  getUserDetail,
  getUserArtist,
  getUserFollows,
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
      followList: [], //关注列表,
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
          // console.log(state)
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
          // console.log(state.myList,state.collectList)
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

    const getFollows = async (limit, page) => {
      const res = await getUserFollows(userIdNow.value, limit, page);
      console.log(res);
      if (res.code !== 200) return;
      state.followList = res.follow;
      state.modalVisible = true;
      // await nextTick();
      // userFollowWrapper.value.addEventListener("scroll", () => {
      //   console.log(userFollowWrapper.value.scrollTop);
      // });
    };
    const loadAfter = async () => {
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
      age,
      getFollows, //获取用户关注列表
      chooseFollower,
      userFollowWrapper, //关注列表的dom
      loadAfter, //加载更多
      limitStep, //粉丝、关注列表每次请求的数量
    };
  },
});
</script>

<style lang="scss" scoped>
  @media only screen and (min-width: 769px) {
  .personal-wrap {
    margin-top: -20px;
    .banner {
      width: 100%;
      height: 15.625rem;
      background: url("@/assets/images/music_wall.jpg");
      background-position: center;
      background-size: cover;
      background-attachment: fixed;
    }
    .personal-main {
      display: flex;
      align-items: flex-start;
      .left {
        width: 350px;
        position: relative;
        top: -60px;
        margin-right: 20px;
        .user-box {
          background: #fff;
          border-radius: 5px;
          padding-bottom: 30px;
          .background {
            width: 100%;
            height: 140px;
            position: relative;
            border-radius: 5px 5px 0 0;
            background: url(@/assets/images/search_bg.jpg);
            background-size: cover;
            &::before {
              border-radius: 5px 5px 0 0;
            }
          }
          .card {
            margin-top: -20px;
            padding: 0 15px 0 30px;
            width: 100%;
            .avatar {
              width: 64px;
              height: 64px;
              flex-shrink: 0;
              z-index: 2;
              position: relative;
              img {
                width: 64px;
                height: 64px;
                border-radius: 3px;
              }
            }
            .info {
              width: 100%;
              padding-top: 20px;
              margin-left: 15px;
              .name {
                font-weight: 600;
                font-size: 16px;
              }
              .sign-btn {
                padding: 3px 15px;
                font-size: 12px;
                color: #fff;
                border-radius: 30px;
                &.sign-btn-active {
                  background: #fa2800;
                  cursor: pointer;
                  border: 1px solid #fa2800;
                }
              }
            }
          }
          .desc {
            padding: 0 40px;
            font-size: 13px;
            margin-top: 10px;
            color: #666;
          }
          .profile {
            padding: 0 40px;
            margin-top: 10px;
            .tag {
              position: relative;
              font-size: 13px;
              padding-left: 15px;
              display: flex;
              align-items: center;
              margin-bottom: 5px;
              .lv-icon {
                font-size: 22px;
                position: relative;
                top: 1px;
              }
              .sex-icon {
                font-size: 14px;
                margin-left: 5px;
                font-weight: bold;
                &.men {
                  color: #4192eb;
                }
                &.women {
                  color: #f4606c;
                }
              }
              .area-icon {
                font-size: 12px;
                margin-right: 5px;
              }
              span {
                font-size: 13px;
              }
              &::before {
                content: "";
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: $color-theme;
                position: absolute;
                top: 50%;
                left: 0px;
                margin-top: -3px;
              }
            }
          }
          .follow {
            list-style: none;
            display: flex;
            margin: 0 30px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #f9f9ff;
            li {
              width: 33%;
              text-align: center;
              font-size: 14px;
              color: #958ebb;
              span {
                cursor: pointer;
                display: block;
              }
            }
          }
          .foot {
            width: 100%;
            padding: 0 30px;
            margin-top: 30px;
            a {
              display: block;
              width: 50%;
              text-align: center;
              margin: 0 3% 10px 3%;
              padding: 10px 0;
              background: #ff416c;
              background: linear-gradient(to right, #ff4b2b, #ff416c);
              color: #fff;
              border-radius: 5px;
              font-size: 14px;
            }
          }
        }
      }
      .center {
        width: 640px;
        background: #fff;
        position: relative;
        margin-top: 40px;
        margin-right: 20px;
        border-radius: 5px;
        padding: 15px;
        .card-header {
          border-left: 3px solid $color-theme;
          height: 20px;
          padding-left: 1rem;
          margin-bottom: 15px;
          font-weight: bold;
          span {
            font-weight: 100;
            color: #666666;
            font-size: 12px;
          }
          .tab {
            span {
              font-size: 12px;
              cursor: pointer;
              &.active {
                color: $color-theme;
              }
            }
            .line {
              width: 1px;
              height: 13px;
              background: #999;
              display: block;
              margin: 0 10px;
            }
          }
        }
      }
      .right {
        width: 50rem;
        flex-shrink: 0;
        border-radius: 5px;
        background: #fff;
        position: relative;
        padding-bottom: 30px;
        margin-top: 40px;
        .card-header {
          border-left: 3px solid $color-theme;
          height: 20px;
          padding-left: 1rem;
          margin-bottom: 15px;
          font-weight: bold;
          .icon-like {
            font-size: 20px;
          }
        }
        .module {
          padding: 15px;
          width: 100%;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .my {
          padding-bottom: 5px;
          ul {
            display: flex;
            flex-wrap: wrap;
            margin: 0 -5px;
            li {
              flex: 0 0 14.285714285714%;
              max-width: 14.285714285714%;
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
      }
    }
  }
  // 弹框内部样式
  .userFollowWrapper {
    max-height: 500px;
    overflow: hidden;
    transition: all 0.1s ease-in-out;

    .followItem {
      margin-top: 10px;

      .itemWrapper {
        cursor: pointer;
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        border: solid 1px #ccc;
        border-radius: 10px;

        .avatarWrapper {
          width: 100px;
          padding: 10px;
          .avatarImg {
            width: 100px;
            height: 100px;
            border-radius: 10px;
          }
        }

        .infoWrapper {
          width: 250px;
          margin-left: 50px;
          .nickName {
            font-weight: 600;
            font-size: 16px;
          }
          .info {
            display: inline-block;
            width: 100%;
            margin-top: 20px;
          }
        }
      }
    }
    .loadAfter {
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        color: #fa2800;
        cursor: pointer;
      }
    }
    &:hover {
      padding-right: 5px;
      overflow: auto;
    }
  }
}
// phone
 @media only screen and (max-width: 768px) {
  .personal-wrap {
    margin-top: -20px;
    .banner {
      width: 100%;
      height: 15.625rem;
      background: url("@/assets/images/music_wall.jpg");
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
    }
    .personal-main {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      .left {
        width: 100%;
        position: relative;
        top: -100px;
        margin-right: 20px;
        .user-box {
          background: #fff;
          border-radius: 5px;
          padding-bottom: 30px;
          .background {
            width: 100%;
            height: 140px;
            position: relative;
            border-radius: 5px 5px 0 0;
            background: url(@/assets/images/search_bg.jpg);
            background-size: cover;
            &::before {
              border-radius: 5px 5px 0 0;
            }
          }
          .card {
            margin-top: -20px;
            padding: 0 15px 0 30px;
            width: 100%;
            .avatar {
              width: 64px;
              height: 64px;
              flex-shrink: 0;
              z-index: 2;
              position: relative;
              img {
                width: 64px;
                height: 64px;
                border-radius: 3px;
              }
            }
            .info {
              width: 100%;
              padding-top: 20px;
              margin-left: 15px;
              .name {
                font-weight: 600;
                font-size: 16px;
              }
              .sign-btn {
                padding: 3px 15px;
                font-size: 12px;
                color: #fff;
                border-radius: 30px;
                &.sign-btn-active {
                  background: #fa2800;
                  cursor: pointer;
                  border: 1px solid #fa2800;
                }
              }
            }
          }
          .desc {
            padding: 0 40px;
            font-size: 13px;
            margin-top: 10px;
            color: #666;
          }
          .profile {
            padding: 0 40px;
            margin-top: 10px;
            .tag {
              position: relative;
              font-size: 13px;
              padding-left: 15px;
              display: flex;
              align-items: center;
              margin-bottom: 5px;
              .lv-icon {
                font-size: 22px;
                position: relative;
                top: 1px;
              }
              .sex-icon {
                font-size: 14px;
                margin-left: 5px;
                font-weight: bold;
                &.men {
                  color: #4192eb;
                }
                &.women {
                  color: #f4606c;
                }
              }
              .area-icon {
                font-size: 12px;
                margin-right: 5px;
              }
              span {
                font-size: 13px;
              }
              &::before {
                content: "";
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: $color-theme;
                position: absolute;
                top: 50%;
                left: 0px;
                margin-top: -3px;
              }
            }
          }
          .follow {
            list-style: none;
            display: flex;
            margin: 0 30px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #f9f9ff;
            li {
              width: 33%;
              text-align: center;
              font-size: 14px;
              color: #958ebb;
              span {
                cursor: pointer;
                display: block;
              }
            }
          }
          .foot {
            width: 100%;
            padding: 0 30px;
            margin-top: 30px;
            a {
              display: block;
              width: 50%;
              text-align: center;
              margin: 0 3% 10px 3%;
              padding: 10px 0;
              background: #ff416c;
              background: linear-gradient(to right, #ff4b2b, #ff416c);
              color: #fff;
              border-radius: 5px;
              font-size: 14px;
            }
          }
        }
      }
      .center {
        display: none;
      }
      .right {
        top: -50px;
        width: 100%;
        flex-shrink: 0;
        border-radius: 5px;
        background: #fff;
        position: relative;
        padding-bottom: 30px;
        .card-header {
          border-left: 3px solid $color-theme;
          height: 20px;
          padding-left: 1rem;
          margin-bottom: 15px;
          font-weight: bold;
          .icon-like {
            font-size: 20px;
          }
        }
        .module {
          padding: 15px;
          width: 100%;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .my {
          padding-bottom: 5px;
          ul {
            display: flex;
            flex-wrap: wrap;
            margin: 0 -5px;
            li {
              flex: 0 0 14.285714285714%;
              max-width: 14.285714285714%;
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
      }
    }
  }
  // 弹框内部样式
  .userFollowWrapper {
    max-height: 100%;
    overflow: hidden;
    transition: all 0.1s ease-in-out;
    .followItem {
      margin-top: 5px;

      .itemWrapper {
        cursor: pointer;
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        border: solid 1px #ccc;
        border-radius: 10px;

        .avatarWrapper {
          width: 50px;
          padding: 10px;
          .avatarImg {
            width: 50px;
            height: 50px;
            border-radius: 10px;
          }
        }

        .infoWrapper {
          width: 80%;
          margin-left: 20px;
          .nickName {
            font-weight: 600;
            font-size: 1rem;
          }
          .info {
            font-size: 0.5rem;
            display: inline-block;
            width: 100%;
          }
        }
      }
    }
    .loadAfter {
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        color: #fa2800;
        cursor: pointer;
      }
    }
    &:hover {
      padding-right: 5px;
      overflow: auto;
    }
  }
}

::v-deep(.ant-spin-dot-item) {
  background: #fa2800;
}
</style>
