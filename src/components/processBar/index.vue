<template>
  <div class="process-bar-wrap">
      <span>process</span>
    <div class="process-bar" ref="processBar">
      <div class="bar-inner">
        <div class="process" ref="process"></div>
        <div class="process-btn" ref="process-btn"></div>
      </div>
    </div>
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
.process-bar-wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  border:solid 1px red;
}

.process-bar {
  position: relative;
  width: 100;
  flex: 1;
  height: 3px;
  border-radius: 2px;
  cursor: pointer;
  margin: 0 25px;
  .bar-inner {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>