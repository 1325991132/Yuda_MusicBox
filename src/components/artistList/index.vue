<template>
  <div class="artist-box">
      <div class="tool-head">
          <div class="item play-item">
              <i class="iconfont niceOutlined_Play"></i>播放全部
          </div>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,onMounted } from "vue";

export default defineComponent({
  props: {
    songs:{
        type:Array
    }  
  },
  setup(props) {
    return {
    };
  },
});
</script>

<style lang="scss" scoped>
$color-theme: red !global;

.artist-box{
    width:100%;
    .tool-head{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin:0.9375rem 0;
        .item{
            background: #f2f2f2;
            color:#333;
            padding:0.4375rem 0.9375rem;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.4s;
            i{
                margin-right: 0.3125rem;
            }
        }
        .play-item{
            background-color: $color-theme;
            color:#fff;
        }
    }
}
</style>