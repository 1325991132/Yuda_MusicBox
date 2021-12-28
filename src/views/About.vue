<template>
  <div class="about">
    <div style="visibility:hidden;display:none;">
      <h1>This is an about page</h1>
      <h2 @click="test">my name is {{ name }},I am {{ age }} years old</h2>
      <h3>user is {{ user }}</h3>
      <a-form :model="formState" :label-col="labelCol">
        <a-form-item label="Activity name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="Activity age">
          <a-input v-model:value="formState.age" />
        </a-form-item>
        <a-form-item label="Activity hobby">
          <a-input v-model:value="hobby[0]" />
        </a-form-item>
      </a-form>
    </div>
    <div class="terminal">
      <terminal :socketURI="'ws://127.0.0.1:4100'"></terminal>
    </div>
  </div>
</template>
<script lang="ts">
/* eslint-disable */

import { reactive, Ref, ref, UnwrapRef, defineComponent, toRefs, toRef } from "vue";
import terminal from "@/views/tmn/index.vue";
interface FormState {
  name: string;
  age: number;
  hobby: Array<string> | undefined;
}
export default defineComponent({
  components:{
    terminal,
  },
  setup(props: any, context: any) {
    const user: Ref<string> = ref("qyd");
    let formState: UnwrapRef<FormState> = reactive({
      name: "qyd_reactive",
      age: 24,
      hobby: ["h1"],
    });

    let { hobby } = toRefs(formState); //转换成响应式
    const test_age = toRef(formState,"age");//转换成响应式的另一种方式

    setTimeout(() => {
      user.value = "qydnb";
      formState.hobby = ["123"];
      formState.name = 'toRefs测试--qyd';
      test_age.value = 12;
    }, 1000);

    return {
      labelCol: { span: 4 },
      name: "qyd",
      age: 18,
      handleClick: () => {
        alert(666);
      },
      user,
      formState,
      hobby,
    };
  },
});
</script>
<style lang="scss" scoped>
.about{
  padding-top: 70px;
}

</style>