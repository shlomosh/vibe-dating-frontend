import { LocalStorage as Storage } from '@/utils/local-storage';
//import { CloudStorage as Storage} from '@/utils/cloud-storage';
import { StorageKeys } from '@/config';

import { initData, initDataRaw } from '@telegram-apps/sdk-react';

// Configuration
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface AuthData {
  token: string;
  userId: string;
  profileIds: string[];
}

export interface AuthError {
  error: string;
  code?: string;
}

export class AuthService {
  private authData: AuthData | null = null;
  private initialized: boolean = false;

  constructor() {
    // Initialize with default values, will be populated in initialize()
    this.authData = null;
  }

  /**
   * Initialize the auth service by loading stored data
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      const storedAuthData = await Storage.getItem<AuthData>(StorageKeys.UserAuth);

      if (storedAuthData?.token && storedAuthData?.userId) {
        this.authData = storedAuthData;
      } else {
        this.authData = null;
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize auth service:', error);
      this.authData = null;
      this.initialized = true;
    }
  }

  /**
   * Initialize Telegram WebApp and authenticate user
   */
  async initializeTelegram(): Promise<AuthData> {
    try {
      // Ensure auth service is initialized
      await this.initialize();

      // Get Telegram authentication data using the SDK
      const telegramInitData = initDataRaw();
      const telegramUser = initData.user();

      if (!telegramInitData || !telegramUser) {
        throw new Error('Telegram authentication data not available');
      }

      // Initialize Telegram WebApp
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp as any;
        tg.ready();
        tg.expand();
      }

      // Authenticate with backend
      const authResult = await this.authenticateWithTelegram(telegramInitData, telegramUser);

      return authResult;

    } catch (error) {
      console.error('Authentication initialization failed:', error);
      throw error;
    }
  }

  /**
   * Authenticate with Telegram data
   */
  async authenticateWithTelegram(initData: string, telegramUser: any): Promise<AuthData> {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/auth/platform`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: 'telegram',
          platformToken: initData,
          platformMetadata: telegramUser
        })
      });

      if (!response.ok) {
        const errorData: AuthError = await response.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      const authData: AuthData = await response.json();

      // Store authentication data
      this.authData = authData;

      Storage.setItem(StorageKeys.UserAuth, this.authData);

      return authData;

    } catch (error) {
      console.error('Telegram authentication failed:', error);
      throw error;
    }
  }

  /**
   * Make authenticated API request
   */
  async apiRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    // Ensure auth service is initialized
    await this.initialize();

    if (!this.authData?.userId) {
      throw new Error('User not authenticated');
    }

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authData.token}`,
        ...options.headers,
      },
    };

    const response = await fetch(`${VITE_API_BASE_URL}${endpoint}`, config);

    // Handle token expiration
    if (response.status === 401) {
      await this.logout();
      throw new Error('Authentication expired. Please re-authenticate.');
    }

    return response;
  }

  async logout(): Promise<void> {
    this.authData = null;
    await Storage.deleteItem(StorageKeys.UserAuth);
  }

  async getAuthentication(): Promise<{
    token: string | null;
    userId: string | null;
    profileIds: string[];
  }> {
    await this.initialize();

    return {
      token: this.authData?.token || null,
      userId: this.authData?.userId || null,
      profileIds: this.authData?.profileIds || [],
    };
  }

  async getToken(): Promise<string | null> {
    await this.initialize();
    return this.authData?.token || null;
  }

  async getUserId(): Promise<string | null> {
    await this.initialize();
    return this.authData?.userId || null;
  }

  async getProfileIds(): Promise<string[]> {
    await this.initialize();
    return this.authData?.profileIds || [];
  }
}

// Create singleton instance
export const authService = new AuthService();
