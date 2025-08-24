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
  };
  expiresAt: string;
}

interface CompleteUploadRequest {
  uploadSuccess: boolean;
  s3ETag: string;
  actualSize: number;
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

export interface GeneralResponse {
  status: 'success' | 'error';
  message: string;
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
  private async _uploadMediaFile(uploadUrl: string, file: File, uploadHeaders: RequestUploadResponse['uploadHeaders']): Promise<GeneralResponse> {
    try {
      // Create FormData for S3 POST upload
      const formData = new FormData();

      // Add all required fields from presigned URL
      Object.entries(uploadHeaders).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Add file with the key from upload headers
      formData.append('file', file);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      return { status: 'success', message: 'File uploaded successfully' };
    } catch (error) {
      console.error('Media file upload failed:', error);
      throw error;
    }
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

      const uploadResponse = await this._requestUpload(profileId, uploadRequest);

      // Upload to S3 using POST method
      await this._uploadMediaFile(uploadResponse.uploadUrl, mediaFile, uploadResponse.uploadHeaders);

      // Complete upload
      const completeRequest: CompleteUploadRequest = {
        uploadSuccess: true,
        s3ETag: '', // S3 ETag would be available in production
        actualSize: mediaFile.size
      };

      const completeResponse = await this._completeUpload(profileId, uploadResponse.mediaId, completeRequest);

      return {
        mediaId: uploadResponse.mediaId,
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
