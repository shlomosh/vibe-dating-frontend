import { authApi } from './auth';

interface RequestUploadRequest {
  mediaType: string;
  mediaSize: number;
  mediaBlob: string;
}

interface RequestUploadResponse {
  mediaId: string;
  uploadUrl: string;
  uploadMethod: string;
  uploadHeaders: {
    'key': string;
    'Content-Type': string;
    'x-amz-algorithm': string;
    'x-amz-credential': string;
    'x-amz-date': string;
    'x-amz-security-token': string;
    'policy': string;
    'x-amz-signature': string;
    [key: string]: string; // allow additional fields
  };
  expiresAt: string;
}

interface CompleteUploadRequest {
  uploadSuccess: boolean;
}

interface CompleteUploadResponse {
  mediaId: string;
  status: string;
  estimatedProcessingTime: number;
}

interface DeleteMediaResponse {
  mediaId: string;
  deleted: boolean;
  deletedAt: string;
}

interface ReorderMediaRequest {
  sortedMediaIds: string[];
}

interface ReorderMediaResponse {
  profileId: string;
  imageOrder: string[];
  updatedAt: string;
}

interface ProfileMediaItem {
  mediaId: string;
  url: string;
  mediaType: string;
  mediaBlob: string; // base64 encoded JSON string
  createdAt: string;
  updatedAt: string;
}

interface GetProfileMediaResponse {
  profileId: string;
  media: ProfileMediaItem[];
}

export interface UploadMediaResponse {
  mediaId: string;
  status: string;
  estimatedProcessingTime: number;
}

export interface S3UploadResponse {
  status: number;
  headers: Record<string, string>;
}

export class MediaApi {
  /**
   * Request upload URL for media
   * @param profileId - The profile ID
   * @param uploadRequest - Media upload request details
   * @returns Upload response with presigned URL
   */
  private async _requestUpload(profileId: string, uploadRequest: RequestUploadRequest): Promise<RequestUploadResponse> {
    const response = await authApi.apiRequest(`/profile/${profileId}/media`, {
      method: 'POST',
      body: JSON.stringify(uploadRequest)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to request upload URL');
    }

    return response.json();
  }

      /**
   * Upload file to S3 using presigned URL
   * @param uploadUrl - Presigned upload URL
   * @param file - File to upload
   * @param uploadHeaders - Upload headers from presigned URL response
   * @returns Upload success status
   */
  private async _uploadMediaFile(uploadUrl: string, file: File, uploadHeaders: RequestUploadResponse['uploadHeaders']): Promise<S3UploadResponse> {
    // S3 presigned POST URLs require FormData with specific field names
    // The uploadHeaders contain the required fields from the S3 POST policy
    const formData = new FormData();

    // Add all required fields from the S3 POST policy
    Object.entries(uploadHeaders).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Add the file - S3 POST policies typically expect the file to be the last field
    // The field name should match what's defined in the policy (usually 'file' or matches the key)
    formData.append('file', file);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    });

    // S3 POST uploads return 204 (No Content) on success
    if (response.status !== 204 && !response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed with status: ${response.status}: ${errorText}`);
    }

    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
    };
  }

  /**
   * Complete media upload and trigger processing
   * @param profileId - The profile ID
   * @param mediaId - The media ID from upload request
   * @param completeRequest - Upload completion details
   * @returns Completion response with processing status
   */
  private async _completeUpload(profileId: string, mediaId: string, completeRequest: CompleteUploadRequest): Promise<CompleteUploadResponse> {
    const response = await authApi.apiRequest(`/profile/${profileId}/media/${mediaId}`, {
      method: 'POST',
      body: JSON.stringify(completeRequest)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to complete upload');
    }

    return response.json();
  }

  /**
   * Complete media upload workflow
   * @param profileId - The profile ID
   * @param file - Media file to upload
   * @param blob - Media blob to include
   * @param type - Media type (image or video)
   * @returns Complete media upload result
   */
  async uploadMedia(
    profileId: string,
    mediaFile: File,
    mediaBlob: Record<string, any> = {},
  ): Promise<UploadMediaResponse> {
    try {
      // Request upload URL
      const uploadRequest: RequestUploadRequest = {
        mediaType: mediaFile.type,
        mediaSize: mediaFile.size,
        mediaBlob: btoa(JSON.stringify(mediaBlob)),
      };

      // Request upload URL
      const requestResponse = await this._requestUpload(profileId, uploadRequest);

      // Upload to S3 using POST method
      await this._uploadMediaFile(requestResponse.uploadUrl, mediaFile, requestResponse.uploadHeaders);

      // Complete upload
      const completeRequest: CompleteUploadRequest = {
        uploadSuccess: true,
      };

      const completeResponse = await this._completeUpload(profileId, requestResponse.mediaId, completeRequest);

      return {
        mediaId: requestResponse.mediaId,
        status: completeResponse.status,
        estimatedProcessingTime: completeResponse.estimatedProcessingTime,
      };
    } catch (error) {
      console.error('Profile image upload failed:', error);
      throw error;
    }
  }

  /**
   * Reorder profile media
   * @param profileId - The profile ID
   * @param reorderRequest - New image order
   * @returns Success response
   */
  async reorderMedia(profileId: string, reorderRequest: ReorderMediaRequest): Promise<ReorderMediaResponse> {
    const response = await authApi.apiRequest(`/profile/${profileId}/media`, {
      method: 'PUT',
      body: JSON.stringify(reorderRequest)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reorder media');
    }

    return response.json();
  }

  /**
   * Get all media for a profile
   * @param profileId - The profile ID
   * @returns Profile media list
   */
  async getProfileMedia(profileId: string): Promise<ProfileMediaItem[]> {
    const response = await authApi.apiRequest(`/profile/${profileId}/media`, {
      method: 'GET'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch profile media');
    }

    const result: GetProfileMediaResponse = await response.json();
    return result.media;
  }

  /**
   * Delete media file
   * @param profileId - The profile ID
   * @param mediaId - The media ID to delete
   * @returns Deletion response
   */
  async deleteMedia(profileId: string, mediaId: string): Promise<DeleteMediaResponse> {
    const response = await authApi.apiRequest(`/profile/${profileId}/media/${mediaId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete media');
    }

    return response.json();
  }
}

// Create singleton instance
export const mediaApi = new MediaApi();
