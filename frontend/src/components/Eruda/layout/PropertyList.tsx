import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon, MapPinIcon, BuildingOfficeIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../context/auth-provider';

// Define property types
type PropertyType = 'residential' | 'commercial' | 'land';

// Property data interface
interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: PropertyType;
  verified: boolean;
  verificationDate?: string;
  thumbnail?: string;
  area?: number;
  yearBuilt?: number;
}

function PropertyList() {
  const navigate = useNavigate();
  const { isVerified } = useAuth();
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  
  // Mock property data
  const properties: Property[] = [
    {
      id: 'p1',
      address: '123 Main Street',
      city: 'Anytown',
      state: 'CA',
      zipCode: '90210',
      type: 'residential',
      verified: true,
      verificationDate: '2025-01-15',
      area: 2500,
      yearBuilt: 2010
    },
    {
      id: 'p2',
      address: '456 Oak Avenue',
      city: 'Somewhere',
      state: 'NY',
      zipCode: '10001',
      type: 'commercial',
      verified: true,
      verificationDate: '2025-02-20',
      area: 5000,
      yearBuilt: 2005
    },
    {
      id: 'p3',
      address: '789 Pine Road',
      city: 'Nowhere',
      state: 'TX',
      zipCode: '75001',
      type: 'land',
      verified: true,
      verificationDate: '2025-03-10',
      area: 10000
    }
  ];
  
  // Get property type icon
  const getPropertyTypeIcon = (type: PropertyType) => {
    switch (type) {
      case 'residential':
        return <HomeIcon className="h-5 w-5 text-graphite" />;
      case 'commercial':
        return <BuildingOfficeIcon className="h-5 w-5 text-graphite" />;
      case 'land':
        return <MapPinIcon className="h-5 w-5 text-graphite" />;
      default:
        return <HomeIcon className="h-5 w-5 text-graphite" />;
    }
  };
  
  // Format property type for display
  const formatPropertyType = (type: PropertyType) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  // Handle property selection
  const handleSelectProperty = (id: string) => {
    setSelectedProperty(id === selectedProperty ? null : id);
  };
  
  // Handle navigate to verify new property
  const handleAddProperty = () => {
    navigate('/property/verify');
  };
  
  // Find selected property
  const selectedPropertyData = properties.find(p => p.id === selectedProperty);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-graphite font-florssolid">My Properties</h2>
        <button
          onClick={handleAddProperty}
          disabled={!isVerified}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center
            ${isVerified 
              ? 'bg-graphite text-white hover:bg-opacity-90' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
        >
          <PlusCircleIcon className="h-5 w-5 mr-1" />
          Add Property
        </button>
      </div>
      
      {!isVerified && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="text-amber-800 font-semibold">Identity Verification Required</h3>
          <p className="text-amber-700 mt-1">
            You need to verify your identity with World ID before adding properties.
          </p>
          <button 
            onClick={() => navigate('/verify')}
            className="mt-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm"
          >
            Verify Identity
          </button>
        </div>
      )}
      
      {properties.length === 0 ? (
        <div className="bg-milk rounded-lg shadow-sm p-8 text-center">
          <HomeIcon className="mx-auto h-12 w-12 text-lightstone" />
          <h3 className="mt-4 text-lg font-medium text-graphite">No verified properties</h3>
          <p className="mt-1 text-gray-500">
            You don't have any verified properties yet.
          </p>
          {isVerified && (
            <button
              onClick={handleAddProperty}
              className="mt-4 px-4 py-2 bg-graphite text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors"
            >
              Verify Your First Property
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
            <div 
              key={property.id} 
              className={`bg-milk rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer
                ${selectedProperty === property.id ? 'ring-2 ring-graphite' : ''}`}
              onClick={() => handleSelectProperty(property.id)}
            >
              {/* Property thumbnail/image */}
              <div className="h-40 bg-lightstone bg-opacity-30 flex items-center justify-center">
                {getPropertyTypeIcon(property.type)}
                <span className="ml-2 text-sm font-medium text-graphite">
                  {formatPropertyType(property.type)}
                </span>
              </div>
              
              {/* Property details */}
              <div className="p-4">
                <h3 className="font-medium text-graphite truncate">{property.address}</h3>
                <p className="text-sm text-gray-500 truncate">
                  {property.city}, {property.state} {property.zipCode}
                </p>
                <div className="mt-2 flex items-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                  {property.verificationDate && (
                    <span className="ml-2 text-xs text-gray-500">
                      {new Date(property.verificationDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Selected property details */}
      {selectedPropertyData && (
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-graphite mb-4">Property Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Address</h4>
              <p className="mt-1 text-graphite">{selectedPropertyData.address}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Location</h4>
              <p className="mt-1 text-graphite">
                {selectedPropertyData.city}, {selectedPropertyData.state} {selectedPropertyData.zipCode}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Property Type</h4>
              <p className="mt-1 text-graphite">{formatPropertyType(selectedPropertyData.type)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Verification Date</h4>
              <p className="mt-1 text-graphite">
                {selectedPropertyData.verificationDate 
                  ? new Date(selectedPropertyData.verificationDate).toLocaleDateString() 
                  : 'N/A'}
              </p>
            </div>
            
            {selectedPropertyData.area && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Area</h4>
                <p className="mt-1 text-graphite">{selectedPropertyData.area} sq ft</p>
              </div>
            )}
            
            {selectedPropertyData.yearBuilt && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Year Built</h4>
                <p className="mt-1 text-graphite">{selectedPropertyData.yearBuilt}</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex space-x-4">
            <button
              className="px-4 py-2 bg-graphite text-white rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors"
            >
              View Documents
            </button>
            
            <button
              className="px-4 py-2 bg-lightstone bg-opacity-30 text-graphite rounded-md text-sm font-medium hover:bg-opacity-50 transition-colors"
            >
              Share Verification
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyList;