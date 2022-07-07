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
const intervalInput = document.getElementById("setTimer");
let interval = 30; // default value
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
  document.querySelector(element).classList.toggle("hidden");
}
function displayPlayer() {
  hideToggle(".startPage");
  hideToggle(".playerPage");
}

let finished = false;

function toggleImageTransition(bool) {
  if (bool) img.classList.add("imageOut");
  else img.classList.remove("imageOut");
}

function loadImage(n) {
  index += n;
  if (index == imagesLength) {
    pauseTimer();
    setIndex();
    finished = true;
  }
  img.src = images[index];
  img.onload = () => {
    toggleImageTransition(false);
  };
}

function setCustomInterval() {
  let intervalInputValue = intervalInput.value;
  if (!intervalInputValue) return;

  if (intervalInputValue[intervalInputValue.length - 1].toLowerCase() === "m") {
    interval = parseInt(intervalInputValue);
    interval *= 60;
    return;
  }
  interval = parseInt(intervalInputValue);

  if (interval <= 0) interval = 30;
  if ((interval === 1) | (interval === 2)) interval = 3;
}

function setIndex() {
  index = 0;
  if (continueToggle) {
    index = parseInt(localStorage.getItem("indexStopped"));
    let indexStopped = localStorage.getItem("indexStopped");
    index = indexStopped === null ? 0 : parseInt(indexStopped);
  }
}

function startPlayer() {
  if (folders.length === 0) return;

  setCustomInterval();
  progressBar.max = interval;

  setIndex();

  console.log(interval);
  timer = new Timer(interval);

  getImages();
  imagesLength = images.length;
  displayPlayer();
  timer.start();
  loadImage(0);
}

// FOOTER CONTROLS AND EVENT LISTENERS
let pauseToggle = false;
function pauseTimer() {
  const pauseText = document.getElementById("pauseText");
  timer.stop();
  if (pauseToggle) timer.start();
  document.getElementById("pauseIcon").classList.toggle("hidden");
  document.getElementById("playIcon").classList.toggle("hidden");

  // pauseToggle ? pauseText.textContent="PAUSE":pauseText.textContent="PLAY";
  pauseToggle = !pauseToggle;
}
pause.addEventListener("click", pauseTimer);

function previousImg() {
  if (index === 0) return;
  timer.counter = 0;
  pauseTimer();
  loadImage(-1);
  pauseTimer();
}

function nextImg() {
  if (index >= images.length - 1) return;
  timer.counter = 0;
  pauseTimer();
  loadImage(1);
  pauseTimer();
}

function hideFooterFunc() {
  controlsFooter.classList.add("hidden");
  img.style.height = "97vh";
  hideFooterToggle = !hideFooterToggle;
}

function showFooterFunc() {
  controlsFooter.classList.remove("hidden");
  img.style.height = "calc(100vh - 3.6rem)";
  hideFooterToggle = !hideFooterToggle;
}

document.getElementById("start").addEventListener("click", startPlayer);

hideFooter.addEventListener("click", hideFooterFunc);

document.addEventListener("keyup", (e) => {
  const key = e.key;
  if (key === "ArrowRight") nextImg();
  if (key === "ArrowLeft") previousImg();
  if (key === " ") pauseTimer();

  if (
    e.key === "Escape" &&
    document.querySelector(".startpage").classList.contains("hidden")
  ) {
    modal();
  }
});

img.addEventListener("click", () => {
  if (hideFooterToggle) showFooterFunc();
  else hideFooterFunc();
});

next.addEventListener("click", nextImg);
previous.addEventListener("click", previousImg);

// SET TIME BUTTONS
document.querySelectorAll(".buttonTime").forEach((button) => {
  button.addEventListener("click", () => {
    intervalInput.value = button.value;
  });
});

// Modal functionality
const modalBackground = document.querySelector(".modalBackground");
const modalYes = document.getElementById("modalYes");
const modalNo = document.getElementById("modalNo");
const modalHome = document.getElementById("modalHome");
// const closeButton = document.querySelector(".delete");
const endModal = document.getElementById("endModal");

function modal() {
  endModal.classList.toggle("hidden");
}

end.addEventListener("click", modal);

// click yes to save current session
modalYes.addEventListener("click", () => {
  // let user start from the last image if last session was finished(for now)
  if (finished) index = imagesLength - 1;

  const folderPaths = folders.map((folder) => {
    let path = "";
    const folderName = folder.folderName;
    const fullPath = folder.filesArr[0].split("\\");
    for (const fName of fullPath) {
      path += fName;
      if (fName === folderName) break;
      path += "/";
    }
    return path;
  });
  // save folder paths to local storage
  localStorage.setItem("folderPaths", JSON.stringify(folderPaths));
  localStorage.setItem("indexStopped", index);

  location.href = "index.html";
});

modalBackground.addEventListener("click", () => {
  modal();
});

modalNo.addEventListener("click", () => {
  modal();
});

modalHome.addEventListener("click", () => {
  location.href = "index.html";
});

export { loadImage, toggleImageTransition };
