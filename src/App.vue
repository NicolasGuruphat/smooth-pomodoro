

<template>
  <div class="progress-bar-base" :style="progressBarGradiant">
  <details class="stats-block">
    <summary style="stat-summary">Options</summary>
    <div>
      <div class="stat">
        <span class="stat-label">🍅 Current pomodoro number : <span class="stat-value">{{pomodoroNumber}}/{{pomodoriByCycle}}</span></span> 
        <span class="stat-selector">
          <button class="stat-selector-button" :class="{'disabled':pomodoriByCycle==1, 'enabled-selector':pomodoriByCycle!=1, 'disabled-selector':pomodoriByCycle==1}" @click="pomodoriByCycle--" >-</button>
          <button class="stat-selector-button enabled-selector" @click="pomodoriByCycle++">+</button>
        </span>
      </div> 
      <div class="stat">
        <span class="stat-label">🎯 Total pomodoro : <span class="stat">{{totalPomodoro}}<template v-if="goal!=0">/{{goal}}</template></span></span>
        <span class="stat-selector">
          <button class="stat-selector-button" :class="{'disabled':goal==0, 'enabled-selector':goal!=0, 'disabled-selector':goal==0}" @click="goal--" :disabled="goal==0">-</button>
          <button class="stat-selector-button enabled-selector" @click="goal++">+</button>
        </span>
      </div>
      <div>
        <span class="stat-label">Timing parameters  (in minutes) :</span>
        <br>
        <ul>
          <li>
            <div class="stat">
              <span class="stat-label">Pomodoro   : {{ pomodoroTime.minutes }}</span>
              <span class="stat-selector">
                <button class="stat-selector-button" :class="{'disabled':pomodoroTime.minutes==1, 'enabled-selector':pomodoroTime.minutes!=1, 'disabled-selector':pomodoroTime.minutes==1}" @click="pomodoroTime.minutes--" :disabled="pomodoroTime.minutes==0">-</button>
                <button class="stat-selector-button enabled-selector" @click="pomodoroTime.minutes++">+</button>
              </span>
            </div>
          </li>
          <li>
            <div class="stat">
              <span class="stat-label">Small break : {{ breakTime.small.minutes }}</span>
              <span class="stat-selector">
                <button class="stat-selector-button" :class="{'disabled':breakTime.small.minutes==1, 'enabled-selector':breakTime.small.minutes!=1, 'disabled-selector':breakTime.small.minutes==1}" @click="breakTime.small.minutes--" :disabled="breakTime.small.minutes==0">-</button>
                <button class="stat-selector-button enabled-selector" @click="breakTime.small.minutes++">+</button>
              </span>
            </div>
          </li>
          <li>
            <div class="stat">
              <span class="stat-label">Big break   : {{ breakTime.big.minutes }}</span>
              <span class="stat-selector">
                <button class="stat-selector-button" :class="{'disabled':breakTime.big.minutes==1, 'enabled-selector':breakTime.big.minutes!=1, 'disabled-selector':breakTime.big.minutes==1}" @click="breakTime.big.minutes--" :disabled="breakTime.big.minutes==0">-</button>
                <button class="stat-selector-button enabled-selector" @click="breakTime.big.minutes++">+</button>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </details>

    <span class="timer" :class="{'working' : working, 'not-working' : !working}">{{ timer }}</span>
    <div>
      <ActionButton :action="startOrStop">{{ startOrStopLabel }}</ActionButton>
      <ActionButton :action="skipCurrentPomodoro">SKIP</ActionButton>
      <ActionButton :action="globalReset">RESET</ActionButton>
      <ActionButton :action="goBackToFirstPomodoro" :enabled="pomodoroNumber!=1 || !working">➔1<sup>st</sup></ActionButton>
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
        "background": `linear-gradient(75deg, #ffb5aa ${progression}%, #aaffb6 100%)`
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
  color : lightcoral
}
.not-working {
  color : greenyellow
}

.timer {
  font-size: 10vh;
  font-weight: bold;
  /* -webkit-text-stroke: 1.5px var(--grey); */
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
  text-align: left;
  position: absolute;
  margin-top: 5px;
  margin-left: 5px;
  font-size: 20px; 
  border: none;
  color: rgba(0, 0, 0, 0.8)

}
.stat-label{
  float:left;
}
.stat-value{
  text-decoration: underline;
  right: 0;
}

.stat-selector{
  display: inline-block;
  right: 0;
  position: absolute;
}
.stat-selector-button{
  display: inline-block;
  width: 20px;
  text-align: center;
  border-radius:10px;
  cursor: pointer;
  border: 1px solid black;
  font-weight: bold;
}
.stat{
  width : 400px; 
  height: 30px;
}
.stat-summary{

}
.disabled{
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.5);
  color: rgba(252,252,252,1);
}
.enabled-selector{
  background-color: rgba(252,252,252,0.5);  
  color: rgba(0, 0, 0, 1 );
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
