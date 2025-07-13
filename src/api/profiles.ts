import { authService } from './auth';

export interface Profile {
  id: string;
  userId: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  lookingFor: string[];
  location?: {
    latitude: number;
    longitude: number;
    geohash: string;
    precision: number;
    lastUpdated: string;
  };
  media: Record<string, {
    type: 'image' | 'video';
    url: string;
    thumbnailUrl: string;
    previewUrl?: string; // for videos
    order: number;
    metadata: {
      width: number;
      height: number;
      size: number;
      format: string;
      duration?: number; // for videos
    };
  }>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileData {
  name: string;
  age: number;
  bio: string;
  interests: string[];
  lookingFor: string[];
}

export interface UpdateProfileData {
  name?: string;
  age?: number;
  bio?: string;
  interests?: string[];
  lookingFor?: string[];
}

export interface LocationData {
  latitude: number;
  longitude: number;
  precision?: number;
}

export class ProfileApiClient {
  /**
   * Get all profiles for the current user
   */
  async getProfiles(): Promise<Profile[]> {
    const response = await authService.apiRequest('/profiles');

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch profiles');
    }

    return response.json();
  }

  /**
   * Get a specific profile by ID
   */
  async getProfile(profileId: string): Promise<Profile> {
    const response = await authService.apiRequest(`/profiles/${profileId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch profile');
    }

    return response.json();
  }

  /**
   * Create a new profile
   */
  async createProfile(profileData: CreateProfileData): Promise<Profile> {
    const response = await authService.apiRequest('/profiles', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create profile');
    }

    return response.json();
  }

  /**
   * Update an existing profile
   */
  async updateProfile(profileId: string, profileData: UpdateProfileData): Promise<Profile> {
    const response = await authService.apiRequest(`/profiles/${profileId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }

    return response.json();
  }

  /**
   * Delete a profile
   */
  async deleteProfile(profileId: string): Promise<void> {
    const response = await authService.apiRequest(`/profiles/${profileId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete profile');
    }
  }

  /**
   * Set active profile
   */
  async setActiveProfile(profileId: string): Promise<void> {
    const response = await authService.apiRequest('/users/me/active-profile', {
      method: 'PUT',
      body: JSON.stringify({ profileId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to set active profile');
    }
  }

  /**
   * Update profile location
   */
  async updateLocation(profileId: string, location: LocationData): Promise<void> {
    const response = await authService.apiRequest(`/profiles/${profileId}/location`, {
      method: 'PUT',
      body: JSON.stringify(location)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update location');
    }
  }

  /**
   * Upload media to profile
   */
  async uploadMedia(profileId: string, file: File): Promise<{ mediaId: string; url: string; thumbnailUrl: string }> {
    const formData = new FormData();
    formData.append('media', file);

    const response = await authService.apiRequest(`/profiles/${profileId}/media`, {
      method: 'POST',
      headers: {
        // Remove Content-Type to let browser set it with boundary
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload media');
    }

    return response.json();
  }

  /**
   * Reorder profile media
   */
  async reorderMedia(profileId: string, mediaOrder: string[]): Promise<void> {
    const response = await authService.apiRequest(`/profiles/${profileId}/media/order`, {
      method: 'PUT',
      body: JSON.stringify({ mediaOrder })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reorder media');
    }
  }

  /**
   * Delete media from profile
   */
  async deleteMedia(mediaId: string): Promise<void> {
    const response = await authService.apiRequest(`/media/${mediaId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete media');
    }
  }
}

// Create singleton instance
export const profileApi = new ProfileApiClient();
