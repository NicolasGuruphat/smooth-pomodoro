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
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useParameters } from '@/store/Parameters'
import { useUser } from '@/store/User'

const parametersStore = useParameters()
const { goal, pomodoriByCycle } = storeToRefs(parametersStore)

const userStore = useUser()
const { totalPomodoriDone } = storeToRefs(userStore)

</script>
<style></style>
