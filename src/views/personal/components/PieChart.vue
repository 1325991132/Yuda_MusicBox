<template>
  <div
    :class="className"
    :style="{ width, height }"
    id="homePieCharts"
    ref="homePieCharts"
  ></div>
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref,
  watch,
} from "vue";
import resize from "@/components/charts/mixins/resize";
import { init, EChartsOption } from "echarts";
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
    const { chart, mounted, beforeDestroy, activated, deactivated } = resize();
    const tootipParams = ref({});
    const showTooltip = (params) => {
      tootipParams.value = params;
      let htmlStr = `
      <div class="tootipwrap">
        <div class="tag-wrap">
          <div class="tag">
            <div class="block"></div>
            <span class="msg">测试数据</span>
          </div>
          <div class="tag">
            <div class="block"></div>
            <span class="msg">测试数据</span>
          </div>
          <div class="tag">
            <div class="block"></div>
            <span class="msg">测试数据</span>
          </div>
        </div>
        <div class="btn-wrap">
          <button id="btn-marker1" class="pie-btn">标记红色<button/>
          <button id="btn-marker2" class="pie-btn">标记蓝色<button/>
        </div>
      </div>
      `;
      return htmlStr;
    };
    watch(tootipParams, (n: any) => {
      let handleClick = () => {
        let { name, value, percent } = n;
        let data = { name, value, percent };
        console.log(`send data ${data.name},${data.value},${data.percent}`);
      };
      document
        .querySelector("#btn-marker1")
        ?.addEventListener("click", handleClick);
      document
        .querySelector("#btn-marker2")
        ?.addEventListener("click", handleClick);
      
      let msgarr = document.querySelectorAll(".msg");
      let dotarr:any = document.querySelectorAll(".block");
      msgarr[0].innerHTML = "当前资源名称：" + n.name;
      msgarr[1].innerHTML = "资源内容：" + n.value;
      msgarr[2].innerHTML = "资源占比：" + n.percent;

      dotarr.forEach(item=>{
        item.style.background = n.color;
      })
      document.styleSheets[0].insertRule(".tag::before{background:blue}", 0); //当前颜色修改不生效
    });
    const initChart = () => {
      const pieChart = init(
        document.getElementById("homePieCharts") as HTMLDivElement,
        "macarons"
      );
      pieChart.setOption({
        tooltip: {
          trigger: "item",
          triggerOn: "click",
          enterable: true,
          show: true,
          formatter: showTooltip,
        },
        legend: {
          left: "center",
          bottom: "10",
          data: ["Industries", "Technology", "Forex", "Gold", "Forecasts"],
        },
        series: [
          {
            color: ["#435EBE", "#5DDAB4", "#9694FF", "#FF7976", "#57CAEB"],
            name: "WEEKLY WRITE ARTICLES",
            type: "pie",
            roseType: "radius",
            radius: [15, 95],
            center: ["50%", "38%"],
            data: [
              { value: 320, name: "Industries" },
              { value: 240, name: "Technology" },
              { value: 149, name: "Forex" },
              { value: 100, name: "Gold" },
              { value: 59, name: "Forecasts" },
            ],
            animationEasing: "cubicInOut",
            animationDuration: 2600,
          },
        ],
      } as EChartsOption);

      chart.value = pieChart;
    };

    onMounted(() => {
      mounted();
      nextTick(() => {
        initChart();
      });
    });

    onBeforeUnmount(() => {
      beforeDestroy();
    });

    onActivated(() => {
      activated();
    });

    onDeactivated(() => {
      deactivated();
    });
    return {};
  },
});
</script>

<style lang="scss" scoped>
::v-deep(.tootipwrap) {
  .tag-wrap {
    // .tag {
    //   position: relative;
    //   display: flex;
    //   align-items: center;
    //   padding-left: 15px;
    //   font-size: 13px;
    //   &::before {
    //     content: "";
    //     position: absolute;
    //     width: 6px;
    //     height: 6px;
    //     background: red;
    //     border-radius: 50%;
    //     left: 0;
    //     top: 50%;
    //     margin-top: -3px;
    //   }
    // }
    .tag {
      position: relative;
      display: flex;
      align-items: center;
      padding-left: 15px;
      font-size: 0.8125rem;
      .block {
        width: 6px;
        height: 6px;
        background: red;
        border-radius: 50%;
        display: inline-block;
        margin-right: 10px;
      }
    }
  }
  .btn-wrap {
    display: flex;
    margin-top: 30px;
    justify-content: space-around;
    align-items: center;
    .pie-btn {
      border-radius: 5px;
      width: auto;
      border: 1px solid #ccc;
      padding: 5px 10px;
      &::after {
        content: "";
        width: 100%;
        height: 100%;
        background-color: #fff;
        opacity: 0;
      }
      &:active {
        background: #ccc;
      }
    }
  }
}
</style>