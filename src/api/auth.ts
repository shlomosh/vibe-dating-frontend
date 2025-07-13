import { StorageKeys } from '@/config';
import { initData, initDataRaw } from '@telegram-apps/sdk-react';

// Configuration
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface AuthData {
  token: string;
  userId: string;
  platform: string;
  platformId: string;
}

export interface AuthError {
  error: string;
  code?: string;
}

export class AuthService {
  private token: string | null = null;
  private userId: string | null = null;
  private isAuthenticated: boolean = false;

  constructor() {
    // Load stored authentication data
    this.token = localStorage.getItem(StorageKeys.UserAuthToken);
    this.userId = localStorage.getItem(StorageKeys.UserId);
    this.isAuthenticated = !!this.token && !!this.userId;
  }

    /**
   * Initialize Telegram WebApp and authenticate user
   */
  async initialize(): Promise<AuthData> {
    try {
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
      this.token = authData.token;
      this.userId = authData.userId;
      this.isAuthenticated = true;

      localStorage.setItem(StorageKeys.UserAuthToken, this.token);
      localStorage.setItem(StorageKeys.UserId, this.userId);

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
    if (!this.isAuthenticated) {
      throw new Error('User not authenticated');
    }

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        ...options.headers,
      },
    };

    const response = await fetch(`${VITE_API_BASE_URL}${endpoint}`, config);

    // Handle token expiration
    if (response.status === 401) {
      this.logout();
      throw new Error('Authentication expired. Please re-authenticate.');
    }

    return response;
  }

  /**
   * Logout user
   */
  logout(): void {
    this.token = null;
    this.userId = null;
    this.isAuthenticated = false;

    localStorage.removeItem(StorageKeys.UserAuthToken);
    localStorage.removeItem(StorageKeys.UserId);
  }

  /**
   * Check if user is authenticated
   */
  getAuthStatus(): { isAuthenticated: boolean; userId: string | null; hasToken: boolean } {
    return {
      isAuthenticated: this.isAuthenticated,
      userId: this.userId,
      hasToken: !!this.token
    };
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Get current user ID
   */
  getUserId(): string | null {
    return this.userId;
  }
}

// Create singleton instance
export const authService = new AuthService();
