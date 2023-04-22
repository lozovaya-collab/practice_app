<template>
  <div class="auth-page">
    <div class="auth-page_form">
      <div class="auth-page_form__header">
        <img
          class="auth-page_form__header icon"
          src="@/assets/images/mountain.png"
          alt="Icon ToDo App"
        />
        <div class="header">
          <h1 class="auth-page_form__header text">
            {{ isSignUp ? "Регистрация" : "Вход" }}
          </h1>
        </div>

        <p :class="['auth-page_form__header', { message: mess }, { error: err }]">
          {{ mess ? mess : err }}
        </p>
      </div>
      <FormAuth v-model:user="user" @update:user="user = $event" />
      <div class="auth-page_form__actions">
        <Button @click="submit" :disabled="isDisabled">{{
          isSignUp ? "ЗАРЕГИСТРИРОВАТЬСЯ" : "ВОЙТИ"
        }}</Button>
        <Button v-if="!isSignUp" :type="'text'" @click="toSignUpForm">
          Зарегистрироваться
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { Button } from "@/components/UI";
import FormAuth from "@/components/FormAuth";

import { apiService } from "../../shared/api/swagger/swagger.js";

export default {
  name: "AuthPage",
  components: {
    FormAuth,
    Button,
  },
  data() {
    return {
      isSignUp: false,
      isLoading: false,
      mess: null,
      err: null,
      user: {
        login: null,
        password: null,
      },
    };
  },
  computed: {
    isDisabled() {
      return (!this.user.login || !this.user.password) && !this.isLoading;
    },
  },
  methods: {
    toSignUpForm() {
      this.isSignUp = true;

      this.user = {
        login: null,
        password: null,
      };
    },
    submit() {
      return this.isSignUp ? this.signUp() : this.logIn();
    },
    signUp() {
      this.isLoading = true;
      console.log(this.user);
      apiService.users
        .Create({ ...this.user })
        .then(() => {
          this.mess = "вы успешно зарегистрировались!";
          setTimeout(() => {
            this.$router.push({ name: "ToDo App" });
            this.isLoading = false;
            this.mess = null;
          }, 1000);
        })
        .catch(() => {
          this.err = "ошибка!!";

          setTimeout(() => {
            this.user = {
              login: null,
              password: null,
            };

            this.err = null;
          });
        }, 1000);
    },
    logIn() {
      this.isLoading = true;

      apiService.login
        .Login(this.user)
        .then(() => {
          setTimeout(() => {
            this.$router.push({ name: "ToDo App" });
            this.isLoading = false;
            this.mess = null;
          }, 1000);
        })
        .catch((err) => {
          this.err = err.message;

          setTimeout(() => {
            this.user = {
              login: null,
              password: null,
            };

            this.err = null;
          }, 2000);
        });
    },
  },
  mounted() {
    this.isSignUp = false;
  },
};
</script>

<style lang="scss" scoped></style>
