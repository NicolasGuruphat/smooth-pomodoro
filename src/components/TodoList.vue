<template>
  <div id="todo-list">
    <h2>Task List {{ isTaskListEmpty ? "📭" : "📬" }}</h2>
    <form v-on:submit.prevent="addToList">
      <input ref='addToListInput' v-model="taskToAdd" type="text" id="add-to-list-input" />
      <button type="submit" id="add-to-list-button">🔵</button>
    </form>
    <div id="task-list">
      <div v-for="(selected, task, i)  in taskList" :key="i" class="task">
        <span class="button-group">
          <button @click="removeFromList(task)">❌</button>
          <button @click="select(task)">{{ selected ? "✅" : "🟩" }}</button>
        </span>
        <span ref="itemRefs" :class="{ 'selected': selected }">
          {{ task }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'

const taskToAdd = ref('')
const taskList = useStorage<{ [index: string | number]: boolean }>('taskList', {}, localStorage)

const addToListInput = ref<HTMLElement | null>()

const addToList = async (): Promise<void> => {
  if (addToListInput.value == null) return
  if (taskList.value[taskToAdd.value] !== undefined || !taskToAdd.value.trim().length) {
    addToListInput.value.style.border = '2px dashed red'
    await new Promise(resolve => setTimeout(resolve, 1000))
    addToListInput.value.style.border = ''
    return
  }
  taskList.value[taskToAdd.value] = false
  taskToAdd.value = ''
}

const removeFromList = (index: string | number): void => {
  delete taskList.value[index]
}

const select = (index: string | number): void => {
  taskList.value[index] = !taskList.value[index]
}

const isTaskListEmpty = computed(() => {
  for (const element of Object.values(taskList.value)) {
    if (!element) {
      return false
    }
  }
  return true
})

</script>
<style scoped>
h2 {
  font-size: 1.25em;
  margin: 0;
  font-weight: 550;
}

.selected {
  color: green;
  text-decoration: line-through;
}

#todo-list {
  border: 2px dashed black;
  border-radius: 0.5rem;
  cursor: move;
  background: rgba(255, 255, 255, 0.5);
  padding: 0.6rem 1rem;
}

.button-group {
  margin-right: 1rem;
}

button {
  border: none;
  background-color: transparent;
  cursor: pointer;
}

#add-to-list-input {
  border: 2px dashed black;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 0.5rem;
  margin: 0.5rem 0;
}

#task-list {
  text-align: left;
}

.task {
  background: rgb(252, 252, 252);
  opacity: 0.7;
  border-radius: 1rem;
  padding: 0.2rem;
  margin: 0.2rem 0;
}

#add-to-list-button {
  padding-right: 0;
}
</style>
