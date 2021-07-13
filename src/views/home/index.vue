<template>
    <div>
        <Banner></Banner>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Banner from '@/components/home/banner/index.vue'

export default defineComponent({
    components:{
        Banner
    },
    setup () {
        return {}
    }
})
</script>

<style scoped>

</style>