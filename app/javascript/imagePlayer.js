import { continueToggle, folders } from "./handleFileUpload.js";
import { Timer } from "./timer.js";
const img = document.getElementById("mainImg");
const progressBar = document.getElementById("progressBar");
const previous = document.getElementById("previous");
const pause = document.getElementById("pause");
const next = document.getElementById("next");
const end = document.getElementById("end");
const hideFooter = document.getElementById("hide");
const controlsFooter = document.getElementById("controlsFooter");
const interval = document.getElementById("setTimer");
let hideFooterToggle = false;
let timer;
let index;
let images = [];
let imagesLength;

function getImages() {
  // push all image paths to an array
  for (let i = 0; i < folders.length; i++) images.push(...folders[i].filesArr);
}
// displaying content
function hideToggle(element) {
  document.querySelector(element).classList.toggle("is-hidden");
}
function displayPlayer() {
  hideToggle(".startPage");
  hideToggle(".playerPage");
}

let finished = false;
function loadImage(n) {

  index += n;
  if(index == imagesLength){
    pauseTimer();
    setIndex();
    finished = true;
  }
  img.src = images[index];
  img.onload = () => {
    progressBar.classList.remove("is-danger");
  };

}
function setCustomInterval() {
  if (!interval.value) interval.value = "5s";
  const intervalVal = interval.value;
  progressBar.max = parseInt(intervalVal);
  if (intervalVal[intervalVal.length - 1].toLowerCase() === "m")
    progressBar.max *= 60;
}

function setIndex(){
  index = 0;
  if (continueToggle) {
    index = parseInt(localStorage.getItem("indexStopped"));
    let indexStopped = localStorage.getItem("indexStopped");
    index = indexStopped === null ? 0 : parseInt(indexStopped);
  }
}

function startPlayer() {
    // if interval hasn't been set & check input
  if(folders.length===0) return;
  if (progressBar.max == 1) setCustomInterval();

    
  setIndex();

  timer = new Timer(progressBar.max);


  document.documentElement.style.overflow = "hidden";

  getImages();
  imagesLength = images.length;
  displayPlayer();
  timer.start();
  loadImage(0);
}


// MODAL END BUTTON
const modalBackground = document.querySelector(".modal-background");
const modalYes = document.getElementById("modalYes");
const modalNo = document.getElementById("modalNo");
const closeButton = document.querySelector(".delete");
const endModal = document.getElementById("endModal");

function modal() {
  endModal.classList.add("is-active");
}


end.addEventListener("click", modal);

// click yes to save current session
modalYes.addEventListener("click", () => {

  // let user start from the last image if last session was finished(for now)
  if(finished) index = imagesLength-1;

  const folderPaths = folders.map((folder)=>{
    let path = "";
    const folderName = folder.folderName;
    const fullPath = folder.filesArr[0].split("\\");
    for (const fName of fullPath) {
      path += fName;
      if (fName === folderName) break;
      path += "/";
    }
    return path;
  })
  // save folder paths to local storage
  localStorage.setItem("folderPaths", JSON.stringify(folderPaths));
  localStorage.setItem("indexStopped", index);

  location.href = "index.html";
});

// FOOTER CONTROLS AND EVENT LISTENERS
let pauseToggle = false;
function pauseTimer() {
const pauseText = document.getElementById("pauseText");
  timer.stop();
  if (pauseToggle)  timer.start();
  document.getElementById("pauseIcon").classList.toggle("fa-play");

  pauseToggle ? pauseText.textContent="PAUSE":pauseText.textContent="PLAY";
  pauseToggle = !pauseToggle;
}
pause.addEventListener("click", pauseTimer);

function previousImg() {
    if(index === 0) return;
  timer.counter = 0;
  pauseTimer();
  loadImage(-1);
  pauseTimer();
}

function nextImg() {
    if(index >= images.length-1) return;
  timer.counter = 0;
  pauseTimer();
  loadImage(1);
  pauseTimer();
}

function hideFooterFunc(){
  controlsFooter.classList.add("is-hidden");
  img.style.height = "99vh";
  hideFooterToggle = !hideFooterToggle;
}

function showFooterFunc(){
  controlsFooter.classList.remove("is-hidden");
  img.style.height = "calc(100vh - 4.2rem)";
  hideFooterToggle = !hideFooterToggle;
}

document.getElementById("start").addEventListener("click", startPlayer);

hideFooter.addEventListener("click",hideFooterFunc);

document.addEventListener("keyup", (e) => {
  const key = e.key;
  if (key === "ArrowRight") nextImg();
  if (key === "ArrowLeft") previousImg();
  if (key === " ") pauseTimer();
});

img.addEventListener("click",()=>{
  if(hideFooterToggle)
    showFooterFunc();
  else
    hideFooterFunc();

});

modalNo.addEventListener("click", () => {
  endModal.classList.remove("is-active");
});

next.addEventListener("click", nextImg);
previous.addEventListener("click", previousImg);

// SET TIME BUTTONS
document.querySelectorAll(".buttonTime").forEach((button) => {
  button.addEventListener("click", () => {
    interval.value = button.value;
  });
});

// MODAL EVENT LISTENERS
modalBackground.addEventListener("click", () => {
  endModal.classList.remove("is-active");
});

closeButton.addEventListener("click", () => {
  endModal.classList.remove("is-active");
});


export { loadImage };