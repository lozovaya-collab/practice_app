<template>
  <Popup v-model:dialog="isOpenEditTask">
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
import { mapState, mapMutations } from "vuex";
import { apiService } from "../../../shared/api/swagger/swagger";

import ContentPopup from "../ContentPopup";
import { Popup, Button } from "@/components/UI";

export default {
  name: "EditTaskPopup",
  props: ["taskId", "tasks", "user"],
  emits: ["update:taskId"],
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
    ...mapState({
      isOpenEditTask: (state) => state.tasks.isOpenEditTask,
    }),
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
    ...mapMutations({
      setOpenEditTask: "tasks/SET_IS_OPEN_EDIT_TASK",
    }),
    closePopup() {
      this.setOpenEditTask(false);
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
