import { cloudStorage, initData } from '@telegram-apps/sdk-react';
import { LocalStorage } from '@/utils/local-storage';

export class CloudStorage {
  /**
   * Get an item from cloudStorage
   * @param key - The key to retrieve
   * @returns The stored value or null if not found
   */
  static async getItem<T>(key: string): Promise<T | null> {
    if (initData?.user()?.id === 1) {
      return LocalStorage.getItem(key);
    }

    try {
      const item = await cloudStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key} from cloudStorage:`, error);
      return null;
    }
  }

  /**
   * Set an item in cloudStorage
   * @param key - The key to store
   * @param value - The value to store
   */
  static async setItem<T>(key: string, value: T): Promise<void> {
    if (initData?.user()?.id === 1) {
      return LocalStorage.setItem(key, value);
    }

    try {
      const serializedValue = JSON.stringify(value);
      await cloudStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error setting item ${key} in cloudStorage:`, error);
    }
  }

  /**
   * Remove an item from cloudStorage
   * @param key - The key to remove
   */
  static async deleteItem(key: string): Promise<void> {
    if (initData?.user()?.id === 1) {
      return LocalStorage.deleteItem(key);
    }

    try {
      cloudStorage.deleteItem(key);
    } catch (error) {
      console.error(`Error deleting item ${key} from cloudStorage:`, error);
    }
  }

  /**
   * Get all keys from cloudStorage
   * @returns Array of all keys in cloudStorage
   */
  static async getKeys(): Promise<string[]> {
    if (initData?.user()?.id === 1) {
      return LocalStorage.getKeys();
    }

    try {
      return Object.keys(cloudStorage);
    } catch (error) {
      console.error('Error getting keys from cloudStorage:', error);
      return [];
    }
  }

  /**
   * Clear all items from cloudStorage
   */
  static async clear(): Promise<void> {
    if (initData?.user()?.id === 1) {
      return LocalStorage.clear();
    }

    try {
      cloudStorage.clear();
    } catch (error) {
      console.error('Error clearing cloudStorage:', error);
    }
  }
}