
interface Step5Props {
  formData: {
    propertyName: string;
    location: string;
    streetAddress: string;
    propertyType: string;
    specificType: string;
    price: number;
    bedrooms?: number;
    bathrooms?: number;
    space: number;
    description?: string;
    action?: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    images: string[];
  };
  imageUrls: string[];
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
  success: boolean;
}

function Step5Review({ formData, imageUrls, onBack, onSubmit, loading, error, success }: Step5Props) {
  // Format price with commas and decimals
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-graphite mb-3">Step 5: Review Your Listing</h2>
      
      {success ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Property Submitted Successfully!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your property has been successfully submitted to WhoDeedIt. It will be verified and then added to the Daobitat marketplace.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Property Information Summary */}
          <div className="bg-white border border-lightstone rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-lightstone bg-opacity-30">
              <h3 className="text-lg font-medium leading-6 text-graphite">Property Summary</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Please review your property information before submitting.</p>
            </div>
            
            <div className="border-t border-lightstone">
              <dl>
                <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Property Name</dt>
                  <dd className="mt-1 text-sm text-graphite sm:mt-0 sm:col-span-2">{formData.propertyName}</dd>
                </div>
                
                <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-graphite sm:mt-0 sm:col-span-2">{formData.location}</dd>
                </div>
                
                <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Street Address</dt>
                  <dd className="mt-1 text-sm text-graphite sm:mt-0 sm:col-span-2">{formData.streetAddress}</dd>
                </div>
                
                <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Property Type</dt>
                  <dd className="mt-1 text-sm text-graphite sm:mt-0 sm:col-span-2">{formData.propertyType} - {formData.specificType}</dd>
                </div>
                
                <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Price</dt>
                  <dd className="mt-1 text-sm text-graphite sm:mt-0 sm:col-span-2">{formatPrice(formData.price)}</dd>
                </div>
                
                <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Details</dt>
                  <dd className="mt-1 text-sm text-graphite sm:mt-0 sm:col-span-2">
                    {formData.bedrooms ? `${formData.bedrooms} Bed${formData.bedrooms !== 1 ? 's' : ''}` : ''}
                    {formData.bathrooms ? ` • ${formData.bathrooms} Bath${formData.bathrooms !== 1 ? 's' : ''}` : ''}
                    {formData.space ? ` • ${formData.space} sq ft` : ''}
                  </dd>
                </div>
                
                <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Coordinates</dt>
                  <dd className="mt-1 text-sm text-graphite sm:mt-0 sm:col-span-2">
                    Lat: {formData.coordinates.lat.toFixed(6)} • Lng: {formData.coordinates.lng.toFixed(6)}
                  </dd>
                </div>
                
                {formData.description && (
                  <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-graphite sm:mt-0 sm:col-span-2">{formData.description}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Image Preview */}
          <div className="mt-6">
            <h3 className="text-lg font-medium leading-6 text-graphite mb-3">Property Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative aspect-w-1 aspect-h-1 bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={url} 
                    alt={`Property ${index + 1}`} 
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Error";
                    }}
                  />
                </div>
              ))}
              {imageUrls.length === 0 && (
                <div className="col-span-full text-center p-4 bg-gray-50 rounded-md">
                  <p className="text-gray-500">No images uploaded</p>
                </div>
              )}
            </div>
          </div>

          {/* Verification Information */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">What happens after submission?</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your property will be reviewed by WhoDeedIt administrators</li>
                    <li>You'll need to upload verification documents for ownership validation</li>
                    <li>Once verified, your property will be listed on the Daobitat marketplace</li>
                    <li>You can track the verification status in your property dashboard</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error submitting property</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Action Buttons */}
      <div className="flex justify-between pt-5">
        {!success && (
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md text-graphite hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Back
          </button>
        )}
        
        {!success ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="px-6 py-2 bg-graphite text-white rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Property'
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => window.location.href = '/wallet'}
            className="px-6 py-2 bg-graphite text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            Go to My Properties
          </button>
        )}
      </div>
    </div>
  );
}

export default Step5Review;