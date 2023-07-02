<template>
    <template v-for="i in goal" :key="i">
        <template v-if="i <= totalPomodoro">
            🟩
        </template>
        <template v-else-if="i == totalPomodoro + 1">
            ⭕
        </template>
        <template v-else>
            🟥
        </template>

        <template v-if="i % pomodoriByCycle == 0">
            <template v-if="goal <= totalPomodoro">
                🟩
            </template>
            <template v-else>
                🟨
            </template>
        </template>
    </template>
</template>
<script>
export default {
    props: {
        goal: Number,
        totalPomodoro: Number,
        pomodoriByCycle: Number
    }
}
</script>
<style>
</style>