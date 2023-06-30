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
  border: 4px solid var(--grey);
  border-radius: 20px;
  padding: 10px;
  color:white;
  font-size:5vh;
  margin: 1vh;
  cursor: pointer;
  -webkit-text-stroke: 1.5px var(--grey);

}
</style>