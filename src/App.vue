

<template>
  <div class="progress-bar-base" :style="progressBarGradiant">
  <p class="stats-block" >
    Current pomodoro number : <span class="stat">{{pomodoroNumber}}/{{pomodoriByCycle}}</span> 
    <span class="stat-selector" :class="{'disabled':pomodoriByCycle==0}" @click="pomodoriByCycle--" >-</span>
    <span class="stat-selector" @click="pomodoriByCycle++">+</span>
    <br> 
    Total pomodoro : <span class="stat">{{totalPomodoro}}<template v-if="goal!=0">/{{goal}}</template></span> 
    <span class="stat-selector" :class="{'disabled':goal==0}" @click="goal--" :disabled="goal==0">-</span>
    <span class="stat-selector" @click="goal++">+</span>
    <br> 
    <br> 
    Break Time (in minutes) :
    <ul>
      <li>
        small : {{ breakTime.small.minutes }}
        <span class="stat-selector" :class="{'disabled':breakTime.small.minutes==0}" @click="breakTime.small.minutes--" :disabled="breakTime.small.minutes==0">-</span>
        <span class="stat-selector" @click="breakTime.small.minutes++">+</span>
      </li>
      <li>
        big : {{ breakTime.big.minutes }}
        <span class="stat-selector" :class="{'disabled':breakTime.big.minutes==0}" @click="breakTime.big.minutes--" :disabled="breakTime.big.minutes==0">-</span>
        <span class="stat-selector" @click="breakTime.big.minutes++">+</span>
      </li>
    </ul>
    <br>
    Pomodoro Time (in minutes) :
    small : {{ pomodoroTime.minutes }}
        <span class="stat-selector" :class="{'disabled':pomodoroTime.minutes==0}" @click="pomodoroTime.minutes--" :disabled="pomodoroTime.minutes==0">-</span>
        <span class="stat-selector" @click="pomodoroTime.minutes++">+</span>
  </p>

  <span class="timer" :class="{'working' : working, 'not-working' : !working}">{{ timer }}</span>
  <div>
    <ActionButton :action="startOrStop">{{ startOrStopLabel }}</ActionButton>
    <ActionButton :action="skipCurrentPomodoro">SKIP</ActionButton>
    <ActionButton :action="globalReset">RESET</ActionButton>
    <ActionButton :action="goBackToFirstPomodoro">→1<sup>st</sup></ActionButton>
  </div>
  <footer>
    <div>smooth-pomodoro - NicolasGuruphat</div>  
    <a href="https://www.flaticon.com/authors/pixel-perfect" title="tomato icons">Tomato icons created by Pixel perfect - Flaticon</a>
  </footer>
</div>
</template>

<script>
import ActionButton from './components/ActionButton.vue';
export default {
  name: 'App',
  components: {
    ActionButton
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
      pomodoriByCycle : 4,
      seconds : null,
      minutes : null,
      startOrStopLabel : "STOP",
      intervalId : null,
      working : true,
      progression : 0,
      pomodoroNumber : 1, // between 1 and 4
      totalPomodoro : 0,
      goal : 0
    }
  },
  computed:{
    timer(){
      this.checkTime()
      let minutesToDisplay = this.minutes < 10 ? "0" + this.minutes : this.minutes;
      let secondsToDisplay = this.seconds < 10 ? "0" + this.seconds : this.seconds;
      return minutesToDisplay+":"+secondsToDisplay;
    },
    progressBarGradiant(){
      let baseTime = this.working ? this.pomodoroTime.minutes*60 + this.pomodoroTime.seconds : this.breakTime.small.minutes*60 + this.breakTime.small.seconds*60;
      let currentTime = baseTime-(this.minutes*60+this.seconds)
      let progression = ((currentTime/baseTime)-0.5)*100*2*-1
      if(this.working){
      return {
        "background": `linear-gradient(75deg, rgba(255,0,0,1) ${progression}%, rgba(0,255,12,1) 100%)`
      }
      }else{
        return {
          "background": "green"
          // "background": `linear-gradient(75deg, rgba(255,0,0,1) 100%,  rgba(0,255,12,1) ${progression}%)`
        };
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
      this.minutes = 0
      this.seconds = 0
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

    }
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
  --grey: #2c3e50
}
#app {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
.working {
  color : lightcoral
}
.not-working {
  color : greenyellow
}

.timer {
  font-size: 10vh;
  -webkit-text-stroke: 1.5px var(--grey);
}
.progress-bar-base{
  height: 100vh;
  width: 100vw;
  position: absolute;
  top:0;  
  left:0;
  /* background: rgb(255,0,0) */
}
.stats-block{
  position: absolute;
  margin-top: 5px;
  margin-left: 5px;
  font-size: 20px; 
  text-align: left;
  border: none;
  -webkit-text-stroke: 0;
  color: white;
}
.stat{
  text-decoration: underline;
}
.stat-selector{
  border:1px solid var(--grey);
  display: inline-block;
  width: 20px;
  text-align: center;
  background-color: rgba(252,252,252,0.5);
  border-radius:100px;
  cursor: pointer;
}
.disabled{
  pointer-events: none;
  background-color: var(--grey);
}
footer{
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
}
ul{
  margin:0;
}
</style>
