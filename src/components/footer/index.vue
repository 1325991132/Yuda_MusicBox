<template>
    <div class="footer">
        <div class="container">
            <p class="title">ydmusic</p>
            <!-- <p class="desc">
                ydmusic
            </p> -->
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup () {
        return {}
    }
})
</script>

<style lang="scss" scoped>
.footer{
    width:100%;
    height:268px;
    background-color: #161e27;
    .container{
        padding:3rem;
    }
}

</style>