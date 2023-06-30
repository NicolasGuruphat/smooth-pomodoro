

<template>
  <div class="progress-bar-base" :style="progressBarGradiant">
  <span class="timer" :class="{'working' : working, 'not-working' : !working}">{{ timer }}</span>
  <div>
    <button class="start-and-stop" @click="startOrStop">{{startOrStopLabel}}</button>
  </div>
</div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      seconds : 0,
      minutes : 25,
      startOrStopLabel : "STOP",
      intervalId : null,
      working : true,
      progression : 0,
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
      let baseTime = 25*60
      let currentTime = baseTime-(this.minutes*60+this.seconds)
      let progression = ((currentTime/baseTime)-0.40)*100*2.5 *-1
      return {
        "background": `linear-gradient(75deg, rgba(255,0,0,1) ${progression}%, rgba(0,255,12,1) 100%)`
      }
    }
  },
  methods:{
    startOrStop() {
      console.log(this.startOrStopLabel);
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
          if(this.minutes == 0){
            this.switchSession()
          }
        }
      },
    startTimer(){
      this.intervalId = setInterval(() => {
        this.seconds --;
      }, 1)
    },
    switchSession() {
      if(this.working){
        // switch to pause session
        this.minutes = 5
        this.seconds = 0
      }else{
        // switch to work session
        this.minutes = 25
        this.seconds = 0
      }
      this.working = !this.working
    }
  },
  mounted(){
   this.startTimer()
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.working {
  color : lightcoral
}
.not-working {
  color : greenyellow
}
.timer {
  font-size: 10vh;
  -webkit-text-stroke: 2px black;
}
.start-and-stop {
  font-size:5vh
}
.progress-bar-base{
  height: 100vh;
  width: 100vw;
  position: absolute;
  top:0;  
  left:0;
  background: rgb(255,0,0)
}
</style>
