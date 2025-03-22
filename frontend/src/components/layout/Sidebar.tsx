
import { useNavigate } from 'react-router-dom';
import { HomeIcon, DocumentTextIcon, CheckCircleIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';

// Define tab types to match Dashboard.tsx
type DashboardTab = 'profile' | 'properties' | 'verifications' | 'status';

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  isVerified: boolean;
}

function Sidebar({ activeTab, setActiveTab, isVerified }: SidebarProps) {
  const navigate = useNavigate();

  // Define navigation items
  const navItems = [
    {
      id: 'profile',
      name: 'My Profile',
      icon: <UserIcon className="h-5 w-5" />,
      requiresVerification: false,
    },
    {
      id: 'properties',
      name: 'My Properties',
      icon: <HomeIcon className="h-5 w-5" />,
      requiresVerification: false,
    },
    {
      id: 'verifications',
      name: 'Pending Verifications',
      icon: <ClockIcon className="h-5 w-5" />,
      requiresVerification: false,
    },
    {
      id: 'status',
      name: 'Status Updates',
      icon: <CheckCircleIcon className="h-5 w-5" />,
      requiresVerification: false,
    }
  ];

  // Handle navigation to verify ownership page
  const handleVerifyOwnership = () => {
    navigate('/property/verify');
  };

  // Handle navigation to identity verification page
  const handleVerifyIdentity = () => {
    navigate('/verify');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Navigation links */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          // Skip items that require verification if user is not verified
          if (item.requiresVerification && !isVerified) return null;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as DashboardTab)}
              className={`
                flex items-center px-3 py-2 text-sm font-medium rounded-md w-full
                ${activeTab === item.id 
                  ? 'bg-graphite text-milk' 
                  : 'text-graphite hover:bg-lightstone hover:bg-opacity-30'
                }
                transition-colors duration-150 ease-in-out
              `}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Action buttons section */}
      <div className="mt-auto pt-6 space-y-3">
        <button
          onClick={handleVerifyOwnership}
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md w-full bg-graphite bg-opacity-10 text-graphite hover:bg-opacity-20 transition-colors duration-150 ease-in-out"
        >
          <DocumentTextIcon className="h-5 w-5 mr-3" />
          Verify Property
        </button>

        {!isVerified && (
          <button
            onClick={handleVerifyIdentity}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md w-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors duration-150 ease-in-out"
          >
            <span className="mr-3">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            Verify Identity
          </button>
        )}
      </div>

      {/* Mobile bottom navigation - shown only on smallest screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as DashboardTab)}
              className={`
                flex flex-col items-center justify-center
                ${activeTab === item.id 
                  ? 'text-graphite' 
                  : 'text-gray-500 hover:text-graphite'
                }
              `}
            >
              <span className="h-6 w-6">{item.icon}</span>
              <span className="text-xs mt-1">{item.name.split(' ')[1] || item.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;