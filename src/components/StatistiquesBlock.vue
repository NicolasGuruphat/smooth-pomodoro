<template>
    <div>
        <div class="stat">
            
            <span class="info-value">
                {{ pomodoroNumber }} / {{ pomodoriByCycle }}
            </span>
            <span class="info-label">
                🍅 
            </span>
        </div>
        
        <div class="stat">
            
            <span class="info-value">
                {{ totalPomodoro }}
                <template v-if="goal != 0">/ {{ goal }}
                </template>
            </span>
            <span class="info-label">
                🎯
            </span>
        </div>
    </div>
</template>
<script>
export default {
    props : {
        goal: Number,
        pomodoroNumber: Number,
        pomodoriByCycle: Number,
        totalPomodoro: Number
    }
}
</script>
<style>
.stat{
  height: 30px;
}
</style>
