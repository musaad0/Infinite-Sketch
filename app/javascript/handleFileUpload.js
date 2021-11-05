import renderFiles from "./renderFiles.js";
const uploadInput = document.getElementById("upload");
const continueButton = document.getElementById("continue")
let folders = [];
let continueToggle = false;

continueButton.addEventListener("click",()=>{
  if(continueToggle) return;

  api.send("toMain","gimme");
  api.receive("fromMain", (files) => {
    for (const file of files) {
      folders.push(file);
      renderFiles(folders);
    }
      
  });
  
  continueToggle = true;
})

function handleUploadFiles() {
  const fileList = this.files; /* now you can work with the file list */
  console.log(fileList);
  const fileListLength = this.files.length
  if(fileListLength===0) return;
  document.getElementById("continue").disabled = false;
  const folderName = fileList[0].webkitRelativePath.split("/")[0];
  
  let files = []
  
  for(let i=0;i<fileListLength;i++){
      files.push(fileList[i].path);
  }

  folders.push({ folderName, filesArr: files});
  renderFiles(folders);

}
export {folders,continueToggle}

uploadInput.addEventListener("change", handleUploadFiles, false);


