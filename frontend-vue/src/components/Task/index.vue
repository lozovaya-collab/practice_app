<template>
  <div class="desk_tasks__item">
    <div class="task-wrapper">
      <div class="task-wrapper_container">
        <p v-if="userLogin !== -1" class="task-wrapper_container__login">
          {{ userLogin }}
        </p>
      </div>

      <h5 @click="$emit('edit', { id: task.id, isOpen: true })" class="task-wrapper_name">
        {{ task.title }}
      </h5>

      <div
        @click="$emit('deleteTask', userLogin === -1 ? null : task.id)"
        class="task-wrapper_container"
      >
        <img
          v-if="userLogin === -1"
          class="task-wrapper_container__icon"
          src="@/assets/images/delete.png"
          alt="del"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Task",
  props: ["task", "userLogin"],
};
</script>

<style lang="scss"></style>
