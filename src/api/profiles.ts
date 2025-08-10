import { authApi } from './auth';
import { ProfileRecord } from '@/types/profile';

export interface ProfileResponse {
  profileId: string;
  success: boolean;
  message: string;
}

export class ProfileApi {
  /**
   * Get a profile by ID
   * @returns ProfileRecord if found, null if not found
   */
  async getProfile(profileId: string): Promise<ProfileRecord | null> {
    const response = await authApi.apiRequest(`/profile/${profileId}`, {
      method: 'GET'
    });

    if (response.status === 404 || !response.ok) {
      return null;
    }

    const data = await response.json();
    return data.profile || null;
  }

  /**
   * Create or update a profile (upsert operation)
   */
  async upsertProfile(profileId: string, profileData: ProfileRecord): Promise<ProfileResponse> {
    const response = await authApi.apiRequest(`/profile/${profileId}`, {
      method: 'PUT',
      body: JSON.stringify({
        profile: profileData
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create/update profile');
    }

    return response.json();
  }

  /**
   * Delete a profile
   */
  async deleteProfile(profileId: string): Promise<ProfileResponse> {
    const response = await authApi.apiRequest(`/profile/${profileId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete profile');
    }

    return response.json();
  }
}

// Create singleton instance
export const profileApi = new ProfileApi();
