/// <reference types="vite/client" />

// Electron API declarations
interface ElectronAPI {
  onMenuAction: (callback: (event: any, action: string) => void) => void;
  removeAllListeners: (channel: string) => void;
  platform: string;
  versions: any;
  saveData: (key: string, data: any) => Promise<{ success: boolean; path?: string; error?: string }>;
  loadData: (key: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  getDataPath: () => Promise<{ success: boolean; path?: string; error?: string }>;
}

interface AppInfo {
  name: string;
  version: string;
  isElectron: boolean;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    appInfo: AppInfo;
  }
}
