<template>
  <div @click='handleClick'>------------ user detail ------------</div>
</template>

<script lang="ts">
/* eslint-disable */

import { defineComponent, h } from "vue";

export default defineComponent({
  setup(props, context) {
    const { attrs, slots, emit } = context;
    // console.log('attrs',attrs)
    //   console.log('slots',slots.default);
    console.log('emit',emit)
    const handleClick = ()=>{
        emit("change")
    }
    return {
        handleClick
    };
  },
  mounted(){
    //   this.$emit("change")
  }
});
</script>

<style scoped>
</style>