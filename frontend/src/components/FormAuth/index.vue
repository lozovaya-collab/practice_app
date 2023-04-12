<template>
  <section class="form-auth">
    <TextInput
      v-model="login"
      @update:login="login = $event"
      :type="'text'"
      :placeholder="'логин'"
    />
    <TextInput
      v-model="password"
      @update:password="password = $event"
      :type="'password'"
      :placeholder="'пароль'"
    />
  </section>
</template>

<script>
import { TextInput } from "@/components/UI";

export default {
  name: "FormAuth",
  props: ["user"],
  emits: ["update:user"],
  components: {
    TextInput,
  },
  computed: {
    login: {
      get() {
        return this.user.login;
      },
      set(value) {
        this.$emit("update:user", {
          ...this.user,
          login: value,
        });
      },
    },
    password: {
      get() {
        return this.user.password;
      },
      set(value) {
        this.$emit("update:user", {
          ...this.user,
          password: value,
        });
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
