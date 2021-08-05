<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <img :src="visits" alt="visits" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">New Visits</div>
          <CountTo
            ref="myCount"
            :start-val="0"
            :end-val="102400"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-people">
          <img :src="messages" alt="messages" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Messages</div>
          <CountTo
            ref="myCount"
            :start-val="0"
            :end-val="81212"
            :duration="3000"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-people">
          <img :src="purchases" alt="purchases" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Purchases</div>
          <CountTo
            ref="myCount"
            :start-val="0"
            :end-val="9280"
            :duration="3200"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-people">
          <img :src="shoppings" alt="shoppings" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">Shoppings</div>
          <CountTo
            ref="myCount"
            :start-val="0"
            :end-val="13600"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { CountTo } from "vue3-count-to";
import visits from "@/assets/images/visits.png";
import messages from "@/assets/images/messages.png";
import purchases from "@/assets/images/purchases.png";
import shoppings from "@/assets/images/shoppings.png";
export default {
  components: {
    CountTo,
  },
  emits:["handle-set-line-chart-data"],
  setup(_,{emit}) {
    const handleSetLineChartData = (type:string)=>{
        emit('handle-set-line-chart-data',type)
    }
    return {
      visits,
      messages,
      purchases,
      shoppings,
      handleSetLineChartData
    };
  },
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
    .card-panel {
      height: 124px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      border-radius: 10px;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
      img {
        width: 60px;
        height: 60px;
      }
      .card-panel-icon-wrapper {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 32px;
        transition: all 0.38s ease-out;
      }
      .icon-people {
        color: #40c9c6;
      }
      .card-panel-description {
        position: absolute;
        right: 32px;
        top: 50%;
        transform: translateY(-50%);
        font-weight: bold;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
}
</style>