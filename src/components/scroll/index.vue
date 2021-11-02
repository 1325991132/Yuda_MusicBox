<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from "vue";
import BScroll from "better-scroll";
export default defineComponent({
  props: {
    probeType: {
      type: Number,
      default: 1,
    },
    click: {
      type: Boolean,
      default: false,
    },
    listenScroll: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: null,
    },
    pullup: {
      type: Boolean,
      default: false,
    },
    beforeScroll: {
      type: Boolean,
      default: false,
    },
    refreshDelay: {
      type: Number,
      default: 20,
    },
    direction: {
      type: String,
      default: "vertical",
    },
  },
  setup(props, { emit }) {
    const DIRECTION_H = "horizontal";
    const DIRECTION_V = "vertical";
    const wrapper = ref(null);
    let scroll = null;
    onMounted(() => {
      setTimeout(() => {
        _initScroll();
      }, 20);
    });
    const _initScroll = () => {
      console.log("init start");
      if (!wrapper.value) return;
      scroll = new BScroll(wrapper.value, {
        probeType: props.probeType,
        click: props.click,
        mouseWheel: true,
        eventPassthrough:
          props.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V,
      });
      console.log("332211");
      console.log("scroll", scroll);

      if (props.listenScroll) {
        scroll.on("scroll", (pos) => {
          console.log("pos", pos);
          emit("scroll", pos);
        });
      }

      if (props.pullup) {
        scroll.on("scrollEnd", () => {
          if (scroll.y <= scroll.maxScrollY + 50) {
            emit("scrollToEnd");
          }
        });

        if (props.beforeScroll) {
          scroll.on("beforeScrollStart", () => {
            emit("beforeScroll");
          });
        }
      }
      console.log("scroll init ok");
    };

    // 刷新scroll
    const refresh = () => {
      console.log('refresh刷新')
      scroll && scroll.refresh();
    };

    //禁用
    const disable = () => {
      scroll && scroll.disable();
    };
    //启用
    const enable = () => {
      scroll && scroll.enable();
    };
    // 相对于当前位置偏移滚动 x,y 的距离
    const scrollTo = function () {
      scroll && scroll.scrollTo.apply(scroll, arguments);
    };
    //滚动到指定的目标元素
    const scrollToElement = function () {
      console.log("scroll -----", scroll);
      scroll && scroll.scrollToElement.apply(scroll, arguments);
    };

    watch(
      () => props.data,
      () => {
        setTimeout(() => {
          refresh();
        }, props.refreshDelay);//不加延时scroll标签会有无法滚动的问题
      }
    );
    return {
      wrapper, //scroll dom
      refresh, //刷新
      disable, //禁用
      enable, //启用
      scroll, //滚动区域
      scrollTo, //相对于当前位置偏移滚动 x,y 的距离
      scrollToElement, //滚动到指定的目标元素
    };
  },
});
</script>

<style scoped>
</style>