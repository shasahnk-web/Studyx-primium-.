
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
    const storageKey = STORAGE_KEYS[key];
    console.log(`Reading from localStorage key: ${storageKey}`);
    
    const data = localStorage.getItem(storageKey);
    
    if (!data || data === 'null' || data === 'undefined') {
      console.log(`No data found for key: ${storageKey}, returning fallback:`, fallback);
      return fallback;
    }
    
    const parsed = JSON.parse(data);
    
    if (!Array.isArray(parsed)) {
      console.warn(`Data for key ${storageKey} is not an array:`, parsed, 'returning fallback');
      return fallback;
    }
    
    console.log(`Successfully loaded ${parsed.length} items from ${storageKey}`);
    return parsed;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    
    // Clear corrupted data
    const storageKey = STORAGE_KEYS[key];
    localStorage.removeItem(storageKey);
    console.log(`Cleared corrupted data for key: ${storageKey}`);
    
    return fallback;
  }
};

// Generic function to set data in localStorage
export const setStorageData = <T>(key: keyof typeof STORAGE_KEYS, data: T[]): boolean => {
  try {
    const storageKey = STORAGE_KEYS[key];
    
    if (!Array.isArray(data)) {
      console.error(`Data for key ${key} is not an array:`, data);
      return false;
    }
    
    const serializedData = JSON.stringify(data);
    console.log(`Saving ${data.length} items to localStorage key: ${storageKey}`);
    
    localStorage.setItem(storageKey, serializedData);
    
    // Verify the data was saved correctly
    const verification = localStorage.getItem(storageKey);
    if (verification === serializedData) {
      console.log(`Successfully saved data to ${storageKey}`);
      return true;
    } else {
      console.error(`Data verification failed for key: ${storageKey}`);
      return false;
    }
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
    
    // Check if it's a quota exceeded error
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Consider clearing old data.');
    }
    
    return false;
  }
};

// Function to get all storage data at once
export const getAllStorageData = (): StorageData => {
  console.log('Loading all storage data...');
  
  const data = {
    batches: getStorageData('batches'),
    lectures: getStorageData('lectures'),
    notes: getStorageData('notes'),
    dpps: getStorageData('dpps'),
    liveLectures: getStorageData('liveLectures'),
  };
  
  console.log('All storage data loaded:', {
    batches: data.batches.length,
    lectures: data.lectures.length,
    notes: data.notes.length,
    dpps: data.dpps.length,
    liveLectures: data.liveLectures.length,
  });
  
  return data;
};

// Function to clear all data (useful for reset functionality)
export const clearAllStorageData = (): void => {
  console.log('Clearing all storage data...');
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
    console.log(`Cleared: ${key}`);
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
    console.log('Importing storage data...');
    const data: StorageData = JSON.parse(dataString);
    
    // Validate data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data format');
    }

    // Set each data type
    let successCount = 0;
    Object.entries(data).forEach(([key, value]) => {
      if (key in STORAGE_KEYS && Array.isArray(value)) {
        const success = setStorageData(key as keyof typeof STORAGE_KEYS, value);
        if (success) successCount++;
      }
    });

    console.log(`Successfully imported ${successCount} data types`);
    return successCount > 0;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

// Storage event listener for cross-tab synchronization
export const addStorageListener = (callback: () => void) => {
  const handleStorageChange = (e: StorageEvent) => {
    if (Object.values(STORAGE_KEYS).includes(e.key as any)) {
      console.log('Storage change detected for key:', e.key);
      callback();
    }
  };

  const handleCustomStorageChange = (e: CustomEvent) => {
    console.log('Custom storage event detected:', e.type);
    callback();
  };

  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('lecturesUpdated', handleCustomStorageChange as EventListener);
  window.addEventListener('batchesUpdated', handleCustomStorageChange as EventListener);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('lecturesUpdated', handleCustomStorageChange as EventListener);
    window.removeEventListener('batchesUpdated', handleCustomStorageChange as EventListener);
  };
};

// Debug function to inspect localStorage
export const debugLocalStorage = (): void => {
  console.log('=== localStorage Debug Info ===');
  
  Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
    const data = localStorage.getItem(storageKey);
    console.log(`${key} (${storageKey}):`, data ? JSON.parse(data) : 'No data');
  });
  
  console.log('Total localStorage usage:', 
    Object.keys(localStorage).reduce((total, key) => {
      return total + localStorage.getItem(key)!.length;
    }, 0), 'characters');
};
