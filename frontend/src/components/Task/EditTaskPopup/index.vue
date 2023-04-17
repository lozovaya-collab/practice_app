<template>
  <Popup v-model:dialog="isDialog">
    <template v-slot:title> Редактировать задачу </template>
    <template v-slot:content>
      <ContentPopup v-bind:newTask="task" @update:newTask="task = $event" />
    </template>
    <template v-slot:actions>
      <Button :type="'text'" @click="closePopup">ОТМЕНА</Button>
      <Button @click="saveTask" v-if="task && task.author_id === user">СОХРАНИТЬ</Button>
    </template>
  </Popup>
</template>

<script>
import { apiService } from "../../../shared/api/swagger/swagger";

import ContentPopup from "../ContentPopup";
import { Popup, Button } from "@/components/UI";

export default {
  name: "EditTaskPopup",
  props: ["taskId", "tasks", "user", "isOpen"],
  emits: ["update:taskId", "update:isOpen"],
  components: {
    ContentPopup,
    Popup,
    Button,
  },
  data() {
    return {
      task: null,
      id: null,
    };
  },
  computed: {
    isDialog: {
      get() {
        return this.isOpen;
      },
      set(value) {
        this.$emit("update:isOpen", value);
      },
    },
  },
  watch: {
    taskId(value) {
      this.id = value;
    },
    id(value) {
      if (value)
        apiService.tasks.GetById(value).then((res) => {
          this.task = res.data;
        });
    },
  },
  methods: {
    closePopup() {
      this.task = null;
      this.isDialog = false;
    },
    saveTask() {
      apiService.tasks
        .Update(this.task.id, {
          status_id: this.task.status_id,
          description: this.task.description,
          title: this.task.title,
        })
        .then(() => {
          apiService.tasks
            .Get()
            .then((res) => {
              this.$emit("update:tasks", res.data);
            })
            .then(() => {
              this.closePopup();
            });
        });
    },
  },
  mounted() {
    this.id = this.taskId;
  },
};
</script>

<style lang="scss" scoped></style>
