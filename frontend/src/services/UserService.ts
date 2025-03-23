// src/services/UserService.ts

import axios from 'axios';

// API base URL - consider moving this to an environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://who-deed-it-hzfv.vercel.app';

// Types for API requests and responses
export interface WorldIDCredential {
  credential: string;
  walletAddress: string;
  nullifier_hash: string;
}

export interface UserProfile {
  _id: string;
  walletAddress: string;
  name?: string;
  email?: string;
  phone?: string;
  role: 'lister' | 'agent' | 'buyer' | 'renter' | 'admin' | 'superadmin';
  profileImage?: string;
  verified: {
    email: boolean;
    phone: boolean;
    wallet: boolean;
  };
  worldIdVerified: boolean;
  worldIdVerifiedAt?: string;
  properties: string[];
  wishlist: string[];
  rating: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  status: string;
  data: {
    token: string;
    user: UserProfile;
  };
}

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
}

export interface UploadUrlRequest {
  fileName: string;
  contentType: string;
  propertyId: string;
}

export interface UploadUrlResponse {
  status: string;
  data: {
    uploadUrl: string;
    fileUrl: string;
    expiresIn: number;
  };
}

export interface PropertyDocument {
  name: string;
  url: string;
}

export interface VerificationStatus {
  propertyId: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationNotes?: string;
  documents: {
    id: string;
    name: string;
    verified: boolean;
    verifiedAt: string | null;
  }[];
  listedOnDaobitat: boolean;
  daobitatListingId: string | null;
}

/**
 * Service for handling user-related API operations
 */
class UserService {
  private token: string | null = null;

  /**
   * Set the authentication token for API requests
   */
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('whodeedit_token', token);
  }

  /**
   * Get the stored authentication token
   */
  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('whodeedit_token');
    }
    return this.token;
  }

  /**
   * Clear the authentication token
   */
  clearToken() {
    this.token = null;
    localStorage.removeItem('whodeedit_token');
  }

  /**
   * Get authorization headers for API requests
   */
  private getAuthHeaders() {
    const token = this.getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  /**
   * Authenticate with World ID
   */
  async authenticateWithWorldID(credentials: WorldIDCredential): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/world-id`, credentials);
      if (response.data.data.token) {
        this.setToken(response.data.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('World ID authentication error:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<UserProfile> {
    try {
      const response = await axios.get<{ status: string; data: UserProfile }>(
        `${API_BASE_URL}/auth/me`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: ProfileUpdateData): Promise<UserProfile> {
    try {
      const response = await axios.patch<{ status: string; data: UserProfile }>(
        `${API_BASE_URL}/auth/profile`,
        profileData,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Get a secure URL for document upload
   */
  async getDocumentUploadUrl(request: UploadUrlRequest): Promise<UploadUrlResponse> {
    try {
      const response = await axios.post<UploadUrlResponse>(
        `${API_BASE_URL}/uploads/document`,
        request,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Get upload URL error:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Upload a file using the pre-signed URL
   */
  async uploadFile(uploadUrl: string, file: File, contentType: string): Promise<void> {
    try {
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': contentType,
        },
      });
    } catch (error) {
      console.error('File upload error:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Add a document to a property
   */
  async addDocumentToProperty(propertyId: string, document: PropertyDocument): Promise<any> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/properties/${propertyId}/documents`,
        document,
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Add document error:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Get property verification status
   */
  async getPropertyVerificationStatus(propertyId: string): Promise<VerificationStatus> {
    try {
      const response = await axios.get<{ status: string; data: VerificationStatus }>(
        `${API_BASE_URL}/properties/${propertyId}/verification`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Get verification status error:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Submit property to Daobitat
   */
  async submitPropertyToDaobitat(propertyId: string): Promise<any> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/properties/${propertyId}/submit-to-daobitat`,
        {},
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error('Submit to Daobitat error:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleApiError(error: any): Error {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || 'An error occurred';

      // Handle authentication errors
      if (statusCode === 401) {
        this.clearToken();
        return new Error('Authentication expired. Please log in again.');
      }

      return new Error(errorMessage);
    } else if (error.request) {
      // The request was made but no response was received
      return new Error('No response from server. Please check your internet connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      return new Error('Failed to make request. Please try again later.');
    }
  }

  /**
   * Log out the current user
   */
  logout(): void {
    this.clearToken();
    // Additional cleanup if needed
  }
}

// Create a singleton instance
const userService = new UserService();

export default userService;