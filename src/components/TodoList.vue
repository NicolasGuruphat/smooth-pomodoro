<template>
    <div id="todo-list">
    <div>TODO</div>
    <input ref='addToListInput' v-model="taskToAdd" type="text" id="add-to-list-input"/><button id="add-to-list-button" @click="addToList()">🔵</button>
    <ul>
        <li v-for="(selected, task, i)  in taskList" :key="i" @click="select(task)" ref="itemRefs" :class="{'selected':selected}">
            {{ task }}
        </li>
    </ul>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'

const taskToAdd = ref('')
const taskList = reactive({ 1: false, 'tache 2': false })

const addToListInput = ref('')

const addToList = async () : void => {
  if (taskList[taskToAdd.value] !== undefined || !taskToAdd.value.trim().length) {
    addToListInput.value.style.border = '2px dashed red'
    await new Promise(resolve => setTimeout(resolve, 1000))
    addToListInput.value.style.border = ''
    return
  }
  taskList[taskToAdd.value] = false
  taskToAdd.value = ''
}
const select = (j : string) : void => {
  taskList[j] = !taskList[j]
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
ul li{
    list-style: "🟩";
    cursor: pointer;
}
ul li.selected {
    list-style: "✅";
}
#add-to-list-button {
    border:none;
    background-color: transparent;
    margin-right:1rem;

}
#add-to-list-input {
    border:2px dashed black;
    background-color: transparent;
    border-radius: 0.5rem;
    margin-left:1rem;
}
</style>
