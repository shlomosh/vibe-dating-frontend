import { authApi } from './auth';
import { ProfileRecord } from '@/types/profile';

export interface ProfileResponse {
  profileId: string;
  success: boolean;
  message: string;
}

export class ProfileApi {
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
