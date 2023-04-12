<template>
  <v-app>
    <MainHeader v-if="$route.path !== '/auth'" />
    <MainContent />
  </v-app>
</template>

<script>
import { MainHeader, MainContent } from "@/layouts";

export default {
  name: "App",
  components: {
    MainHeader,
    MainContent,
  },
};
</script>

<style lang="scss">
@import "@/assets/scss/main.scss";
</style>
