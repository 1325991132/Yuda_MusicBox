<template>
  <div class="footer">
    <div class="container">
      <div class="logo">
        <div class="a1">
          <el-backtop @click="test" :bottom="100">
            <i class="el-icon-top" style="color: #dd4f42"></i>
          </el-backtop>
        </div>
        <a class="a2" href="https://music.163.com/" target="_blank"></a>
      </div>
      <p style="color: #ccc;font-size:1rem;font-weight:700;">欢 迎 光 临 小 站</p>
      <span style="color: #ccc;font-size:0.4rem;"
        >PS: 感谢 Netease Cloud Music 提供的后台接口</span
      >
      <!-- <p style="color: #ccc;margin-top:10px;">京ICP备2021023141号-1</p> -->
    </div>
  </div>
</template>

<script >
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const test = () => {
        console.log(111)
    };
    return {
      test,
    };
  },
});
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  height: 268px;
  background-color: #161e27;
  .container {
    padding-top: 3rem;
  }
}

.logo {
  width: 200px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  .a1 {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: block;
    background: #fff center no-repeat url(~@/assets/logo/yd.png);
    background-size: 100%;
  }

  .a2 {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: block;
    background: #fff center no-repeat url(~@/assets/logo/wyy.png);
    background-size: 100%;
  }
}
</style>