<template>
  <div class="playlist-detail container">
    <div class="left shadow">
      <div class="top">
        <div class="avatar">
          <img
            ref="avatar"
            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
          />
        </div>
        <div class="info">
          <div class="title flex-between">
            <span>-----------</span>
            <div></div>
          </div>
          <div class="user flex-row">
            <div class="avatar">
              <img
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                alt=""
              />
            </div>
            <p>name</p>
            <p>2021 08 20</p>
          </div>
          <div class="tag flex-row">标签:<a>标签1</a></div>
          <div></div>
        </div>
      </div>
    </div>
    <div class="right shadow"></div>
  </div>
</template>

<script>
import { onMounted } from "@vue/runtime-core";
import { useRouter, useRoute } from "vue-router";
export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    let id = "";
    onMounted(() => {
      id = route.query.id;
    });
    return {};
  },
};
</script>

<style lang="scss" scoped>
.playlist-detail {
  display: flex;
  align-items: flex-start;
  .left {
    flex: 1;
    width:59.375rem;
    padding:15px;
    border-radius: 8px;
    margin-right: 20px;
    .top{
        display: flex;
        > .avatar{
            width:12.5rem;
            height:12.5rem;
            margin-right: 30px;
            border-radius: 8px;
            border:solid 1px blue;
            img{
                width:100%;
                height:100%;
                border-radius: 8px;
                position:relative;
                &::before{
                    content:"";
                    position:absolute;
                    width: 95%;
                    height: 95%;
                    display: block;
                    top:15px;
                    right:-5px;
                    z-index: 0;
                    background: rgba(0,0,0,0.2);
                    border-radius: 8px;
                }
            }
        }
        .info{
            border:solid 1px red;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .title{
                width:100%;
                font-size: 24px;
                font-weight: 700;
                margin-top: 10px;
                margin-bottom: 20px;
                overflow: hidden;
            }
            .tag{
                
            }
        

        }
    }
  }
  .right {
    width: 350px;
    border: solid 1px red;
  }
}
</style>