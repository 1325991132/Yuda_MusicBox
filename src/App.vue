<template>
  <div id="nav">
    <my-header
      v-if="$route.meta.isLogin ? false : $route.meta.is404 ? false : true"
    >
    </my-header>
    <router-view
      v-slot="{ Component }"
      :key="
        $route.query.id
          ? $route.path + $route.query.id
          : $route.query.keyword
          ? $route.path + $route.query.keyword
          : $route.path
      "
    >
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
    <my-footer
      v-if="$route.meta.isLogin ? false : $route.meta.is404 ? false : true"
    ></my-footer>
    <player-bar v-if="!$route.meta.isLogin"></player-bar>

    <div class="fly bg-fly-circle1"></div>
    <div class="fly bg-fly-circle2"></div>
    <div class="fly bg-fly-circle3"></div>
    <div class="fly bg-fly-circle4"></div>
  </div>
</template>
<script>
// import { useRouter, useRoute, RouteLocationNormalized } from "vue-router";

import myHeader from "@/components/header/index.vue";
import playerBar from "@/components/playerBar/index.vue";
import myFooter from "@/components/footer/index.vue";
export default {
  components: {
    myHeader,
    playerBar,
    myFooter,
  },
  setup() {
    // const route: RouteLocationNormalized = useRoute();
    return {};
  },
};
</script>
<style lang="scss">
#app {
  background-color: #f5f5f5;
  // background: url("@/assets/images/music_wall.jpg");
  background: linear-gradient(
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0.9)
    ),
    url("@/assets/images/music_wall.jpg") no-repeat 0 0/ 100% 100%;
  background-attachment: fixed;
}

@media only screen and (max-width: 768px) {
  #app {
    background-color: #f5f5f5;
    // background: url("@/assets/images/music_wall.jpg");
    background: linear-gradient(
        rgba(255, 255, 255, 0.8),
        rgba(255, 255, 255, 0.9)
      ),
      url("@/assets/images/wall_mobile.jpg") no-repeat 0 0/ 100% 100%;
    background-attachment: fixed;
  }
}

.fly {
  pointer-events: none;
  position: fixed;
  z-index: 100;
}
.bg-fly-circle1 {
  left: 40px;
  top: 100px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(
    to right,
    rgba(190, 84, 239, 0.07) 0%,
    rgba(236, 33, 226, 0.04) 100%
  );
  animation: move 2.5s linear infinite;
}

.bg-fly-circle2 {
  left: 3%;
  top: 60%;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(
    to right,
    rgba(84, 130, 239, 0.08) 0%,
    rgba(48, 33, 236, 0.04) 100%
  );
  animation: move 3s linear infinite;
}

.bg-fly-circle3 {
  right: 2%;
  top: 140px;
  width: 145px;
  height: 145px;
  border-radius: 50%;
  background: linear-gradient(
    to right,
    rgba(115, 239, 84, 0.287) 0%,
    rgba(33, 236, 158, 0.04) 100%
  );
  animation: move 2.5s linear infinite;
}

.bg-fly-circle4 {
  right: 5%;
  top: 60%;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: linear-gradient(
    to right,
    rgba(239, 84, 200, 0.09) 0%,
    rgba(236, 33, 33, 0.04) 100%
  );
  animation: move 3.5s linear infinite;
}

@keyframes move {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(25px);
  }

  100% {
    transform: translateY(0px);
  }
}
</style>
