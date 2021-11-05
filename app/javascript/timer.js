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

// const start =(time)=>{
// setTimeout(function run() {

//   if (counter+1>= time){
//     progressBar.classList.add("is-danger");

//   }

//   if (counter>=time){
//     counter = 0;
//     progressBar.value = counter;
//     loadImage();
//   }

//   else{
//     counter++;
//     progressBar.value = counter;
//   } 


//   setTimeout(run, 1000);
// }, 1000);
// }


// let timerId2;
// const start =(time)=>{
//  setTimeout(function run() {
//   if (counter+1>= time){
//     progressBar.classList.add("is-danger");

//   }

//   if (counter>=time){
//     console.log("why");
//     counter = 0;
//     progressBar.value = counter;
//     loadImage(1);
//   }

//   else{
//     counter++;
//     progressBar.value = counter;
//   } 


//   timerId=setTimeout(run, 1000);
// }, 1000);
// }


// const previous = document.getElementById("previous")
// previous.addEventListener("click",()=>{
//     clearTimeout(timerId)
//     counter=0;
//     loadImage(-1);
//     start(5);
// })

// const next = document.getElementById("next");
// next.addEventListener("click",()=>{
//     clearTimeout(timerId)
//     counter=0;
//     loadImage(1);
//     start(5);
// })


// export { start };

// function start() {
//     // document.getElementById("timer").innerText = timeLeft
//   if (!timeLeft)
//     reset();

//   else
//    loop();
// }

// function pause() {

//   if (timerId) {
//     clearInterval(timerId);
//     timerId = null;
//   }
// }

// function reset() {
//   pause();
//   loadImage();
//   img.onload = ()=>{
//     // void(img.offsetHeight)
//     // img.classList.add("fadeIn")
//     timeLeft =3;
//     toggle = true;
//     document.getElementById("timer").textContent = timeLeft
//     loop();

//   }
//   // loadImage();

//     // img.classList.remove("fadeOut")
//     // img.classList.add("fadeIn")
//     // // img.classList.toggle("fadeOut")
//     // // img.classList.toggle("fadeIn")
//     // timeLeft = 10;
//     // document.getElementById("timer").innerText = timeLeft
//     // loop();
// }
// function loop() {

//   timerId = setInterval(function() {
//     // if(timeLeft <= 3 && toggle) {
//     //   img.classList.add("fadeOut")
//     //   toggle = false;
//     // }
//     if (0 >= timeLeft) {
//       reset();
//       return;
//     }

//     timeLeft--;
//     document.getElementById("timer").textContent = timeLeft

//   }, 1000);
// }

/**
 * Self-adjusting interval to account for drifting
//  * 
//  *                             for each interval
//  *                             exceeds interval
//  */
//  timeLeft = 10;
// function AdjustingInterval(workFunc, interval, errorFunc) {
//     let that = this;
//     let expected, timeout;
//     this.interval = interval;

//     this.start = function() {
//         expected = Date.now() + this.interval;
//         timeout = setTimeout(step, this.interval);
//     }

//     this.stop = function() {
//         clearTimeout(timeout);
//     }

//     function step() {
//         var drift = Date.now() - expected;
//         if (drift > that.interval) {
//             // You could have some default stuff here too...
//             if (errorFunc) errorFunc();
//         }
//         workFunc();
//         if(timeLeft <= 0){
//         loadImage();
//           timeLeft = 10;
//           that.stop();
//           that.start();
//         }
//         expected += that.interval;
//         timeout = setTimeout(step, Math.max(0, that.interval-drift));
//     }
// }

// // For testing purposes, we'll just increment
// // this and send it out to the console.
// let justSomeNumber = 0;

// // Define the work to be done
// const doWork = function() {
//   timeLeft--;
//   document.getElementById("timer").textContent = timeLeft;
// };

// // Define what to do if something goes wrong
// const doError = function() {
//     console.warn('The drift exceeded the interval.');
// };

// // (The third argument is optional)
// const start = new AdjustingInterval(doWork, 1000, doError);

// function start(){
// let interval = 1000; // ms
// let expected = Date.now() + interval;
// let timeLeft =1;
// setTimeout(step, interval);
//   document.getElementById("timer").innerText = timeLeft;
// function step() {
//     let dt = Date.now() - expected;

//     expected += interval;
//     timeLeft--;
//     document.getElementById("timer").innerText = timeLeft;
//     if(timeLeft<=0){
//     // document.getElementById("timer").innerText = timeLeft;
//       loadImage();
//       start();
//       return;
//     }
//     setTimeout(step, Math.max(0, interval - dt));
//   }

// }
