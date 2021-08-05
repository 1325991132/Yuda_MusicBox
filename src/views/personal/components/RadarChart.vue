<template>
  <div
    id="homeRadarCharts"
    ref="homeRadarCharts"
    :class="className"
    :style="{ width, height }"
  >
    RadarChart
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "300px",
    },
  },
  setup() {
    return {};
  },
});
</script>

<style scoped>
</style>