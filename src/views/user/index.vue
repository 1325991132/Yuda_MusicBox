<template>
  <div>
    user 页面
    <a-auto-complete
      v-model:value="value"
      :options="options"
      style="width: 200px"
      placeholder="input here"
      @select="onSelect"
      @search="onSearch"
    />
    <detail app="detail" @change="tt">user child</detail>
  </div>

</template>
<script lang="ts">
import detail from '@/views/detail/index.vue'
import {
  defineComponent,
  ref,
  watch,
  watchEffect,
  reactive,
  readonly,
  isProxy
} from "vue";

interface MockVal {
  value: string;
}
const mockVal = (str: string, repeat = 1): MockVal => {
  return {
    value: str.repeat(repeat),
  };
};
export default defineComponent({
  setup() {

    // ----------------自动提示start-----------------
    const original = reactive({ count: 0 });

    const copy = readonly(original);
    const rdol = readonly({name:"Join"})

    watchEffect(() => {
      // 适用于响应性追踪
      console.log(rdol);
    });

    // 变更original 会触发侦听器依赖副本
    original.count++;
    console.log(isProxy(copy.count))

    // 变更副本将失败并导致警告
    // copy.count++; // 警告!
    const value = ref("");
    const options = ref<MockVal[]>([]);
    const onSearch = (searchText: string) => {
      console.log("searchText");
      options.value = !searchText
        ? []
        : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)];
    };
    const onSelect = (value: string) => {
      console.log("onSelect", value);
    };
    watch(value, () => {
      console.log("value", value.value);
    });
    // ----------------自动提示end-----------------

    const tt = ()=>{
      console.log(`123321`)
    }

    return {
      value,
      options,
      onSearch,
      onSelect,
      tt
    };
  },
  components: {
    detail
  }
});
</script>

<style scoped>
</style>