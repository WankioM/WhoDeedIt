import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-provider';
import { propertyService, userService } from '../../services/daobitat-service';
import WorldIDService from '../../services/world-id-service';

// Property types from Daobitat
const PROPERTY_TYPES = [
  { value: 'Residential', label: 'Residential' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Land', label: 'Special-purpose' },
  { value: 'Special-purpose', label: 'Special-purpose' },
  { value: 'Vacation/Short-term rentals', label: 'Vacation/Short-term rentals' },
];

// Specific property types
const SPECIFIC_TYPES = {
  'Residential': [
    { value: 'Single Family Home', label: 'Single Family Home' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Condo', label: 'Condo' },
    { value: 'Townhouse', label: 'Townhouse' },
  ],
  'Commercial': [
    { value: 'Office', label: 'Office' },
    { value: 'Retail', label: 'Retail' },
    { value: 'Industrial', label: 'Industrial' },
    { value: 'Multi-family', label: 'Multi-family' },
  ],
  'Land': [
    { value: 'Vacant Land', label: 'Vacant Land' },
    { value: 'Farm', label: 'Farm' },
    { value: 'Ranch', label: 'Ranch' },
  ],
  'Special-purpose': [
    { value: 'Hotel', label: 'Hotel' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Self-storage', label: 'Self-storage' },
    { value: 'Senior Living', label: 'Senior Living' },
  ],
  'Vacation/Short-term rentals': [
    { value: 'Cabin', label: 'Cabin' },
    { value: 'Beach House', label: 'Beach House' },
    { value: 'Villa', label: 'Villa' },
  ],
};

function AddDaobitatProperty() {
  const { isAuthenticated, isVerified, userAddress } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    propertyName: '',
    location: '',
    streetAddress: '',
    propertyType: 'Residential',
    specificType: 'Single Family Home',
    price: '',
    bedrooms: '',
    bathrooms: '',
    space: '',
    description: '',
    action: 'For Sale',
    coordinates: {
      lat: 0,
      lng: 0
    }
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDaobitatConnected, setIsDaobitatConnected] = useState(false);
  
  // Check if user already has Daobitat connection
  useEffect(() => {
    if (isVerified && userAddress) {
      checkDaobitatConnection();
    }
  }, [isVerified, userAddress]);
  
  // Redirect if not authenticated or verified
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isVerified) {
      navigate('/verify');
    }
  }, [isAuthenticated, isVerified, navigate]);
  
  const checkDaobitatConnection = async () => {
    try {
      setLoading(true);
      if (userAddress) {
        const isConnected = await WorldIDService.checkExistingVerification(userAddress);
        setIsDaobitatConnected(isConnected);
        
        if (!isConnected) {
          setError('Please connect your World ID to Daobitat first.');
        }
      }
    } catch (err) {
      console.error('Error checking Daobitat connection:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const connectToDaobitat = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!userAddress) {
        throw new Error('User wallet address not available');
      }
      
      const result = await WorldIDService.processVerification(userAddress);
      
      if (result.isVerified) {
        setIsDaobitatConnected(true);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(result.error || 'Failed to connect to Daobitat');
      }
    } catch (err: any) {
      console.error('Error connecting to Daobitat:', err);
      setError(err.message || 'Failed to connect to Daobitat');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested fields like coordinates.lat
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData],
          [child]: value
        }
      });
    } else if (name === 'propertyType') {
      // When property type changes, reset specific type to first option
      const newSpecificType = SPECIFIC_TYPES[value as keyof typeof SPECIFIC_TYPES][0].value;
      setFormData({
        ...formData,
        [name]: value,
        specificType: newSpecificType
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle file selection for images
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles(filesArray);
    }
  };
  
  // Upload images to Daobitat storage
  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];
    
    try {
      const uploadedUrls = [];
      let progress = 0;
      
      for (const file of imageFiles) {
        // Get signed URL for upload
        const uploadUrlResult = await propertyService.getPropertyImageUploadUrl(
          file.name,
          file.type
        );
        
        const { signedUrl, fileUrl, fileName } = uploadUrlResult.data;
        
        // Upload to the signed URL
        await fetch(signedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });
        
        // Make the image public
        await propertyService.makeImagePublic(fileName);
        
        // Add URL to list
        uploadedUrls.push(fileUrl);
        
        // Update progress
        progress += (1 / imageFiles.length) * 100;
        setUploadProgress(Math.round(progress));
      }
      
      return uploadedUrls;
    } catch (err: any) {
      console.error('Error uploading images:', err);
      throw new Error('Failed to upload images: ' + err.message);
    }
  };
  
  // Submit the property to Daobitat
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isDaobitatConnected) {
      setError('Please connect to Daobitat first');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // First upload images
      const imageUrls = await uploadImages();
      
      // Prepare property data
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        space: parseFloat(formData.space),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : undefined,
        images: imageUrls,
        additionalComments: formData.description
      };
      
      // Submit to Daobitat
      const result = await propertyService.createProperty(propertyData);
      
      if (result.status === 'success') {
        setSuccess(true);
        
        // Reset form after success
        setFormData({
          propertyName: '',
          location: '',
          streetAddress: '',
          propertyType: 'Residential',
          specificType: 'Single Family Home',
          price: '',
          bedrooms: '',
          bathrooms: '',
          space: '',
          description: '',
          action: 'For Sale',
          coordinates: {
            lat: 0,
            lng: 0
          }
        });
        setImageFiles([]);
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error('Failed to create property');
      }
    } catch (err: any) {
      console.error('Error submitting property:', err);
      setError(err.message || 'Failed to submit property');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <div className="min-h-screen bg-milk">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-graphite font-florssolid">List Property on Daobitat</h1>
          <p className="text-graphite mb-6">Submit your verified property to the Daobitat marketplace.</p>
          
          {!isDaobitatConnected ? (
            <div className="mb-6 p-6 bg-milk rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-graphite mb-4">Connect to Daobitat</h2>
              <p className="text-gray-600 mb-4">
                You need to connect your World ID verification to Daobitat before listing a property.
                This will create an account on Daobitat using your World ID wallet address.
              </p>
              
              <button
                onClick={connectToDaobitat}
                disabled={loading}
                className="px-4 py-2 bg-graphite text-white rounded-md hover:bg-opacity-90 transition-colors disabled:bg-opacity-50"
              >
                {loading ? 'Connecting...' : 'Connect World ID to Daobitat'}
              </button>
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 text-rustyred rounded-lg">
                  <p>{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg">
                  <p>Successfully connected to Daobitat! You can now list properties.</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold text-graphite mb-3">Basic Information</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="col-span-2">
                    <label htmlFor="propertyName" className="block text-sm font-medium text-graphite">
                      Property Name/Title *
                    </label>
                    <input
                      type="text"
                      id="propertyName"
                      name="propertyName"
                      value={formData.propertyName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-graphite">
                      Location (City/Area) *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="streetAddress" className="block text-sm font-medium text-graphite">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="streetAddress"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="coordinates.lat" className="block text-sm font-medium text-graphite">
                      Latitude *
                    </label>
                    <input
                      type="number"
                      id="coordinates.lat"
                      name="coordinates.lat"
                      value={formData.coordinates.lat}
                      onChange={handleInputChange}
                      step="any"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="coordinates.lng" className="block text-sm font-medium text-graphite">
                      Longitude *
                    </label>
                    <input
                      type="number"
                      id="coordinates.lng"
                      name="coordinates.lng"
                      value={formData.coordinates.lng}
                      onChange={handleInputChange}
                      step="any"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Property Details */}
              <div>
                <h2 className="text-xl font-semibold text-graphite mb-3">Property Details</h2>
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
                    >
                      {PROPERTY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="specificType" className="block text-sm font-medium text-graphite">
                      Specific Type *
                    </label>
                    <select
                      id="specificType"
                      name="specificType"
                      value={formData.specificType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
                      required
                    >
                      {SPECIFIC_TYPES[formData.propertyType as keyof typeof SPECIFIC_TYPES].map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-graphite">
                      Price (USD) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="action" className="block text-sm font-medium text-graphite">
                      Property Action *
                    </label>
                    <select
                      id="action"
                      name="action"
                      value={formData.action}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
                      required
                    >
                      <option value="For Sale">For Sale</option>
                      <option value="For Rent">For Rent</option>
                      <option value="For Investment">For Investment</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="space" className="block text-sm font-medium text-graphite">
                      Area (sq ft) *
                    </label>
                    <input
                      type="number"
                      id="space"
                      name="space"
                      value={formData.space}
                      onChange={handleInputChange}
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bedrooms" className="block text-sm font-medium text-graphite">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      id="bedrooms"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bathrooms" className="block text-sm font-medium text-graphite">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      id="bathrooms"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      min="0"
                      step="0.5"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-graphite">
                      Description
                    </label>
                    <textarea
                      id="