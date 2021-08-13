<template>
  <div class="personal-editor-container">
    此界面为个人首页（数据为测试数据）
    <PenelGroup @handle-set-line-chart-data="handleSetLineChartData" />
    <el-row
      style="
        background: #fff;
        padding: 16px 16px 0;
        margin-bottom: 32px;
        border-radius: 8px;
      "
    >
      <LineChart
        :chart-data="lineChartData"
        :width="'100%'"
        :height="'350px'"
      />
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <RadarChart width="100%" height="300px" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <PieChart width="100%" height="300px"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <BarChart width="100%" height="300px" />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="8">
      <el-col>
        
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import PenelGroup from "./components/PenelGroup.vue";
import LineChart from "./components/LineChart.vue";
import RadarChart from "./components/RadarChart.vue";
import PieChart from "./components/PieChart.vue";
import BarChart from "./components/BarChart.vue";

export default defineComponent({
  components: {
    PenelGroup,
    LineChart,
    RadarChart,
    PieChart,
    BarChart,
  },
  setup() {
    const data = {
      newVisitis: {
        expectedData: [100, 120, 161, 134, 105, 160, 165],
        actualData: [120, 82, 91, 154, 162, 140, 145],
      },
      messages: {
        expectedData: [200, 192, 120, 144, 160, 130, 140],
        actualData: [180, 160, 151, 106, 145, 150, 130],
      },
      purchases: {
        expectedData: [80, 100, 121, 104, 105, 90, 100],
        actualData: [120, 90, 100, 138, 142, 130, 130],
      },
      shoppings: {
        expectedData: [130, 140, 141, 142, 145, 150, 160],
        actualData: [120, 82, 91, 154, 162, 140, 130],
      },
    };
    const lineChartData = ref(data.newVisitis);
    const handleSetLineChartData = (type: string) => {
      console.log(type);
      lineChartData.value = data[type];
    };
    return {
      lineChartData,
      handleSetLineChartData,
    };
  },
});
</script>

<style lang="scss" scoped>
.personal-editor-container {
  padding: 32px;
  position: relative;
  border: solid 1px #ff002223;
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
    border-radius: 8px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>