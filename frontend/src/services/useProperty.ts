// src/hooks/useProperty.ts

import { useState, useCallback } from 'react';
import propertyService, {
  Property,
  CreatePropertyData,
  UpdatePropertyData,
  VerificationStatus,
  UploadUrlRequest
} from '../services/PropertyService';

interface UsePropertyReturn {
  properties: Property[];
  currentProperty: Property | null;
  verificationStatus: VerificationStatus | null;
  loading: boolean;
  error: string | null;
  fetchUserProperties: () => Promise<Property[]>;
  fetchProperty: (id: string) => Promise<Property | null>;
  createProperty: (data: CreatePropertyData) => Promise<Property | null>;
  updateProperty: (id: string, data: UpdatePropertyData) => Promise<Property | null>;
  uploadDocument: (propertyId: string, file: File, documentName: string) => Promise<string | null>;
  getVerificationStatus: (propertyId: string) => Promise<VerificationStatus | null>;
  submitToDaobitat: (propertyId: string) => Promise<boolean>;
}

/**
 * Hook for managing property operations
 */
const useProperty = (): UsePropertyReturn => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all properties belonging to the current user
   */
  const fetchUserProperties = useCallback(async (): Promise<Property[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const propertiesData = await propertyService.getUserProperties();
      setProperties(propertiesData);
      return propertiesData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a single property by ID
   */
  const fetchProperty = useCallback(async (id: string): Promise<Property | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const propertyData = await propertyService.getProperty(id);
      setCurrentProperty(propertyData);
      return propertyData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch property');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new property
   */
  const createProperty = useCallback(async (data: CreatePropertyData): Promise<Property | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const newProperty = await propertyService.createProperty(data);
      // Update the local state with the new property
      setProperties(prevProperties => [...prevProperties, newProperty]);
      setCurrentProperty(newProperty);
      return newProperty;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create property');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an existing property
   */
  const updateProperty = useCallback(async (id: string, data: UpdatePropertyData): Promise<Property | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedProperty = await propertyService.updateProperty(id, data);
      
      // Update the local state
      setProperties(prevProperties => 
        prevProperties.map(prop => prop._id === id ? updatedProperty : prop)
      );
      
      if (currentProperty && currentProperty._id === id) {
        setCurrentProperty(updatedProperty);
      }
      
      return updatedProperty;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update property');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentProperty]);

  /**
   * Upload a document for a property
   */
  const uploadDocument = useCallback(async (
    propertyId: string, 
    file: File, 
    documentName: string
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Get a secure upload URL
      const uploadUrlRequest: UploadUrlRequest = {
        fileName: file.name,
        contentType: file.type,
        propertyId
      };
      
      const uploadUrlResponse = await propertyService.getDocumentUploadUrl(uploadUrlRequest);
      
      // 2. Upload the file to the provided URL
      await propertyService.uploadFile(
        uploadUrlResponse.data.uploadUrl,
        file,
        file.type
      );
      
      // 3. Add the document to the property
      const document = {
        name: documentName,
        url: uploadUrlResponse.data.fileUrl
      };
      
      const updatedProperty = await propertyService.addPropertyDocument(propertyId, document);
      
      // 4. Update the local state
      if (currentProperty && currentProperty._id === propertyId) {
        setCurrentProperty(updatedProperty);
      }
      
      setProperties(prevProperties => 
        prevProperties.map(prop => prop._id === propertyId ? updatedProperty : prop)
      );
      
      // 5. Return the file URL
      return uploadUrlResponse.data.fileUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentProperty]);

  /**
   * Get the verification status of a property
   */
  const getVerificationStatus = useCallback(async (
    propertyId: string
  ): Promise<VerificationStatus | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const status = await propertyService.getPropertyVerificationStatus(propertyId);
      setVerificationStatus(status);
      return status;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get verification status');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Submit a property to Daobitat
   */
  const submitToDaobitat = useCallback(async (propertyId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      
      
      // Refresh property and verification status after submission
      await fetchProperty(propertyId);
      await getVerificationStatus(propertyId);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit to Daobitat');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchProperty, getVerificationStatus]);

  return {
    properties,
    currentProperty,
    verificationStatus,
    loading,
    error,
    fetchUserProperties,
    fetchProperty,
    createProperty,
    updateProperty,
    uploadDocument,
    getVerificationStatus,
    submitToDaobitat
  };
};

export default useProperty;