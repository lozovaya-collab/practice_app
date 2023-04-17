<template>
  <!--Доски с задачами-->
  <div class="todo-app">
    <!--Компонент Desk, куда передается: 
      categories - массив с названием категории и id
      tasks - массив с названием задач, id и id категории -->
    <Desk
      v-for="status in statuses"
      :key="status.id"
      v-bind:statusId="status.id"
      v-bind:statusTitle="status.name"
      v-bind:tasks="tasks"
      @update:tasks="tasks = $event"
      v-bind:users="users"
    />
  </div>
</template>

<script>
import { apiService } from "../../shared/api/swagger/swagger";

import Desk from "@/components/Desk";

export default {
  name: "HomePage",
  components: {
    Desk,
  },
  data: () => {
    return {
      statuses: [
        {
          id: 1,
          name: "сделать",
        },
        {
          id: 2,
          name: "в процессе",
        },
        {
          id: 3,
          name: "закончено",
        },
      ],
      tasks: [],
      users: [],
    };
  },
  mounted() {
    apiService.tasks.Get().then((res) => {
      this.tasks = res.data;
    });

    apiService.users.Get().then((res) => {
      this.users = res.data;
    });
  },
};
</script>

<style lang="scss" scoped></style>
