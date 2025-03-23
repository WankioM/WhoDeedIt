import React, { useState } from 'react';

interface Step2Props {
  formData: {
    propertyName: string;
    location: string;
    streetAddress: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  updateFormData: (data: Partial<typeof formData>) => void;
  onBack: () => void;
  onContinue: () => void;
}

function Step2BasicInfo({ formData, updateFormData, onBack, onContinue }: Step2Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested fields like coordinates.lat
      const [parent, child] = name.split('.');
      updateFormData({
        [parent]: {
          ...formData[parent as keyof typeof formData],
          [child]: value
        }
      });
    } else {
      updateFormData({ [name]: value });
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Try to get coordinates from address
  const handleGetCoordinates = async () => {
    // Only try to get coordinates if we have an address
    if (!formData.streetAddress || !formData.location) {
      setErrors({
        ...errors,
        streetAddress: !formData.streetAddress ? 'Address is required to get coordinates' : '',
        location: !formData.location ? 'Location is required to get coordinates' : ''
      });
      return;
    }
    
    try {
      // This would normally use a geocoding API
      // For now, just simulate with random coordinates
      const lat = 34 + Math.random() * 10;
      const lng = -118 - Math.random() * 10;
      
      updateFormData({
        coordinates: {
          lat,
          lng
        }
      });
    } catch (err) {
      console.error('Error getting coordinates:', err);
    }
  };
  
  // Validate the form before continuing
  const handleContinue = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    if (!formData.propertyName.trim()) {
      newErrors.propertyName = 'Property name is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = 'Street address is required';
    }
    
    // Validate coordinates
    if (formData.coordinates.lat === 0 && formData.coordinates.lng === 0) {
      newErrors.coordinates = 'Coordinates are required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // All is good, continue
    onContinue();
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-graphite mb-3">Step 2: Basic Property Information</h2>
      
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
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm ${
              errors.propertyName ? 'border-red-300 bg-red-50' : ''
            }`}
            placeholder="e.g. Modern Downtown Apartment"
          />
          {errors.propertyName && (
            <p className="mt-1 text-sm text-rustyred">{errors.propertyName}</p>
          )}
        </div>
        
        <div className="col-span-2">
          <label htmlFor="streetAddress" className="block text-sm font-medium text-graphite">
            Street Address *
          </label>
          <input
            type="text"
            id="streetAddress"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm ${
              errors.streetAddress ? 'border-red-300 bg-red-50' : ''
            }`}
            placeholder="e.g. 123 Main Street"
          />
          {errors.streetAddress && (
            <p className="mt-1 text-sm text-rustyred">{errors.streetAddress}</p>
          )}
        </div>
        
        <div className="col-span-2">
          <label htmlFor="location" className="block text-sm font-medium text-graphite">
            Location (City/Area) *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm ${
              errors.location ? 'border-red-300 bg-red-50' : ''
            }`}
            placeholder="e.g. Los Angeles, CA"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-rustyred">{errors.location}</p>
          )}
        </div>
        
        <div className="col-span-2">
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={handleGetCoordinates}
              className="text-sm text-graphite bg-lightstone hover:bg-opacity-80 px-3 py-1 rounded-md transition-colors"
            >
              Get Coordinates from Address
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm ${
                  errors.coordinates ? 'border-red-300 bg-red-50' : ''
                }`}
                placeholder="e.g. 34.0522"
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
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm ${
                  errors.coordinates ? 'border-red-300 bg-red-50' : ''
                }`}
                placeholder="e.g. -118.2437"
              />
            </div>
          </div>
          {errors.coordinates && (
            <p className="mt-1 text-sm text-rustyred">{errors.coordinates}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-between pt-5">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-md text-graphite hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        
        <button
          type="button"
          onClick={handleContinue}
          className="px-6 py-2 bg-graphite text-white rounded-md hover:bg-opacity-90 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default Step2BasicInfo;