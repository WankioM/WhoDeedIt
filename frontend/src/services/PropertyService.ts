// src/services/PropertyService.ts

import axios from 'axios';
import userService from './UserService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://who-deed-it-hzfv.vercel.app';

// Types for property-related data
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PropertyDocument {
  name: string;
  url: string;
  verified?: boolean;
  verifiedAt?: string | null;
}

export interface PropertyOwner {
  _id: string;
  name?: string;
  walletAddress: string;
  worldIdVerified: boolean;
}

export interface Property {
  _id: string;
  propertyName: string;
  location: string;
  streetAddress: string;
  coordinates: Coordinates;
  propertyType: 'Residential' | 'Commercial' | 'Land' | 'Special-purpose' | 'Vacation/Short-term rentals';
  specificType: string;
  price: number;
  space: number;
  bedrooms?: number;
  bathrooms?: number;
  images?: string[];
  documents?: PropertyDocument[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationNotes?: string;
  listedOnDaobitat: boolean;
  daobitatListingId?: string;
  owner: string | PropertyOwner;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyData {
  propertyName: string;
  location: string;
  streetAddress: string;
  coordinates: Coordinates;
  propertyType: 'Residential' | 'Commercial' | 'Land' | 'Special-purpose' | 'Vacation/Short-term rentals';
  specificType: string;
  price: number;
  space: number;
  bedrooms?: number;
  bathrooms?: number;
  images?: string[];
}

export interface UpdatePropertyData {
  propertyName?: string;
  location?: string;
  streetAddress?: string;
  coordinates?: Coordinates;
  propertyType?: 'Residential' | 'Commercial' | 'Land' | 'Special-purpose' | 'Vacation/Short-term rentals';
  specificType?: string;
  price?: number;
  space?: number;
  bedrooms?: number;
  bathrooms?: number;
  images?: string[];
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

export interface UploadUrlRequest {
  fileName: string;
  contentType: string;
  propertyId?: string;
}

export interface UploadUrlResponse {
  status: string;
  data: {
    uploadUrl: string;
    fileUrl: string;
    expiresIn: number;
  };
}

/**
 * Service for handling property-related API operations
 */
class PropertyService {
  /**
   * Get authorization headers for API requests
   */
  private getAuthHeaders() {
    const token = userService.getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  /**
   * Get a property by ID
   */
  async getProperty(id: string): Promise<Property> {
    try {
      const response = await axios.get<{ status: string; data: Property }>(
        `${API_BASE_URL}/properties/${id}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Get property error:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Create a new property
   */
  async createProperty(propertyData: CreatePropertyData): Promise<Property> {
    try {
      const response = await axios.post<{ status: string; data: Property }>(
        `${API_BASE_URL}/properties`,
        propertyData,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Create property error:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Update a property
   */
  async updateProperty(id: string, updateData: UpdatePropertyData): Promise<Property> {
    try {
      const response = await axios.patch<{ status: string; data: Property }>(
        `${API_BASE_URL}/properties/${id}`,
        updateData,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Update property error:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Get all properties belonging to the current user
   */
  async getUserProperties(): Promise<Property[]> {
    try {
      const response = await axios.get<{ status: string; data: Property[] }>(
        `${API_BASE_URL}/properties/user/all`,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Get user properties error:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Add a document to a property
   */
  async addPropertyDocument(propertyId: string, document: { name: string; url: string }): Promise<Property> {
    try {
      const response = await axios.post<{ status: string; data: Property }>(
        `${API_BASE_URL}/properties/${propertyId}/documents`,
        document,
        this.getAuthHeaders()
      );
      return response.data.data;
    } catch (error) {
      console.error('Add property document error:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Get a secure URL for document uploading
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
        userService.clearToken();
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
}

// Create a singleton instance
const propertyService = new PropertyService();

export default propertyService;