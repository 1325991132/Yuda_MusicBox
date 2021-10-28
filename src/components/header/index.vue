<template>
  <div class="header shadow">
    <div class="container flex-row">
      <div class="logo">
        <router-link :to="{ name: 'home' }" tag="a"></router-link>
      </div>
      <ul class="nav flex-row">
        <li>
          <router-link :to="{ name: 'home' }" tag="a">发现</router-link>
        </li>
        <!-- <li>
          <router-link :to="{ name: 'playlist' }" tag="a">歌单</router-link>
        </li> -->
        <li>
          <router-link :to="{ name: 'rank' }" tag="a">排行榜</router-link>
        </li>
        <!-- 
        <li>
          <router-link :to="{ name: 'home' }" tag="a">歌手</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'home' }" tag="a">视频</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'home' }" tag="a">MV</router-link>
        </li> -->
      </ul>
      <div class="search" @click="openSearchPop">
        <i class="iconfont nicesearch-o"></i>
      </div>
      <div class="userbox">
        <div class="line"></div>
        <div class="is-login flex-row" v-if="state.loginState">
          <el-avatar
            class="avatar"
            shape="circle"
            :size="30"
            :src="userInfo.avatarUrl"
          ></el-avatar>
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              {{ userInfo.nickname
              }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item icon="el-icon-user" command="personal"
                  >个人主页</el-dropdown-item
                >
                <el-dropdown-item icon="el-icon-medal" command="level"
                  >我的等级</el-dropdown-item
                >
                <el-dropdown-item icon="el-icon-setting" command="setting"
                  >个人设置</el-dropdown-item
                >
                <el-dropdown-item
                  divided
                  icon="el-icon-switch-button"
                  command="logout"
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="no-login flex-row" @click="routerToLogin" v-else>
          <el-avatar
            class="avatar"
            shape="circle"
            :size="30"
            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
          ></el-avatar
          >登录
        </div>
      </div>
      <div
        class="search-wrap"
        :class="[state.searchOpenClass, state.searchCloseClass]"
      >
        <div class="overlay" @click="closeSearchPop"></div>
        <div class="search-body">
          <div class="search-content">
            <div class="search-popup-cover">
              <div class="bg-effect">
                <span class="layer"></span>
              </div>
              <div class="search-form">
                <input
                  class="text"
                  type="text"
                  v-model="state.keyword"
                  @keyup.enter="search"
                  @keyup.esc="closeSearchPop"
                  placeholder="请输入搜索关键词并按回车键…"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from "vue";
import { useRouter } from "vue-router";
// import { ElMessage } from "element-plus";
import { message } from "ant-design-vue";
import { useStore } from "vuex";
// import { throttle } from "@/utils/index";

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      loginState: true,
      searchOpenClass: "",
      searchCloseClass: "",
      keyword: "",
    });
    let userInfo;
    let temp_userInfo = computed(() => store.getters.userInfo).value; //获取vuex中的用户信息
    if (temp_userInfo) {
      userInfo = temp_userInfo;
    } else {
      state.loginState = false;
    }

    // 右上角个人信息选项
    const handleCommand = (command) => {
      if (!state.loginState) {
        router.replace({ name: "login" });
        return message.info(`请您登录`);
      }
      if (command === "personal") {
        router.push({
          name: "personal",
          query: {
            id: userInfo.userId,
          },
        });
        message.success(`welecome to your home`);
        return;
      }
      message.info(`click on item ${command}`);
      if (command === "logout") {
        window.localStorage.removeItem("loginStatu");
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("userInfo");
        router.replace({ name: "login" });
      } else {
        router.push({ name: "comingSoon", query: {} });
      }
    };

    // 登录按钮
    const routerToLogin = () => {
      router.replace({ name: "login" });
    };
    const openSearchPop = (): void => {
      console.log("open");
      state.searchOpenClass = "open";
      state.searchCloseClass = "";
    };
    const closeSearchPop = (): void => {
      console.log("close");
      state.searchOpenClass = "";
      state.searchCloseClass = "close";
    };
    // 搜索
    const search = () => {
      if (state.keyword.split(" ").join("").length !== 0) {
        closeSearchPop();
        router.push({
          name: "search",
          query: {
            keyword: state.keyword,
          },
        });
        store.dispatch("saveSearchHistory", state.keyword);
      }
    };
    return {
      state,
      handleCommand,
      openSearchPop,
      closeSearchPop,
      routerToLogin,
      search,
      userInfo,
    };
  },
});
</script>

<style lang="scss" scoped>
$color-theme: #fa2800;
.header {
  width: 100%;
  height: 70px;
  position: fixed;
  transition: all 400ms ease-in-out;
  top: 0;
  left: 0;
  z-index: 200;
  .logo {
    width: 145px;
    height: 70px;
    display: flex;
    align-items: center;
    a {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: block;
      background: #fff center no-repeat url(~@/assets/logo/yd3.png);
      background-size: 100%;
    }
  }
  .nav {
    flex: 1;
    li {
      font-size: 14px;
      height: 100%;
      padding: 0 15px;
      a {
        position: relative;
        transition: all 0.4s;
        &.router-link-active {
          color: $color-theme;
          &::after {
            content: "";
            position: absolute;
            background: $color-theme;
            left: 0;
            right: 0;
            bottom: -12px;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            margin: 0 auto;
            opacity: 1;
          }
        }
        &:hover {
          color: $color-theme;
        }
      }
    }
  }
  .search {
    height: 100%;
    display: flex;
    align-items: center;
    i {
      font-size: 22px;
      color: #161e27;
      cursor: pointer;
    }
  }
  .userbox {
    display: flex;
    align-items: center;
    padding-left: 20px;
    position: relative;
    .line {
      height: 22px;
      background-color: #e1e1e1;
      width: 1px;
    }
    .no-login {
      font-size: 14px;
      cursor: pointer;
      &:hover {
        color: $color-theme;
      }
    }
    .is-login {
      font-size: 14px;
      cursor: pointer;
      &:hover {
        color: $color-theme;
      }
    }
    .avatar {
      margin-left: 20px;
      margin-right: 15px;
    }
  }

  .search-wrap {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    .overlay {
      width: 100%;
      height: 100vh;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(120, 129, 147, 0.22);
      opacity: 0;
      -webkit-transition: opacity 0.3s;
      transition: opacity 0.3s;
      -webkit-backface-visibility: hidden;
      -webkit-transition-duration: 0.3s;
      transition-duration: 0.3s;
    }
    .search-body {
      position: relative;
      opacity: 0;
      width: 100%;
      max-width: 790px;
      animation-duration: 0.3s;
      animation-fill-mode: forwards;
      .search-content {
        background: #fff;
        position: relative;
        border-radius: 4px;
        box-shadow: 0 10px 50px -5px rgba(6, 39, 67, 0.12);
        width: 100%;
        height: auto;
        border: 0;
        overflow: hidden;
        .search-popup-cover {
          position: relative;
          overflow: hidden;
          padding: 3rem;
          .bg-effect {
            background: url(@/assets/images/search_bg.jpg);
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            filter: blur(8px);
            .layer {
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.3);
              position: absolute;
              opacity: 1;
              top: 0;
              left: 0;
              transition: opacity 0.3s ease-in-out;
            }
          }
          .search-form {
            position: relative;
            padding: 2rem 0;
            .text {
              display: block;
              width: 100%;
              background-clip: padding-box;
              transition: border-color 0.15s ease-in-out,
                box-shadow 0.15s ease-in-out;
              font-size: 1rem;
              line-height: 1.5;
              padding: 0.625rem 0.75rem;
              height: calc(1.5rem + 1.71875rem + 2px);
              text-align: center;
              font-weight: normal;
              color: #fff;
              border-color: transparent;
              background-color: rgba(255, 255, 255, 0.03);
              transition: all 0.3s ease;
              border-radius: 5px;
              &:hover {
                background-color: rgba(255, 255, 255, 0.04);
              }
              &:focus {
                background-color: rgba(255, 255, 255, 0.04);
                border-color: transparent;
              }
              &::placeholder {
                color: #fff;
                opacity: 1;
              }
            }
          }
        }
      }
    }
    &.open {
      z-index: 1000;
      .overlay {
        opacity: 1;
        pointer-events: auto;
        backdrop-filter: blur(10px);
      }
      .search-body {
        pointer-events: auto;
        animation-name: tips-open;
      }
    }
    &.close {
      .search-body {
        animation-name: tips-close;
      }
    }

    @keyframes tips-open {
      0% {
        opacity: 0;
        transform: translate3d(0, 50px, 0);
      }
      100% {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    @keyframes tips-close {
      0% {
        opacity: 1;
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
      }
      100% {
        opacity: 0;
        -webkit-transform: translate3d(0, 50px, 0);
        transform: translate3d(0, 50px, 0);
      }
    }
  }
}

// el
>>> .el-dropdown-menu__item .el-icon-user {
  margin-right: 2px;
}

.el-dropdown-menu__item .el-icon-switch-button {
  margin-right: 2px;
}

.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: #ffffff;
  color: $color-theme;
}
</style>