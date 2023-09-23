const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  startZoomMeeting: () => ipcRenderer.send("start-zoom-meeting"),
});
