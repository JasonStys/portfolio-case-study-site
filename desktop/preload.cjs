/**
 * @file Exposes only fixed navigation, state, approved-link and Quit messages to the native main frame.
 * Functions: isolated bridge wrappers and fixed navigation/closing subscriptions with unsubscription.
 * Variables: literal IPC names; no filesystem, process, generic IPC or arbitrary URL opener.
 * Line locations: see docs/CODE_INDEX.md for the generated source index.
 */
"use strict";
const { contextBridge, ipcRenderer } = require("electron");
if (process.isMainFrame) {
  contextBridge.exposeInMainWorld(
    "portfolioNative",
    Object.freeze({
      state: () => ipcRenderer.invoke("portfolio:state"),
      openLink: (value) => ipcRenderer.invoke("portfolio:open", value),
      navigate: (action) => ipcRenderer.invoke("portfolio:navigate", action),
      quit: () => ipcRenderer.send("portfolio:quit"),
      onNavigation: (callback) => {
        const listener = (_event, value) => callback(value);
        ipcRenderer.on("portfolio:navigation", listener);
        return () => ipcRenderer.removeListener("portfolio:navigation", listener);
      },
      onClosing: (callback) => {
        const listener = () => callback();
        ipcRenderer.on("portfolio:closing", listener);
        return () => ipcRenderer.removeListener("portfolio:closing", listener);
      },
    }),
  );
}
