<template>
  <div class="recommend-songs container">
    <h2 class="title">推荐歌单</h2>
    <song-sheet :sheetList="personalizeds"></song-sheet>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue';
import {getPersonalized} from '@/api/services/api'
import songSheet from "@/components/songSheet/index.vue"
export default {
  setup() {
    const state = reactive({
        limit:24,
        personalizeds:[]
    })
    const qydgetPersonalized =async  ()=>{
        try{
            let res = await getPersonalized(state.limit)
            state.personalizeds = res.result
            // console.log('res.result',res.result)//推荐歌单列表
        }catch(err){
            console.log(err)
        }
    }
    onMounted(()=>{
        qydgetPersonalized()
    })
    return {
        ...toRefs(state)
    };
  },
  components:{
      songSheet
  }
};
</script>

<style lang="scss" scoped>
.recommend-songs {
  margin-top: 40px;
  .title {
    margin: 0 0 15px 0;
    text-align: left;
    font-weight: bold;
  }
}
</style>