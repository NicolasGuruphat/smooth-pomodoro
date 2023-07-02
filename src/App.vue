

<template>
  <div class="progress-background-base" :style="progressBackgroundGradiant">
  <StatistiquesBlock class="stats-block"
    :pomodoroNumber="pomodoroNumber"
    :pomodoriByCycle="pomodoriByCycle"
    :totalPomodoro="totalPomodoro"
    :goal="goal"
  >
  </StatistiquesBlock>
  <OptionsBlock class="option-block"
    :pomodoriByCycle="pomodoriByCycle"
    :totalPomodoro="totalPomodoro"
    :pomodoroTime="pomodoroTime"
    :breakTime="breakTime"
    :goal="goal"
    :grandiantEnabled="grandiantEnabled"
    :audioEnabled="audioEnabled"
    @updatePomodoriByCycle="($event)=>pomodoriByCycle=$event"
    @updateBigBreakTime="($event)=>breakTime.big.minutes=$event"
    @updateSmallBreakTime="($event)=>breakTime.small.minutes=$event"
    @updateGoal="($event)=>goal=$event"
    @updatePomodoroTime="($event)=>pomodoroTime.minutes=$event"
    @updateGradiantEnabled="($event)=>grandiantEnabled=$event"
    @updateAudioEnabled="($event)=>audioEnabled=$event"
    >
  </OptionsBlock>
  
    <span class="timer" :class="{'working' : working, 'not-working' : !working}">{{ timer }}</span>
    <div>
      <ActionButton :action="startOrStop">{{ startOrStopLabel }}</ActionButton>
      <ActionButton :action="skipCurrentPomodoro">SKIP</ActionButton>
      <ActionButton :action="globalReset">RESET</ActionButton>
      <ActionButton :action="goBackToFirstPomodoro" :enabled="pomodoroNumber!=1 || !working">➔1<sup>st</sup></ActionButton>
    </div>
    <ProgressBar
      :goal="goal"
      :totalPomodoro="totalPomodoro"
      :pomodoriByCycle="pomodoriByCycle"
    >

    </ProgressBar>
    <footer>
        <div>SMOOTH POMODORO - by Nicolas Guruphat</div>  
      <a href="https://www.flaticon.com/authors/pixel-perfect" title="tomato icons">Tomato icons created by Pixel perfect - Flaticon</a>
      <br>
      <a href="https://freesound.org/people/InspectorJ/sounds/411575/">Sound effect by InspectorJ - Freesound</a>
    </footer>
  </div>
</template>

<script>
import ActionButton from './components/ActionButton.vue';
import StatistiquesBlock from './components/StatistiquesBlock.vue';
import OptionsBlock from './components/OptionsBlock.vue'
import ProgressBar from './components/ProgressBar.vue';
export default {
  name: 'App',
  components: {
    ActionButton, 
    StatistiquesBlock, 
    OptionsBlock,
    ProgressBar
  },
  data() {
    return {
      pomodoroTime : {
        minutes : 25,
        seconds : 0
      },
      breakTime : {
        small : {
          minutes : 5,
          seconds : 0
        },
        big : {
          minutes : 15,
          seconds : 0
        }
      },
      grandiantEnabled : false,
      audioEnabled : true,
      pomodoriByCycle : 4,
      seconds : null,
      minutes : null,
      startOrStopLabel : "STOP",
      intervalId : null,
      working : true,
      progression : 0,
      pomodoroNumber : 1, // between 1 and 4
      totalPomodoro : 0,
      goal : 0,
      soundEffect : new Audio(require("./assets/gong_hit.wav"))
    }
  },
  computed:{
    timer(){
      this.checkTime()
      let minutesToDisplay = this.minutes < 10 ? "0" + this.minutes : this.minutes;
      let secondsToDisplay = this.seconds < 10 ? "0" + this.seconds : this.seconds;
      return minutesToDisplay+":"+secondsToDisplay;
    },
    progressBackgroundGradiant(){
      if(this.grandiantEnabled){
        let baseTime = this.working ? this.pomodoroTime.minutes*60 + this.pomodoroTime.seconds : this.breakTime.small.minutes*60 + this.breakTime.small.seconds*60;
        let currentTime = baseTime-(this.minutes*60+this.seconds)
        let progression = ((currentTime/baseTime)-0.5)*100*2*-1
        if(this.working){
          return {
            "background": `linear-gradient(75deg, #ffb5aa ${progression}%, #aaffb6 100%)`
          };
        }else{
            return {
              "background": "green"
              // "background": `linear-gradient(75deg, rgba(255,0,0,1) 100%,  rgba(0,255,12,1) ${progression}%)`
            };
        }
      }else{
          return {"background-color" : this.working ? "#ffb5aa" : "#aaffb6" };
      }
    }
  },
  methods:{
    startOrStop() {
      if(this.startOrStopLabel === "STOP"){
        this.startOrStopLabel = "START"
        clearInterval(this.intervalId)
        this.intervalId = null
      }else{
        this.startOrStopLabel = "STOP"
        this.startTimer()
      }
    },
    checkTime() {
        if(this.seconds == -1){
          this.seconds = 59
          this.minutes --
          if(this.minutes == -1){
            this.switchSession()
          }
        }
      },
    startTimer(){
      this.intervalId = setInterval(() => {
        this.seconds --;
      }, 1000)
    },
    switchSession() {
      if(this.audioEnabled){
        this.soundEffect.play()
      }
      if(this.working){
        // switch to pause session
        if(this.pomodoroNumber == this.pomodoriByCycle){
          this.minutes = this.breakTime.big.minutes;
          this.seconds = this.breakTime.big.seconds;
        }else{
          this.minutes = this.breakTime.small.minutes;
          this.seconds = this.breakTime.small.seconds;
        }
        this.totalPomodoro += 1
      }else{
        // switch to work session
        this.pomodoroNumber = (this.pomodoroNumber ) % this.pomodoriByCycle + 1
        this.minutes = this.pomodoroTime.minutes
        this.seconds = this.pomodoroTime.seconds
        
      }
      this.working = !this.working
    },
    skipCurrentPomodoro() {
      this.minutes = 0;
      this.seconds = 0;
      this.seconds--;
    },
    globalReset(){
      this.resetTimer();
      this.totalPomodoro = 0;
      this.pomodoroNumber = 1;
    },
    goBackToFirstPomodoro(){
      // go back to the first pomodoro of the current group of 
      if(this.working){
        this.totalPomodoro -= (this.pomodoroNumber-1)  
      }else{
        this.totalPomodoro -= this.pomodoroNumber
      }
      this.pomodoroNumber = 1
      this.resetTimer()
    },
    resetTimer(){
      this.minutes = this.pomodoroTime.minutes
      this.seconds = this.pomodoroTime.seconds 
      this.working = true

    },
  },
  mounted(){
    this.minutes = this.pomodoroTime.minutes
    this.seconds = this.pomodoroTime.seconds
    this.startTimer()
  }
}
</script>

<style >
:root {
  --grey: #2c3e50;
  --white: rgb(252,252,252)
}
#app {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.working {
  color : #cc1b00
}
.not-working {
  color :  #00cc1b
}
.timer {
  font-size: 10vh;
  font-weight: bold;
  /* -webkit-text-stroke: 1.5px var(--grey); */
}
.progress-background-base{
  height: 100vh;
  width: 100vw;
  position: absolute;
  top:0;  
  left:0;
  /* background: rgb(255,0,0) */
}
.stats-block{
  text-align: left;
  position: absolute;
  margin-top: 5px;
  margin-right: 5px;
  right: 0;
  font-size: 20px; 
  border: none;
  color: rgba(0, 0, 0, 0.8)
}
.options-block{
  text-align: left;
  position: absolute;
  margin-top: 5px;
  margin-right: 5px;
  left: 5px;
  font-size: 20px; 
  border: none;
  color: rgba(0, 0, 0, 0.8)
}
.info-label{
  float:left;
}
.info-value{
  text-decoration: underline;
}
footer{
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
}
ul{
  list-style: "⏱️";
  margin:0;
}
</style>
