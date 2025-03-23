import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import UserProfile from '../../components/layout/UserProfile';
import PropertyList from '../../components/layout/PropertyList';
import VerificationStatus from '../../components/layout/VerificationStatus';
import { useAuth } from '../../context/auth-provider';

// Define tab types for the dashboard sections
type DashboardTab = 'profile' | 'properties' | 'verifications' | 'status';

function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('profile');
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isVerified } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialRender = useRef(true);

  // Check for tab passed from navigation
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      if (location.state && location.state.activeTab) {
        setActiveTab(location.state.activeTab as DashboardTab);
      }
    }
  }, [location]);

  // Check authentication status
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Simulate loading dashboard data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <UserProfile />;
      case 'properties':
        return <PropertyList />;
      case 'verifications':
        return <VerificationStatus type="pending" />;
      case 'status':
        return <VerificationStatus type="all" />;
      default:
        return <UserProfile />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-milk">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-desertclay"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-milk">
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8">
        {/* Sidebar for larger screens */}
        <aside className="hidden md:block md:w-64 pr-6">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isVerified={isVerified}
          />
        </aside>
        
        {/* Mobile tab selector */}
        <div className="md:hidden w-full mb-6">
          <div className="flex overflow-x-auto space-x-2 pb-2">
            <button 
              onClick={() => setActiveTab('profile')} 
              className={`px-4 py-2 whitespace-nowrap rounded-lg ${activeTab === 'profile' ? 'bg-graphite text-milk' : 'bg-white text-graphite'}`}
            >
              My Profile
            </button>
            <button 
              onClick={() => setActiveTab('properties')} 
              className={`px-4 py-2 whitespace-nowrap rounded-lg ${activeTab === 'properties' ? 'bg-graphite text-milk' : 'bg-white text-graphite'}`}
            >
              My Properties
            </button>
            <button 
              onClick={() => setActiveTab('verifications')} 
              className={`px-4 py-2 whitespace-nowrap rounded-lg ${activeTab === 'verifications' ? 'bg-graphite text-milk' : 'bg-white text-graphite'}`}
            >
              Pending Verifications
            </button>
            <button 
              onClick={() => setActiveTab('status')} 
              className={`px-4 py-2 whitespace-nowrap rounded-lg ${activeTab === 'status' ? 'bg-graphite text-milk' : 'bg-white text-graphite'}`}
            >
              Status Updates
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 bg-white rounded-lg shadow p-6">
          {!isVerified && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h3 className="text-amber-800 font-semibold">Identity Verification Required</h3>
              <p className="text-amber-700 mt-1">
                To unlock all features, please complete your identity verification with World ID.
              </p>
              <button 
                onClick={() => navigate('/verify')}
                className="mt-2 px-4 py-2 bg-rustyred hover:bg-rustyred/90 text-white rounded-lg text-sm"
              >
                Verify Identity
              </button>
            </div>
          )}
          
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;