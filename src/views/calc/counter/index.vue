<template>
    <div @click="handleClick">
        value is {{value}},count is {{count}}
    </div>
</template>

<script lang="ts">
import { defineComponent,ref,Ref } from 'vue'

export default defineComponent({
    props:{
      value:String  
    },
    setup (props:any,{emit}) {
        const count:Ref<number> = ref(0)
        const handleClick = ()=>{
            count.value++
            emit("handleIncrement")
        }
        return {
            count,
            handleClick
        }
    }
})
</script>

<style scoped>

</style>