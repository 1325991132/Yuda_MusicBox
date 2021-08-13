<template>
  <div class="personal-wrap">
    <div class="banner layer"></div>
    <div class="presonal-main container">
      <span>{{ userProfile.value.nickname }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import { getUserDetail } from "@/api/services/user";
import { useRoute } from "vue-router";
import storage from "good-storage";
import axios from "axios";

export default defineComponent({
  setup() {
    const route = useRoute();
    const userProfile: any = reactive({});
    const state: any = reactive({
      provinceName: "",
      cityName: "",
    });
    const getArea = () => {
      axios
        .get("https://restapi.amap.com/v3/config/district", {
          params: {
            key: "0f57ee7d5045187c48cd268f9d19d815",
            keywords: userProfile.province,
            subdistrict: 1,
            extensions: "base",
          },
        })
        .then((response) => {
          if (response.data.status == 1 && response.data.info == "OK") {
            let districts = response.data.districts[0];
            let subDistricts = response.data.districts[0].districts;
            state.provinceName = districts.name;
            subDistricts.map((item) => {
              if (item.adcode == userProfile.city) {
                state.cityName = item.name;
              }
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    // 获取用户信息
    const qydgetUserDetail = () => {
      let local = storage.get("userInfo", {});
      userProfile.value = local;
    };

    // 初始化
    const _initialize = () => {
      getArea();
    };

    onMounted(() => {
      let userid = route.query.id;
      console.log(1, userid);
      qydgetUserDetail();
    });
    return {
      userProfile,
      getArea,
    };
  },
});
</script>

<style lang="scss" scoped>
.personal-wrap {
  margin-top: -20px;
  .banner {
    width: 100%;
    height: 15.625rem;
    background: url("@/assets/images/music_wall.jpg");
    background-position: center;
    background-size: cover;
    background-attachment: fixed;
  }
  .personal-main {
    display: flex;
    align-items: flex-start;
    .left {
      width: 350px;
      position: relative;
      top: -60px;
      margin-right: 20px;
      .user-box {
        background: #fff;
        border-radius: 5px;
        padding-bottom: 30px;
        .background {
          width: 100%;
          height: 140px;
          position: relative;
          border-radius: 5px 5px 0 0;
          background-size: cover;
          &::before {
            border-radius: 5px 5px 0 0;
          }
        }
        .card {
          margin-top: -20px;
          padding: 0 15px 0 30px;
          width: 100%;
          .avatar {
            width: 64px;
            height: 64px;
            flex-shrink: 0;
            z-index: 2;
            position: relative;
            img {
              width: 64px;
              height: 64px;
              border-radius: 3px;
            }
          }
          .info {
            width: 100%;
            padding-top: 20px;
            margin-left: 15px;
            .name {
              font-weight: 600;
              font-size: 16px;
            }
            .sign-btn {
              padding: 3px 15px;
              font-size: 12px;
              color: #fff;
              border-radius: 30px;
              &.sign-btn-active {
                background: #fa2800;
                cursor: pointer;
                border: 1px solid #fa2800;
              }
            }
          }
        }
        .desc {
          padding: 0 40px;
          font-size: 13px;
          margin-top: 10px;
          color: #666;
        }
        .profile {
          padding: 0 40px;
          margin-top: 10px;
          .tag {
            position: relative;
            font-size: 13px;
            padding-left: 15px;
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            .lv-icon {
              font-size: 22px;
              position: relative;
              top: 1px;
            }
            .sex-icon {
              font-size: 14px;
              margin-left: 5px;
              font-weight: bold;
              &.men {
                color: #4192eb;
              }
              &.women {
                color: #f4606c;
              }
            }
            .area-icon {
              font-size: 12px;
              margin-right: 5px;
            }
            span {
              font-size: 13px;
            }
            &::before {
              content: "";
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: $color-theme;
              position: absolute;
              top: 50%;
              left: 0px;
              margin-top: -3px;
            }
          }
        }
        .follow {
          list-style: none;
          display: flex;
          margin: 0 30px;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #f9f9ff;
          li {
            width: 33%;
            text-align: center;
            font-size: 14px;
            color: #958ebb;
            span {
              display: block;
            }
          }
        }
        .foot {
          width: 100%;
          padding: 0 30px;
          margin-top: 30px;
          a {
            display: block;
            width: 50%;
            text-align: center;
            margin: 0 3% 10px 3%;
            padding: 10px 0;
            background: #ff416c;
            background: linear-gradient(to right, #ff4b2b, #ff416c);
            color: #fff;
            border-radius: 5px;
            font-size: 14px;
          }
        }
      }
    }
    .center {
      width: 640px;
      background: #fff;
      position: relative;
      margin-top: 40px;
      margin-right: 20px;
      border-radius: 5px;
      padding: 15px;
      .card-header {
        border-left: 3px solid $color-theme;
        height: 20px;
        padding-left: 1rem;
        margin-bottom: 15px;
        font-weight: bold;
        span {
          font-weight: 100;
          color: #666666;
          font-size: 12px;
        }
        .tab {
          span {
            font-size: 12px;
            cursor: pointer;
            &.active {
              color: $color-theme;
            }
          }
          .line {
            width: 1px;
            height: 13px;
            background: #999;
            display: block;
            margin: 0 10px;
          }
        }
      }
    }
    .right {
      width: 350px;
      flex-shrink: 0;
      border-radius: 5px;
      background: #fff;
      position: relative;
      padding-bottom: 30px;
      margin-top: 40px;
      .card-header {
        border-left: 3px solid $color-theme;
        height: 20px;
        padding-left: 1rem;
        margin-bottom: 15px;
        font-weight: bold;
        .icon-like {
          font-size: 20px;
        }
      }
      .module {
        padding: 15px;
        width: 100%;
        border-radius: 8px;
        margin-bottom: 20px;
      }
      .my {
        padding-bottom: 5px;
        ul {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -5px;
          li {
            flex: 0 0 14.285714285714%;
            max-width: 14.285714285714%;
            padding: 0 5px 10px;
            .avatar {
              width: 100%;
              border-radius: 3px;
              img {
                width: 100%;
                border-radius: 3px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
