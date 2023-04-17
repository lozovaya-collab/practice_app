<template>
  <Popup v-model:dialog="isDialog">
    <template v-slot:title> Создать задачу </template>
    <template v-slot:content>
      <ContentPopup v-bind:newTask="task" @update:newTask="task = $event" />
    </template>
    <template v-slot:actions>
      <Button :type="'text'" @click="closePopup">ОТМЕНА</Button>
      <Button @click="saveTask">СОХРАНИТЬ</Button>
    </template>
  </Popup>
</template>

<script>
import { apiService } from "../../../shared/api/swagger/swagger";

import ContentPopup from "../ContentPopup";
import { Popup, Button } from "@/components/UI";

export default {
  name: "CreateTaskPopup",
  props: ["statusId", "tasks", "isOpen"],
  components: {
    ContentPopup,
    Popup,
    Button,
  },
  data() {
    return {
      task: null,
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
  methods: {
    closePopup() {
      this.task = null;
      this.isDialog = false;
    },
    saveTask() {
      apiService.tasks.Create(this.task).then(() => {
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
    this.task = {
      status_id: this.statusId,
      title: null,
      description: null,
    };
  },
};
</script>

<style lang="scss" scoped></style>
