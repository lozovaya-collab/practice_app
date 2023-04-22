<template>
  <div
    class="desk"
    @drop="onDrop($event, statusId)"
    :style="{
      height: `${
        82 + (items.filter((x) => x.status_id === statusId).length - 1) * 42 + 42
      }px`,
    }"
    @dragover.prevent
    @dragenter.prevent
  >
    <div class="desk_title">
      <h4>{{ statusTitle }}</h4>
    </div>
    <div class="desk_tasks">
      <Task
        v-for="(task, index) in items.filter((x) => x.status_id === statusId)"
        :key="task.id"
        :style="{ top: `${index * 40}px` }"
        @dragstart="onDragStart($event, task)"
        @dragover="onDragOver(task)"
        :user-login="
          task.author_id === currUser.id
            ? -1
            : users.find((item) => item.id === task.author_id) &&
              users.find((item) => item.id === task.author_id).login
        "
        draggable="true"
        :task="task"
        @deleteTask="deleteTask"
        @edit="openEditPopup"
      />
      <Button
        class="desk_action-btn"
        :style="{
          top: `${items.filter((x) => x.status_id === statusId).length * 40}px`,
        }"
        @click="openCreateTask(statusId)"
        >Добавить задачу</Button
      >
    </div>
  </div>
  <CreateTaskPopup
    v-if="selectedStatus"
    :is-open="!!selectedStatus"
    @update:is-open="selectedStatus = $event"
    :statusId="selectedStatus"
    :tasks="items"
    @update:tasks="items = $event"
  />
  <EditTaskPopup
    v-if="selectedTaskId"
    :user="currUser.id"
    :tasks="items"
    @update:tasks="items = $event"
    :is-open="!!selectedTaskId"
    @update:is-open="selectedTaskId = $event"
    v-model:task-id="selectedTaskId"
    @update:task-id="selectedTaskId = $event"
  />
</template>
s

<script>
import { apiService } from "@/shared/api/swagger/swagger";

// импорт компонента Task
import Task from "@/components/Task";
import { Button } from "@/components/UI";
import CreateTaskPopup from "@/components/Task/CreateTaskPopup";
import EditTaskPopup from "@/components/Task/EditTaskPopup";

export default {
  name: "Desk",
  // входные параметры
  props: ["tasks", "statusId", "statusTitle", "users"],
  components: {
    Task,
    Button,
    CreateTaskPopup,
    EditTaskPopup,
  },
  data: () => {
    return {
      items: [],
      currTask: null,
      isOpenCreateTask: false,
      selectedStatus: null,
      currUser: null,
      selectedTaskId: false,
    };
  },
  // отслеживание изменений переменной items и входного параметра tasks
  watch: {
    tasks: {
      handler() {
        this.items = this.tasks;
      },
      deep: true,
    },
    items: {
      handler() {
        this.$emit("update:tasks", this.items);
      },
      deep: true,
    },
  },
  methods: {
    openCreateTask(statusId) {
      this.selectedStatus = statusId;
      this.selectedTaskId = null;
    },
    onDragStart(event, task) {
      event.dataTransfer.dropEffect = "none";
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("taskId", task.id.toString());
    },
    onDrop(event, statusId) {
      event.dataTransfer.dropEffect = "move";
      const taskId = parseInt(event.dataTransfer.getData("taskId"));
      this.items.value = this.items.map((x) => {
        if (x.id == taskId) {
          this.addTaskToArray(this.currTask, x, this.items);
          x.status_id = statusId;

          apiService.tasks.Update(x.id, {
            status_id: x.status_id,
            description: x.description,
            title: x.title,
          });
        }
        return x;
      });
    },
    onDragOver(task) {
      this.currTask = task;
    },
    addTaskToArray(inputTask, pointerTask, arr) {
      const index = arr.findIndex((el) => el.id === pointerTask.id);

      return index !== -1
        ? [...arr.slice(0, index + 1), inputTask, ...arr.slice(index + 1)]
        : arr;
    },
    deleteTask(id) {
      if (id)
        apiService.tasks.Delete(id).then(() => {
          apiService.tasks.Get().then((res) => {
            this.items = res.data;
          });
        });
    },
    openEditPopup(payload) {
      this.selectedTaskId = payload.id;
      this.selectedStatus = null;
    },
  },
  // инициализация items при отрисовке компонента Desk
  beforeMount() {
    this.items = this.tasks;
    const currentUser = localStorage.getItem("user");

    this.currUser = currentUser && JSON.parse(currentUser);
  },
};
</script>

<style lang="scss"></style>
