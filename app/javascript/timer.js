import { loadImage } from "./imagePlayer.js";

const progressBar = document.getElementById("progressBar");
class Timer{
  constructor(interval){
    this.interval = interval;
    this.counter = 0;
    this.timerId;
  }

  start(){
    this.timerId = setInterval(()=>{

      if (this.counter+1>= this.interval){
        progressBar.classList.add("is-danger");

      }

      if (this.counter>=this.interval){
        this.counter = 0;
        progressBar.value = this.counter;
        loadImage(1);
      }

      else{
        this.counter++;
        progressBar.value = this.counter;
      } 


      },1000)
    }
  stop(){
    clearInterval(this.timerId);
  }

}

export{Timer};
