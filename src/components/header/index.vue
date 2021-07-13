<template>
  <div class="header shadow">
    <div class="container flex-row">
      <div class="logo">
        <router-link :to="{ name: 'home' }" tag="a"></router-link>
      </div>
    </div>
    <ul class="nav flex-row">
      <li>
        <router-link :to="{ name: 'calc' }" tag="a">发现音乐</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'home' }" tag="a">排行榜</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'home' }" tag="a">歌单</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'home' }" tag="a">歌手</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'home' }" tag="a">视频</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'home' }" tag="a">MV</router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
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
          color: red;
          &::after {
            color: red;
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: -12px;
            height: 5px;
            width: 5px;
            border-radius: 50%;
            margin: 0 auto;
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>