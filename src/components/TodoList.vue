<template>
  <div id="todo-list" :class="{'uncompleted': isThereUncompletedTask, 'completed': !isThereUncompletedTask}">
    <h2>Task List {{ isThereUncompletedTask ? "📬" : "📭" }}</h2>
    <form v-on:submit.prevent="addToList">
      <input ref='addToListInput' v-model="taskToAdd" type="text" id="add-to-list-input" />
      <button type="submit" id="add-to-list-button">🔵</button>
    </form>
    <div id="task-list">
      <div v-for="(task, i)  in taskList" :key="i" class="task" :class="{'task-done' : task.done, 'task-undone' : !task.done }">
        <span class="open-task-actions">☰</span>
        <span class="button-group">
          <button @click="moveUp(i)">⬆️</button>
          <button @click="moveDown(i)">⬇️</button>
          <button @click="removeFromList(task)">❌</button>
          <button @click="validate(task)">{{ task.done ? "✅" : "🟩" }}</button>
        </span>
        <span ref="itemRefs" :class="{ 'validated': task.done }" class="task-name" @click="select(task)">
          {{ task.name }}
        </span>
        <span v-if="selectedTask === task">
          💎
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
import { Task } from '@/interfaces/Task.js'

const props = defineProps(['selectedTask'])

const emits = defineEmits(['update:selectedTask'])

const taskToAdd = ref<string>('')
const taskList = useStorage<Task[]>('taskList', [], localStorage)

const addToListInput = ref<HTMLElement | null>()

const addToList = async (): Promise<void> => {
  if (addToListInput.value == null) return
  if (taskList.value.filter((task: Task) => task.name === taskToAdd.value).length !== 0 || taskToAdd.value.trim().length === 0) {
    addToListInput.value.style.border = '2px dashed red'
    await new Promise(resolve => setTimeout(resolve, 1000))
    addToListInput.value.style.border = ''
    return
  }
  taskList.value.push({ name: taskToAdd.value, done: false })
  taskToAdd.value = ''
}

const moveUp = (index: number): void => {
  if (index === 0) {
    return
  }
  arrayMove(taskList.value, index, index - 1)
}

const moveDown = (index: number): void => {
  if (index + 1 === taskList.value.length) {
    return
  }
  arrayMove(taskList.value, index, index + 1)
}

function arrayMove (arr: Task[], fromIndex: number, toIndex: number) :void {
  const element = arr[fromIndex]
  arr.splice(fromIndex, 1)
  arr.splice(toIndex, 0, element)
}

const completedTasks = computed(() => {
  return taskList.value.filter((task: Task) => task.done).length
})

const totalTasks = computed(() => {
  return taskList.value.length
})

const removeFromList = (task: Task): void => {
  const index = findIndexOfTask(task)
  if (index > -1) {
    taskList.value.splice(index, 1)
  }
  if (props.selectedTask === task) {
    emits('update:selectedTask', null)
  }
}

const findIndexOfTask = (task: Task): number => {
  return taskList.value.indexOf(task)
}

const validate = (task: Task): void => {
  task.done = !task.done
  if (task === props.selectedTask && this !== null) {
    emits('update:selectedTask', null)
  }
}
const select = (task: Task): void => {
  if (props.selectedTask === task) {
    emits('update:selectedTask', null)
  } else if (!task.done) {
    emits('update:selectedTask', task)
  }
}
const emptyList = (): void => {
  taskList.value = []
}

const isTaskListEmpty = computed(() => {
  return taskList.value.length === 0
})

const isThereUncompletedTask = computed(() => {
  return taskList.value.filter((task: Task) => !task.done).length !== 0
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
  padding: 0.6rem 1rem;
}
.completed {
  background: rgba(113, 255, 120, 0.5);
}
.uncompleted {
  background: rgba(255, 255, 255, 0.5);

}
#add-to-list-button {
  padding-right: 0;
  font-size: 1.15rem;
}

.open-task-actions {
  padding-left: 0.5rem;
  cursor: pointer;
}

.open-task-actions:hover + .button-group, .button-group:hover {
  display: block;
  position: absolute;
}

.button-group {
  top:0;
  left:0;
  display: none;
  background-color: rgb(253, 200, 208);
  border-radius: 1rem;
  padding: 0.2rem;
  cursor:pointer;
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
  border-radius: 1rem;
  padding: 0.2rem;
  margin: 0.2rem 0;
  position: relative;
}
.task-undone{
  background: rgba(252, 252, 252, 0.7);

}
.task-done{
  background: rgba(113, 255, 120, 0.7);

}

.task-name {
  padding-left: 1rem;
}

.task-name:hover {
  cursor: pointer;
}

</style>
