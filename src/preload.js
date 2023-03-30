const { contextBridge, ipcRenderer, remote } = require("electron");
// import {remote} from "electron";
remote.app.commandLine.appendSwitch("js-flags", "--max-old-space-size=8192");
console.log('preload.js')
contextBridge.exposeInMainWorld("electron", {
  // Print function
  print: (arg) => ipcRenderer.invoke("print", arg),
});
