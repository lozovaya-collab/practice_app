<template>
  <div class="content-task" v-if="newTask">
    <Combobox
      v-model:selected="statusId"
      @update:selected="statusId = $event"
      v-bind:list="statuses"
    />
    <TextInput
      v-model="title"
      @update:modelValue="title = $event"
      :type="'text'"
      :placeholder="'название'"
    />
    <TextArea
      v-model="description"
      @update:modelValue="description = $event"
      :placeholder="'описание'"
    />
  </div>
</template>

<script>
import { Combobox, TextInput, TextArea } from "@/components/UI";

export default {
  name: "CreateTask",
  props: ["newTask"],
  emits: ["update:newTask"],
  components: {
    Combobox,
    TextInput,
    TextArea,
  },
  data() {
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
    };
  },
  computed: {
    statusId: {
      get() {
        return this.newTask.status_id;
      },
      set(value) {
        this.$emit("update:newTask", {
          ...this.newTask,
          status_id: value,
        });
      },
    },
    title: {
      get() {
        return this.newTask.title;
      },
      set(value) {
        this.$emit("update:newTask", {
          ...this.newTask,
          title: value,
        });
      },
    },
    description: {
      get() {
        return this.newTask.description;
      },
      set(value) {
        this.$emit("update:newTask", {
          ...this.newTask,
          description: value,
        });
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.content-task {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
