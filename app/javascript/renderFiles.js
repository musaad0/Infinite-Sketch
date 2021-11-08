import { folders } from "./handleFileUpload.js";

export default function renderFiles(files) {
  const tableFiles = document.getElementById("table-files");
  const totNImages = document.getElementById("total_images");
  const tr = document.createElement("tr");

  tr.classList.add("is-clickable");

  tr.onclick = function () {
    const folderName = this.cells[0].innerText;
    const numOfImages = this.cells[1].innerText;
    handleFolderDelete(folderName);
    totNImages.innerText -= numOfImages;
    this.remove();
  };

  tr.innerHTML = `
  <td>
  <span class="tableText">
  ${ files[files.length - 1].folderName }
  </span>
  </td>
  <td>
  <span class="tableText">
  ${ files[files.length - 1].filesArr.length }
  </span>
  </td>`;

  tableFiles.appendChild(tr);
  const tmpTotal =
    files[files.length - 1].filesArr.length + parseInt(totNImages.textContent);
  totNImages.textContent = tmpTotal;
}
function handleFolderDelete(folderName) {
  for (let i = 0; i < folders.length; i++) {
    const file = folders[i];
    if (file.folderName === folderName) folders.splice(i, 1);
  }
}
