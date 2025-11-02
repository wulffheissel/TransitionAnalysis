import { ipcRenderer, contextBridge } from 'electron';

// The interface for the context bridge
export interface ContextBridgeApi {
  savePDF: (latexString: string) => void;
  saveTXT: (content: string) => void;
  saveCSV: (content: string) => void;
  readCSV: () => Promise<string[]>;
  readTA3: () => Promise<string>;
  saveTA3: (content: string) => void;
}

// The window api, which calls functions defined in index.ts using IPC
const WindowAPI: ContextBridgeApi = {
  savePDF: (latexString: string) => ipcRenderer.send('savePDF', latexString),

  saveTXT: (content: any) => ipcRenderer.send('saveTXT', content),

  saveCSV: (content: any) => ipcRenderer.send('saveCSV', content),

  readCSV: () => ipcRenderer.invoke('readCSV'),

  readTA3: () => ipcRenderer.invoke('readTA3'),

  saveTA3: (content: any) => ipcRenderer.send('saveTA3', content),
};

// Exposes window.api in the renderer processes
contextBridge.exposeInMainWorld('api', WindowAPI);
