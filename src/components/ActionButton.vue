<template>
    <div>
        <button :disabled="!enabled" class="base-button" @click="action()">
            <slot></slot>
        </button>
    </div>
</template>
<script lang="ts">
export default {
  props: {
    action: {
      required: true,
      type: Function
    },
    enabled: { default: true }
  }
}
</script>
<style scoped>
.base-button {
    background-color: transparent;
    border: 3px solid white;
    border-radius: 20px;
    font-weight: bold;
    padding: 10px;
    color: white;
    font-size: 4vh;
    margin: 1vh;
    cursor: pointer;
}

.base-button:hover{
  transition: transform 300ms ease-in-out;
  transform:scale(1.2)
}

.base-button:not(:hover){
  transition: transform 300ms ease-in-out;
  transform:scale(1)
}
</style>
