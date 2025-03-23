import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import { useAuth } from '../../context/auth-provider';

// Form field types
interface PropertyForm {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  propertyType: string;
  documentType: string;
  description: string;
}

// Initial empty form state
const initialFormState: PropertyForm = {
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  propertyType: 'residential',
  documentType: 'deed',
  description: '',
};

// Property types
const propertyTypes = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'land', label: 'Land' },
  { value: 'other', label: 'Other' },
];

// Document types
const documentTypes = [
  { value: 'deed', label: 'Property Deed' },
  { value: 'title', label: 'Title Certificate' },
  { value: 'mortgage', label: 'Mortgage Document' },
  { value: 'taxRecord', label: 'Tax Record' },
  { value: 'other', label: 'Other Document' },
];

function VerifyOwnership() {
  const [formData, setFormData] = useState<PropertyForm>(initialFormState);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isAuthenticated, isVerified } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Redirect to verify identity if not verified
  useEffect(() => {
    if (isAuthenticated && !isVerified) {
      setError('You need to verify your identity before submitting property documents.');
    }
  }, [isAuthenticated, isVerified]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  // Remove a file from the uploads
  const handleRemoveFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isVerified) {
      setError('You must verify your identity before submitting property documents.');
      return;
    }
    
    // Validate form
    if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
      setError('Please fill in all required fields.');
      return;
    }
    
    if (files.length === 0) {
      setError('Please upload at least one document.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you would:
      // 1. Upload files to a secure storage
      // 2. Submit the form data and file references to your backend
      // 3. Store the property verification request in your database
      
      // For this demo, we'll simulate a successful submission
      
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For development purposes, always succeed
      setIsSubmitted(true);
      
      // Reset form after submission
      setFormData(initialFormState);
      setFiles([]);
    } catch (err: any) {
      console.error('Error submitting property:', err);
      setError(err.message || 'Failed to submit property. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-milk">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-graphite font-florssolid">Verify Property Ownership</h1>
          <p className="text-graphite mb-6">Submit your property documents for verification and blockchain registration.</p>
          
          {!isVerified && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h3 className="text-amber-800 font-semibold">Identity Verification Required</h3>
              <p className="text-amber-700 mt-1">
                You need to verify your identity with World ID before submitting property documents.
              </p>
              <button 
                onClick={() => navigate('/verify')}
                className="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm"
              >
                Verify Identity
              </button>
            </div>
          )}
          
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">Submission Successful!</h2>
              <p className="text-graphite mb-6">
                Your property documents have been submitted for verification. We'll review your documents and update you on the status.
              </p>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 border border-graphite text-graphite rounded-lg hover:bg-graphite hover:text-milk transition-colors"
                >
                  Submit Another Property
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-graphite text-milk rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Property Location */}
              <div>
                <h2 className="text-xl font-semibold text-graphite mb-3">Property Location</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-graphite">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
                      required
                      disabled={!isVerified}
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-graphite">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
                      required
                      disabled={!isVerified}
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-graphite">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
                      required
                      disabled={!isVerified}
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-graphite">
                      Zip/Postal Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
                      required
                      disabled={!isVerified}
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-graphite">
                      Country *
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
                      required
                      disabled={!isVerified}
                    />
                  </div>
                </div>
              </div>

              {/* Property Information */}
              <div>
                <h2 className="text-xl font-semibold text-graphite mb-3">Property Information</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-graphite">
                      Property Type *
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
                      required
                      disabled={!isVerified}
                    >
                      {propertyTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="documentType" className="block text-sm font-medium text-graphite">
                      Document Type *
                    </label>
                    <select
                      id="documentType"
                      name="documentType"
                      value={formData.documentType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
                      required
                      disabled={!isVerified}
                    >
                      {documentTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-graphite">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
                      placeholder="Additional details about the property..."
                      disabled={!isVerified}
                    />
                  </div>
                </div>
              </div>

              {/* Document Upload */}
              <div>
                <h2 className="text-xl font-semibold text-graphite mb-3">Document Upload</h2>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-graphite hover:text-lightstone focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-graphite"
                      >
                        <span>Upload documents</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          onChange={handleFileChange}
                          multiple
                          disabled={!isVerified}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG up to 10MB each
                    </p>
                  </div>
                </div>

                {/* File list */}
                {files.length > 0 && (
                  <ul className="mt-3 divide-y divide-gray-200 border border-gray-200 rounded-md">
                    {files.map((file, index) => (
                      <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                          </svg>
                          <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(index)}
                            className="font-medium text-rustyred hover:text-rustyred-dark"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Submit button */}
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-graphite hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-graphite"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !isVerified}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-milk bg-graphite hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-graphite disabled:bg-opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-milk" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : "Submit Property"}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 text-rustyred rounded-lg">
                  <p>{error}</p>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyOwnership;