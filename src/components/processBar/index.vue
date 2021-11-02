<template>
  <div class="prgress-bar-wrap" @mouseup.self="progressMouseUp($event)">
    <div class="prgress-bar" ref="progressBar" @click="progressClick">
      <div class="bar-inner">
        <div class="progress" ref="progress"></div>
        <div
          class="progress-btn"
          ref="progress-btn"
          @mousedown="progressMouseDown($event)"
          @mouseup="progressMouseUp($event)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, nextTick, ref, reactive, watch } from "vue";

export default defineComponent({
  props: {
    percent: { type: Number, default: 0 }, // 父组件传值过来的进度条位置百分比数值
  },
  setup(props, { emit }) {
    const progressBar = ref(null);
    const progress = ref(null);
    const touch = reactive({
      initiated: false,
      startX: 0,
      left: 0,
    });
    const progressBtnWidth = 12;

    const setProgressOffset = (percent) => {
      if (percent >= 0 && !touch.initiated) {
        const barWidth = progressBar.value.clientWidth - progressBtnWidth;
        const offsetWidth = barWidth * percent;
        _offset(offsetWidth);
      }
    };
    // 百分比
    watch(
      () => props.percent,
      (newVal) => {
        setProgressOffset(newVal)
      },
      { immediate: true } //首次立即执行
    );

    const progressClick = (e) => {
      nextTick(() => {
        let rect = progressBar.value.getBoundingClientRect(); //获取点击进度条位置
        let offsetWidth = e.pageX - rect.left - 6;
        _offset(offsetWidth);
        _triggerPercent();
      });
    };
    const progressMouseDown = (e) => {
      console.log("down", e);
      touch.initiated = true;
      touch.startX = e.pageX;
      touch.left = progress.value.clientWidth;
      document.onmousemove = function (e) {
        const deltaX = e.pageX - touch.startX;
        const offsetWidth = Math.min(
          progressBar.value.clientWidth - progressBtnWidth,
          Math.max(0, deltaX + touch.left)
        );
        if (offsetWidth >= progressBar.value.clientWidth - progressBtnWidth) {
          document.onmousemove = null;
          document.onmouseup = null;
          touch.initiated = false;
          _triggerPercent();
        }
        _offset(offsetWidth);
      };
    };
    const progressMouseUp = (e) => {
      if (e.button === 0) {
        //鼠标左键
        if (document.onmousemove == null) return;
        document.onmousemove = null;
        document.onmouseup = null;
        touch.initiated = false;
        _triggerPercent();
      }
    };
    const _triggerPercent = () => {
      nextTick(() => {
        emit("percentChange", _getPercent());
      });
    };
    const _getPercent = () => {
      const barWidth = progressBar.value.clientWidth - progressBtnWidth;
      console.log("barWidth", progress.value.clientWidth / barWidth);
      return progress.value.clientWidth / barWidth;
    };
    const _offset = (offsetWidth) => {
      nextTick(() => {
        progress.value.style.width = `${offsetWidth}px`;
      });
    };
    return {
      progressBar,
      progress,
      progressMouseDown,
      progressMouseUp,
      progressClick,
      setProgressOffset, //设置进度条位置
    };
  },
});
</script>

<style lang="scss" scoped>
.prgress-bar-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.prgress-bar {
  position: relative;
  background: rgba(0, 0, 0, 0.05);
  width: 100%;
  flex: 1;
  height: 3px;
  border-radius: 2px;
  cursor: pointer;
  margin: 0 25px;
  .bar-inner {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    .progress {
      width: 0;
      background: $color-theme;
      height: 3px;
      border-radius: 2px;
    }
    .progress-btn {
      position: absolute;
      z-index: 100;
      right: -12px;
      width: 12px;
      height: 12px;
      top: -4.5px;
      background: $color-theme;
      box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
      transition: all 0.3s;
      border-radius: 50%;
      &::after {
        position: absolute;
        content: "";
        top: 50%;
        left: 50%;
        width: 8px;
        height: 8px;
        background: #fdfdfd;
        border-radius: 50%;
        transform: translate(-50%, -50%);
      }
      &:hover {
        transform: scale(1.2);
      }
    }
  }
}
</style>