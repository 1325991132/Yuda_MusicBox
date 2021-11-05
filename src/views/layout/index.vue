<template>
  <div class="layout">
    <div class="fluid">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { onMounted } from "vue";
import utils from '@/utils'
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    onMounted(() => {
      store.commit("SET_USER_DEVICE", utils.checkUserDevice());
    });
    return {};
  },
};
</script>
<style lang="scss" scoped>
.layout {
  width: 100%;
  min-height: calc(100vh - 252px);
  z-index: 998;
  width: auto;
  min-width: 1024px;
  padding-top: 70px;
  .fluid {
    padding: 20px 0;
  }
 @media only screen and (max-width: 768px) {
    min-width: 375px;
    width:100vw;
    overflow: hidden;
  }
}

</style>