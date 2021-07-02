<template>
  <counter :value="`周${value}飞`" @handleIncrement="handleIncrement"></counter>
  <counter :value="`周${value}飞`" @handleIncrement="handleIncrement"></counter>
  <counter :value="`周${value}飞`" @handleIncrement="handleIncrement"></counter>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
import counter from "./counter/index.vue";

export default defineComponent({
  setup() {
    const value: Ref<number> = ref(1);
    const handleIncrement = (): void => {
      value.value++;
    };
    return {
      value,
      handleIncrement,
    };
  },
  components: { counter },
});
</script>

<style lang="scss" scoped>
</style>