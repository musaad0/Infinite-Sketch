import { folders } from "./handleFileUpload.js";

export default function renderFiles(files) {
  const tableFiles = document.getElementById("tableFiles");
  const totNImages = document.getElementById("totalImages");
  const tr = document.createElement("tr");

  tr.classList.add("hover:cursor-pointer");

  tr.onclick = function () {
    const folderName = this.cells[0].innerText;
    const numOfImages = this.cells[1].innerText;
    handleFolderDelete(folderName);
    totNImages.innerText -= numOfImages;
    // reset input
    document.getElementById("upload").value = "";

    this.remove();
  };

  tr.innerHTML = `
                <th scope="row" class="px-6 py-2.5 font-medium">
  ${files[files.length - 1].folderName}
                </th>
                <td class="px-6 py-2.5 text-center">
  ${files[files.length - 1].filesArr.length}
                </td>
  `;
  tr.classList.add(
    "hover:bg-neutral-600",
    "last:border-b",
    "border-neutral-600"
  );

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
