<template>
  <h2 @click="handleClickProp">来自父组件传递的值为{{ msg_from_father }}--{{value}}</h2>
  <div class="useript_wrapper">
    <a-input v-model:value="incident"></a-input>
    <a-button @click="add_incident" type="primary">提交</a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, reactive, Ref, ref } from "vue";
export default {
  props: ["name","value"],
  emits: ["listchange"],
  setup(props: any, context: any) {
    console.log("我接受到的名称为", props.name,props.value);
    let msg_from_father: any = inject("name");
    let changeName: any = inject("changeName");
    const handleClickProp = () => {
      changeName("qyd");
      // msg_from_father.value = 'qud123'
    };

    const { emit } = context;
    const incident: Ref<string> = ref("");
    const add_incident = (): void => {
      emit("listchange", incident.value);
      incident.value = "";
    };

    return {
      incident,
      add_incident,
      msg_from_father,
      handleClickProp,
    };
  },
};
</script>

<style lang="scss" scoped>
.useript_wrapper {
  display: flex;
  width: 100%;
}
</style>