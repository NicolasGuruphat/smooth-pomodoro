<template>
    <div id="todo-list">
        <div>TODO</div>
        <input ref='addToListInput' v-model="taskToAdd" type="text" id="add-to-list-input"/><button id="add-to-list-button" @click="addToList()">🔵</button>

        <div v-for="(selected, task, i)  in taskList" :key="i" >
            <span class="button-group">
                <button @click="removeFromList(task)">❌</button>
                <button @click="select(task)">{{ selected ? "✅":"🟩" }}</button>
            </span>
            <span  ref="itemRefs" :class="{'selected':selected}" >
                {{ task }}
            </span>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'

const taskToAdd = ref('')
const taskList = useStorage<{[index: string]:boolean}>('taskList', { }, localStorage)

const addToListInput = ref<HTMLElement | null>()

const addToList = async () : Promise<void> => {
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

const removeFromList = (j : string) : void => {
  delete taskList.value[j]
}

const select = (j : string) : void => {
  taskList.value[j] = !taskList.value[j]
}
</script>
<style scoped>
.selected{
    color:green;
    text-decoration: line-through;
}
#todo-list{
    border:2px dashed black;
    border-radius: 0.5rem;
    cursor: move;
    background: rgba(255, 255, 255, 0.5);
}

.button-group{
    margin-right:1rem;
}

button {
    border:none;
    background-color: transparent;
    cursor: pointer;
}

#add-to-list-input {
    border:2px dashed black;
    background-color: transparent;
    border-radius: 0.5rem;
    margin-left:1rem;
}
</style>
