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
                {{ currentPomoroNumber }} / {{ pomodoriByCycle }}
            </span>
        </div>

        <div class="stat">
            <span class="remaining-time">
                {{ }}
            </span>
            <span class="info-label">
                🎯
            </span>
            <span class="info-value">
            {{ goalStat }}
            </span>
            
        </div>
    </div>
</template>
<script>
export default {
    props: {
        goal: {
            type: Number,
            required: true
        },
        currentPomoroNumber: {
            type: Number,
            required: true
        },
        pomodoriByCycle: {
            type: Number,
            required: true
        },
        totalPomodoriDone: {
            type: Number,
            required: true
        },
        pomodoroTime: {
            type: Object,
            required: false
        },
        breakTime: {
            type: Object,
            required: false
        },
        timer: {
            type: String,
            required: false
        },
    },
    computed: {
        timeBeforeBigBreak() {
            return null
        },
        timeBeforeGoal() {
            console.log(Math.floor(this.goal / this.pomodoriByCycle))
            let timerSeconds = parseInt(this.timer.slice(0, 2) * 60) + parseInt(this.timer.slice(-2));
            console.log(timerSeconds);
            let seconds = timerSeconds + (this.goal - 1) * (this.pomodoroTime.minutes * 60 + this.pomodoroTime.seconds) + (this.goal - 1) * (this.breakTime.small.minutes * 60 + this.breakTime.small.seconds) + (Math.floor(this.goal / this.pomodoriByCycle)) * (this.breakTime.big.minutes * 60 + this.breakTime.big.seconds)
            return seconds / 60;
        },
        goalStat(){
            return this.totalPomodoriDone + " / " + (this.goal != 0 ? this.goal : "");
        }

    }
}
</script>
<style>
.stat {
    height: 30px;
}
</style>
