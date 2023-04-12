<template>
  <v-header>
    <div class="header">
      <h1>TO DO APP</h1>
      <Button @click="logout">ВЫХОД</Button>
    </div>
  </v-header>
</template>

<script>
import { Button } from "@/components/UI";

import { apiService } from "../shared/api/swagger/swagger";

export default {
  name: "MainHeader",
  components: {
    Button,
  },
  methods: {
    logout() {
      apiService.logout.Logout();

      this.$router.push({ name: "Authorization" });
    },
  },
};
</script>

<style lang="scss" scoped></style>
