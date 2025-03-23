import React, { useState } from 'react';

// Property types from Daobitat
const PROPERTY_TYPES = [
  { value: 'Residential', label: 'Residential' },
  { value: 'Commercial', label: 'Commercial' },
  { value: 'Land', label: 'Land' },
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

interface PropertyFormData {
  propertyType: string;
  specificType: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  space: number;
  description: string;
  action: string;
}

interface Step3Props {
  formData: PropertyFormData;
  updateFormData: (data: Partial<PropertyFormData>) => void;
  onBack: () => void;
  onContinue: () => void;
}

function Step3PropertyDetails({ formData, updateFormData, onBack, onContinue }: Step3Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for property type changes
    if (name === 'propertyType') {
      // When property type changes, reset specific type to first option
      const newSpecificType = SPECIFIC_TYPES[value as keyof typeof SPECIFIC_TYPES][0].value;
      updateFormData({
        [name]: value,
        specificType: newSpecificType
      });
    } else {
      // Handle numeric values
      if (name === 'price' || name === 'space' || name === 'bedrooms' || name === 'bathrooms') {
        updateFormData({ [name]: value === '' ? 0 : Number(value) });
      } else {
        updateFormData({ [name]: value });
      }
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
  
  // Validate the form before continuing
  const handleContinue = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    if (formData.price <= 0) {
      newErrors.price = 'Price is required and must be greater than zero';
    }
    
    if (formData.space <= 0) {
      newErrors.space = 'Property area is required and must be greater than zero';
    }
    
    // Validate numeric fields if they have values
    if (formData.bedrooms < 0) {
      newErrors.bedrooms = 'Please enter a valid number of bedrooms';
    }
    
    if (formData.bathrooms < 0) {
      newErrors.bathrooms = 'Please enter a valid number of bathrooms';
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
      <h2 className="text-xl font-semibold text-graphite mb-3">Step 3: Property Details</h2>
      
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
          >
            {PROPERTY_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
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
          >
            {SPECIFIC_TYPES[formData.propertyType as keyof typeof SPECIFIC_TYPES]?.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-graphite">
            Price ($) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price || ''}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm ${
              errors.price ? 'border-red-300 bg-red-50' : ''
            }`}
            placeholder="e.g. 250000"
            min="0"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-rustyred">{errors.price}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="space" className="block text-sm font-medium text-graphite">
            Area (sq ft) *
          </label>
          <input
            type="number"
            id="space"
            name="space"
            value={formData.space || ''}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm ${
              errors.space ? 'border-red-300 bg-red-50' : ''
            }`}
            placeholder="e.g. 1500"
            min="0"
          />
          {errors.space && (
            <p className="mt-1 text-sm text-rustyred">{errors.space}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="bedrooms" className="block text-sm font-medium text-graphite">
            Bedrooms
          </label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            value={formData.bedrooms || ''}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm ${
              errors.bedrooms ? 'border-red-300 bg-red-50' : ''
            }`}
            placeholder="e.g. 3"
            min="0"
          />
          {errors.bedrooms && (
            <p className="mt-1 text-sm text-rustyred">{errors.bedrooms}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="bathrooms" className="block text-sm font-medium text-graphite">
            Bathrooms
          </label>
          <input
            type="number"
            id="bathrooms"
            name="bathrooms"
            value={formData.bathrooms || ''}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm ${
              errors.bathrooms ? 'border-red-300 bg-red-50' : ''
            }`}
            placeholder="e.g. 2"
            min="0"
            step="0.5"
          />
          {errors.bathrooms && (
            <p className="mt-1 text-sm text-rustyred">{errors.bathrooms}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="action" className="block text-sm font-medium text-graphite">
            Listing Type
          </label>
          <select
            id="action"
            name="action"
            value={formData.action}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
          >
            <option value="For Sale">For Sale</option>
            <option value="For Rent">For Rent</option>
            <option value="Auction">Auction</option>
          </select>
        </div>
        
        <div className="col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-graphite">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-graphite focus:ring-graphite sm:text-sm"
            placeholder="Describe your property..."
          />
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

export default Step3PropertyDetails;