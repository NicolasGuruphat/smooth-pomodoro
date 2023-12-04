<template>
    <div id="todo-list">
    <div>TODO</div>
    <ul>
        <li v-for="(selected, task, i)  in taskList" :key="i" @click="select(task)" ref="itemRefs" :class="{'selected':selected}">
            {{ task }}
        </li>
    </ul>
    </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'

const taskList = reactive({ 'tache 1': false, 'tache 2': false })
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
    border:1px solid black;
    cursor: move;
}
ul{
    list-style: none;
}
ul li{
    list-style: "🟩";
    cursor: pointer;
}
ul li.selected {
    list-style: "✅";
}
</style>
