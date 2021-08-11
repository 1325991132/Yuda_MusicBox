<template>
  <div
    :class="className"
    :style="{ width, height }"
    id="homePieCharts"
    ref="homePieCharts"
  ></div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onActivated, onBeforeUnmount, onDeactivated, onMounted, ref } from "vue";
import resize from "@/components/charts/mixins/resize";
import { init,EChartsOption } from "echarts";
export default defineComponent({
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
      required: true,
    },
    height: {
      type: String,
      default: "300px",
      required: true,
    },
  },
  setup() {
    const { chart, mounted, beforeDestroy, activated, deactivated } =
      resize();
    const initChart = () => {
      const pieChart = init(document.getElementById('homePieCharts') as HTMLDivElement, "macarons");
      pieChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
        },
        series: [
          {
            color: ['#435EBE', '#5DDAB4', '#9694FF', '#FF7976', '#57CAEB'],
            name: 'WEEKLY WRITE ARTICLES',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              { value: 320, name: 'Industries' },
              { value: 240, name: 'Technology' },
              { value: 149, name: 'Forex' },
              { value: 100, name: 'Gold' },
              { value: 59, name: 'Forecasts' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      } as EChartsOption)
      chart.value = pieChart
    };

    onMounted(() => {
      mounted();
      nextTick(() => {
        initChart();
      });
    });

    onBeforeUnmount(()=>{
      beforeDestroy()
    })

    onActivated(()=>{
      activated()
    })

    onDeactivated(()=>{
      deactivated()
    })
    return {};
  },
});
</script>

<style scoped>
</style>