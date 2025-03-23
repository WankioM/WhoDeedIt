import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '@/services/useUser';
import useProperty from '@/services/useProperty';
import Step1DaobitatConnect from './Step1DaobitatConnect';
import Step2BasicInfo from './Step2BasicInfo';
import Step3PropertyDetails from './Step3PropertyDetails';
import Step4PropertyImages from './Step4PropertyImages';
import Step5Review from './Step5Review';
import { CreatePropertyData } from '../../services/PropertyService';
import { PropertyFormData } from '@/types/property';


// Initial form data
// Initial form data
const initialFormData: PropertyFormData = {
  propertyName: '',
  location: '',
  streetAddress: '',
  propertyType: 'Residential', // This is fine since it's one of the union values
  specificType: 'Single Family Home',
  price: 0,
  bedrooms: 0,
  bathrooms: 0,
  space: 0,
  description: '',
  action: 'For Sale',
  coordinates: {
    lat: 0,
    lng: 0
  },
  images: []
};

function PropertyWizard() {
  const { user, isAuthenticated } = useUser();
  const { createProperty, loading: propertyLoading, error: propertyError } = useProperty();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [isDaobitatConnected, setIsDaobitatConnected] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Update form data
  const updateFormData = (newData: Partial<PropertyFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...newData
    }));
  };
  // Handle step changes
  const goToNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };
  
  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  
  // Handle successful Daobitat connection
  const handleDaobitatConnected = () => {
    setIsDaobitatConnected(true);
    goToNextStep();
  };
  
  // Handle image uploads
  const handleImagesUploaded = (files: File[], urls: string[]) => {
   
    setImageUrls(urls);
    updateFormData({ images: urls });
    goToNextStep();
  };
  
  // Submit the property to Daobitat
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare property data for API
      const propertyData: CreatePropertyData = {
        propertyName: formData.propertyName,
        location: formData.location,
        streetAddress: formData.streetAddress,
        coordinates: formData.coordinates,
        propertyType: formData.propertyType,
        specificType: formData.specificType,
        price: formData.price,
        space: formData.space,
        bedrooms: formData.bedrooms || undefined,
        bathrooms: formData.bathrooms || undefined,
        images: formData.images
      };
      
      // Create property using our PropertyService
      const newProperty = await createProperty(propertyData);
      
      if (newProperty) {
        setSuccess(true);
        
        // Reset form and navigate to dashboard after a delay
        setTimeout(() => {
          setFormData(initialFormData);
      
          setImageUrls([]);
          navigate('/wallet');
        }, 2000);
      } else {
        throw new Error('Failed to create property');
      }
    } catch (err: any) {
      console.error('Error submitting property:', err);
      setError(err.message || 'Failed to submit property');
    } finally {
      setLoading(false);
    }
  };
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1DaobitatConnect 
  onContinue={handleDaobitatConnected}
  userAddress={user?.walletAddress || null}
  isDaobitatConnected={isDaobitatConnected}
/>
        );
      case 2:
        return (
          <Step2BasicInfo 
            formData={formData}
            updateFormData={updateFormData}
            onBack={goToPreviousStep}
            onContinue={goToNextStep}
          />
        );
      case 3:
        return (
          <Step3PropertyDetails 
            formData={formData}
            updateFormData={updateFormData}
            onBack={goToPreviousStep}
            onContinue={goToNextStep}
          />
        );
      case 4:
        return (
          <Step4PropertyImages 
            onBack={goToPreviousStep}
            onImagesUploaded={handleImagesUploaded}
          />
        );
      case 5:
        return (
          <Step5Review 
            formData={formData}
            imageUrls={imageUrls}
            onBack={goToPreviousStep}
            onSubmit={handleSubmit}
            loading={loading || propertyLoading}
            error={error || propertyError}
            success={success}
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  };
  
  return (
    <div className="min-h-screen bg-milk">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2 text-graphite font-florssolid">List Property on WhoDeedIt</h1>
          <p className="text-graphite mb-6">Submit your verified property to the Daobitat marketplace.</p>
          
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    currentStep === step 
                      ? 'bg-graphite text-milk' 
                      : currentStep > step 
                        ? 'bg-green-500 text-white' 
                        : 'bg-lightstone text-graphite'
                  }`}>
                    {currentStep > step ? '✓' : step}
                  </div>
                  <span className="text-xs mt-1 text-center">
                    {step === 1 && 'Connect'}
                    {step === 2 && 'Basic Info'}
                    {step === 3 && 'Details'}
                    {step === 4 && 'Images'}
                    {step === 5 && 'Review'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 h-1 w-full bg-lightstone bg-opacity-30">
              <div 
                className="h-1 bg-graphite transition-all duration-300 ease-in-out" 
                style={{ width: `${(currentStep - 1) * 25}%` }}
              ></div>
            </div>
          </div>
          
          {/* Current step content */}
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

export default PropertyWizard;