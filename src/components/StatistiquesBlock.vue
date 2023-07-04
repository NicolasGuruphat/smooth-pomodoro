<template>
    <div>
        <div class="stat">
            <span class="remaining-time">
                {{ timeBeforeBigBreak }}
            </span>
            <span class="info-label">
                🍅 
            </span>
            <span class="info-value">
                {{ pomodoroNumber }} / {{ pomodoriByCycle }}
            </span>
        </div>
        
        <div class="stat">
            <span class="remaining-time">
                {{  }}
            </span>
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
        totalPomodoro: Number,
        pomodoroTime: Object,
        breakTime: Object,
        timer: String
    },
    computed:{
        timeBeforeBigBreak(){
            return null
        },
        timeBeforeGoal(){
            console.log(Math.floor(this.goal/this.pomodoriByCycle))
            let timerSeconds = parseInt(this.timer.slice(0,2)*60)+parseInt(this.timer.slice(-2));
            console.log(timerSeconds);
            let seconds = timerSeconds+(this.goal-1)*(this.pomodoroTime.minutes*60+this.pomodoroTime.seconds)+(this.goal-1)*(this.breakTime.small.minutes*60+this.breakTime.small.seconds)+(Math.floor(this.goal/this.pomodoriByCycle))*(this.breakTime.big.minutes*60+this.breakTime.big.seconds)
            return seconds/60;
        },

    }
}
</script>
<style>
.stat{
  height: 30px;
}
</style>
