<template>
  <div class="list">
    <!-- <div
      class="item"
      v-for="item of sheetList"
      :key="item.id"
      @click="toDetail(item)"
    >
      <div class="wrapper">
        <div class="cover">
          <div class="image">
            <el-image
              :key="item.picUrl + '?param=300y300'"
              :src="item.picUrl + '?param=300y300'"
              lazy
            >
              <template #placeholder>
                <div class="image-slot flex-center flex-column">
                  加载中<span class="dot">...</span>
                </div>
              </template>
              <template #error>
                <div class="image-slot flex-center">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </template>
            </el-image>
          </div>
        </div>
      </div>
      <div class="info">
        <h2 class="name ellipsis-two">
          {{ item.name }}
        </h2>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
export default {
  props: {
    sheetList: {
      type: Array,
    },
    num: {
      type: Number,
    },
  },
  setup(props) {
    console.log(props.num);
    // console.log(props.sheetList);
    const toDetail = (item) => {
      console.log(item);
    };
    return {
      toDetail,
    };
  },
};
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15px;
//   .item{
      
//   }
}
</style>