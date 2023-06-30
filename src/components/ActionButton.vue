<template>
    <div>
        <button class="base-button" @click="action">
            <slot></slot>
        </button>
    </div>
</template>
<script>
export default {
    props:{
        action:Function
    }
}
</script>
<style>
.base-button {
  background-color: transparent;
  border: 4px solid black;
  border-radius: 10px;
  padding: 10px;
  color:white;
  font-size:5vh;
  margin: 1vh;
  cursor: pointer;

}
</style>