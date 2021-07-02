<template>
  <div class="home">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/user/123">user</router-link>
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="TO DO LIST" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "@/components/HelloWorld/index.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Home",
  components: {
    HelloWorld,
  },
});
</script>

<style lang="scss">
</style>