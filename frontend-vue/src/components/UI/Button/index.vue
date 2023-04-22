<template>
  <button
    :class="[
      'button',
      { 'button--text': type === 'text' },
      { 'button--disabled': disabled },
    ]"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "Button",
  props: {
    type: {
      type: String,
      default: "default",
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/main.scss";
.button {
  box-sizing: border-box;
  padding: 5px 10px;
  height: 30px;
  min-width: 130px;
  cursor: pointer;
  border-radius: 5px;
  outline: none;
  border: none;
  background-color: $purple;
  color: $white;
  &--text {
    min-width: 30px;
    background-color: $white;
    color: $purple;
    &:hover {
      text-decoration: underline;
    }
  }
}
button:disabled {
  opacity: 0.5;
}
</style>
