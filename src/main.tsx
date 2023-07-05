import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./apis/shortcuts";
import "./styles.css";
import { appWindow } from "@tauri-apps/api/window";

appWindow.setDecorations(true);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
