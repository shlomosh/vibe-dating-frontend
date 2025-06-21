export class LocalStorage {
  /**
   * Get an item from localStorage
   * @param key - The key to retrieve
   * @returns The stored value or null if not found
   */
  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error);
      return null;
    }
  }

  /**
   * Set an item in localStorage
   * @param key - The key to store
   * @param value - The value to store
   */
  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error);
    }
  }

  /**
   * Remove an item from localStorage
   * @param key - The key to remove
   */
  static async deleteItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error deleting item ${key} from localStorage:`, error);
    }
  }

  /**
   * Get all keys from localStorage
   * @returns Array of all keys in localStorage
   */
  static async getKeys(): Promise<string[]> {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting keys from localStorage:', error);
      return [];
    }
  }

  /**
   * Clear all items from localStorage
   */
  static async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}
