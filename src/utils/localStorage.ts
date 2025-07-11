
// Utility functions for localStorage operations with error handling

export interface StorageData {
  batches: any[];
  lectures: any[];
  notes: any[];
  dpps: any[];
  liveLectures: any[];
}

const STORAGE_KEYS = {
  batches: 'studyx_batches',
  lectures: 'studyx_lectures',
  notes: 'studyx_notes',
  dpps: 'studyx_dpps',
  liveLectures: 'studyx_live_lectures',
} as const;

// Generic function to get data from localStorage
export const getStorageData = <T>(key: keyof typeof STORAGE_KEYS, fallback: T[] = []): T[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS[key]);
    if (!data) return fallback;
    
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    // Clear corrupted data
    localStorage.removeItem(STORAGE_KEYS[key]);
    return fallback;
  }
};

// Generic function to set data in localStorage
export const setStorageData = <T>(key: keyof typeof STORAGE_KEYS, data: T[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    return false;
  }
};

// Function to get all storage data at once
export const getAllStorageData = (): StorageData => {
  return {
    batches: getStorageData('batches'),
    lectures: getStorageData('lectures'),
    notes: getStorageData('notes'),
    dpps: getStorageData('dpps'),
    liveLectures: getStorageData('liveLectures'),
  };
};

// Function to clear all data (useful for reset functionality)
export const clearAllStorageData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Function to export all data (useful for backup)
export const exportStorageData = (): string => {
  const allData = getAllStorageData();
  return JSON.stringify(allData, null, 2);
};

// Function to import data (useful for restore)
export const importStorageData = (dataString: string): boolean => {
  try {
    const data: StorageData = JSON.parse(dataString);
    
    // Validate data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data format');
    }

    // Set each data type
    Object.entries(data).forEach(([key, value]) => {
      if (key in STORAGE_KEYS && Array.isArray(value)) {
        setStorageData(key as keyof typeof STORAGE_KEYS, value);
      }
    });

    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

// Storage event listener for cross-tab synchronization
export const addStorageListener = (callback: () => void) => {
  const handleStorageChange = (e: StorageEvent) => {
    if (Object.values(STORAGE_KEYS).includes(e.key as any)) {
      callback();
    }
  };

  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};
