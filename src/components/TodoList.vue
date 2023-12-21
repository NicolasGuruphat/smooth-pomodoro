<template>
  <div id="todo-list">
    <h2>Task List {{ isThereUncompletedTask ? "📭" : "📬" }}</h2>
    <form v-on:submit.prevent="addToList">
      <input ref='addToListInput' v-model="taskToAdd" type="text" id="add-to-list-input" />
      <button type="submit" id="add-to-list-button">🔵</button>
    </form>
    <div id="task-list">
      <div v-for="(validated, task, i)  in taskList" :key="i" class="task">
        <span class="button-group">
          <button @click="removeFromList(task)">❌</button>
          <button @click="validate(task)">{{ validated ? "✅" : "🟩" }}</button>
        </span>
        <span class="task-label" @click="select(task)">
          <span ref="itemRefs" :class="{ 'validated': validated }">
            {{ task }}
          </span>
          <span v-if="selectedTask === task">
            💎
          </span>
        </span>
      </div>
    </div>
    <div v-if="!isTaskListEmpty" style="text-align: left; padding:0.2rem">
      <button @click='emptyList'>🗑️</button>
      <span :style="{ 'color': completedTasks === totalTasks ? 'green' : 'black' }">
        {{ completedTasks }}/{{ totalTasks }}
        <span v-if='completedTasks === totalTasks'>🎉🐲🐙🦞🐟</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'

const props = defineProps(['selectedTask'])

const emits = defineEmits(['update:selectedTask'])

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

const completedTasks = computed(() => {
  return Object.values(taskList.value).filter((value) => { return value }).length
})

const totalTasks = computed(() => {
  return Object.values(taskList.value).length
})

const removeFromList = (task: string | number): void => {
  delete taskList.value[task]
}

const validate = (task: string | number): void => {
  taskList.value[task] = !taskList.value[task]
  if (task === props.selectedTask && this !== null) {
    emits('update:selectedTask', null)
  }
}
const select = (task: string | number): void => {
  if (props.selectedTask === task) {
    emits('update:selectedTask', null)
  } else if (!taskList.value[task]) {
    emits('update:selectedTask', task)
  }
}
const emptyList = (): void => {
  taskList.value = {}
}

const isTaskListEmpty = computed(() => {
  return Object.values(taskList.value).length === 0
})

const isThereUncompletedTask = computed(() => {
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

.validated {
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
  background: rgba(252, 252, 252, 0.7);
  border-radius: 1rem;
  padding: 0.2rem;
  margin: 0.2rem 0;
}

#add-to-list-button {
  padding-right: 0;
}

.task-label:hover {
  cursor: pointer;
}
</style>
