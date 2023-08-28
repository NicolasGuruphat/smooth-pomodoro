<template>
    <template v-for="i in goal" :key="i">
        <template v-if="i <= totalPomodoriDone">
            🟩
        </template>
        <template v-else-if="i == totalPomodoriDone + 1">
            ⭕
        </template>
        <template v-else>
            🟥
        </template>

         <template v-if="i % pomodoriByCycle == 0"> <!-- check if there is a big pause -->
            <template v-if="goal <= totalPomodoriDone">
                🟩
            </template>
            <template v-else>
                <template v-if="i !== goal">
                    🟨
                </template>
            </template>
        </template>
    </template>
</template>
<script setup>
import { defineProps } from 'vue';

defineProps(['goal','totalPomodoriDone', 'pomodoriByCycle']);

</script>
<style></style>