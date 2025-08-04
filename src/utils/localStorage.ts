// Utility functions for consistent data storage (file system for Electron, localStorage for web)

// Check if running in Electron
const isElectron = () => {
  return typeof window !== 'undefined' && (window as any).electronAPI !== undefined;
};

export const saveToStorage = async <T>(key: string, data: T): Promise<boolean> => {
  try {
    if (isElectron() && (window as any).electronAPI) {
      // Save to file system in Electron
      const result = await (window as any).electronAPI.saveData(key, data);
      if (result.success) {
        console.log(`Data saved to: ${result.path}`);
        return true;
      } else {
        console.error(`Error saving to file system: ${result.error}`);
        return false;
      }
    } else {
      // Fallback to localStorage for web
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    }
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    return false;
  }
};

export const loadFromStorage = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    if (isElectron() && (window as any).electronAPI) {
      // Load from file system in Electron
      const result = await (window as any).electronAPI.loadData(key);
      if (result.success && result.data !== null) {
        return result.data;
      }
    } else {
      // Fallback to localStorage for web
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    }
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
  }
  return defaultValue;
};

export const getStoragePath = async (): Promise<string | null> => {
  if (isElectron() && (window as any).electronAPI) {
    try {
      const result = await (window as any).electronAPI.getDataPath();
      return result.success ? result.path : null;
    } catch (error) {
      console.error('Error getting storage path:', error);
      return null;
    }
  }
  return 'Browser localStorage';
};

// Legacy functions for backward compatibility
export const saveToLocalStorage = <T>(key: string, data: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed;
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  return defaultValue;
};

export const setupBeforeUnloadSave = <T>(key: string, getData: () => T) => {
  const handleBeforeUnload = () => {
    if (isElectron() && (window as any).electronAPI) {
      // In Electron, save to file system
      (window as any).electronAPI.saveData(key, getData()).catch(console.error);
    } else {
      // In web, save to localStorage
      saveToLocalStorage(key, getData());
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('pagehide', handleBeforeUnload);
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    window.removeEventListener('pagehide', handleBeforeUnload);
  };
};