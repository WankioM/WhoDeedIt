import React, { useState } from 'react';
import { useAuth } from '../../context/auth-provider';

function UserProfile() {
  const { userAddress, isVerified } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Format wallet address for display
  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Mock user data for demo
  const [userData, setUserData] = useState({
    displayName: 'Property Owner',
    email: 'user@example.com',
    contactPhone: '+1 (555) 123-4567',
    preferredContact: 'email',
    notificationPreferences: {
      email: true,
      push: true,
      sms: false
    }
  });
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setUserData({
        ...userData,
        notificationPreferences: {
          ...userData.notificationPreferences,
          [name.split('.')[1]]: checkbox.checked
        }
      });
    } else {
      setUserData({
        ...userData,
        [name]: value
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the updated data to your backend
    console.log('Updated user data:', userData);
    setIsEditing(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-graphite font-florssolid">My Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-lightstone hover:bg-opacity-80 text-graphite rounded-md text-sm font-medium transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>
      
      {/* Profile information card */}
      <div className="bg-milk rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-lightstone flex items-center justify-center text-graphite text-xl font-bold">
            {userData.displayName.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-graphite">{userData.displayName}</h3>
            <p className="text-sm text-gray-500 font-helvetica-light">
              Wallet: {formatAddress(userAddress)}
            </p>
            {isVerified && (
              <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
                Identity Verified
              </span>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-graphite mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={userData.displayName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-lightstone rounded-md focus:outline-none focus:ring-1 focus:ring-graphite"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-graphite mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-lightstone rounded-md focus:outline-none focus:ring-1 focus:ring-graphite"
                />
              </div>
              
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-graphite mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={userData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-lightstone rounded-md focus:outline-none focus:ring-1 focus:ring-graphite"
                />
              </div>
              
              <div>
                <label htmlFor="preferredContact" className="block text-sm font-medium text-graphite mb-1">
                  Preferred Contact Method
                </label>
                <select
                  id="preferredContact"
                  name="preferredContact"
                  value={userData.preferredContact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-lightstone rounded-md focus:outline-none focus:ring-1 focus:ring-graphite"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
            </div>
            
            <div className="pt-2">
              <p className="text-sm font-medium text-graphite mb-2">Notification Preferences</p>
              <div className="flex flex-wrap gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="notificationPreferences.email"
                    checked={userData.notificationPreferences.email}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-graphite focus:ring-graphite border-lightstone rounded"
                  />
                  <span className="ml-2 text-sm text-graphite">Email</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="notificationPreferences.push"
                    checked={userData.notificationPreferences.push}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-graphite focus:ring-graphite border-lightstone rounded"
                  />
                  <span className="ml-2 text-sm text-graphite">Push Notifications</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="notificationPreferences.sms"
                    checked={userData.notificationPreferences.sms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-graphite focus:ring-graphite border-lightstone rounded"
                  />
                  <span className="ml-2 text-sm text-graphite">SMS</span>
                </label>
              </div>
            </div>
            
            <div className="flex pt-4 space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-graphite text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Save Changes
              </button>
              
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 text-graphite rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email Address</h4>
                <p className="mt-1 text-graphite">{userData.email}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Contact Phone</h4>
                <p className="mt-1 text-graphite">{userData.contactPhone}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Preferred Contact</h4>
                <p className="mt-1 capitalize text-graphite">{userData.preferredContact}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Notifications</h4>
                <p className="mt-1 text-graphite">
                  {Object.entries(userData.notificationPreferences)
                    .filter(([_, enabled]) => enabled)
                    .map(([type]) => type.charAt(0).toUpperCase() + type.slice(1))
                    .join(', ') || 'None'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Account security section */}
      <div className="bg-milk rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-graphite mb-4">Account Security</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-lightstone border-opacity-50">
            <div>
              <h4 className="font-medium text-graphite">World ID Verification</h4>
              <p className="text-sm text-gray-500">Verify your unique personhood</p>
            </div>
            <div>
              {isVerified ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Verified
                </span>
              ) : (
                <button 
                  className="px-3 py-1 bg-amber-100 text-amber-800 rounded-md text-sm font-medium hover:bg-amber-200 transition-colors"
                  onClick={() => {/* Handle verification */}}
                >
                  Verify Now
                </button>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-lightstone border-opacity-50">
            <div>
              <h4 className="font-medium text-graphite">Connected Wallet</h4>
              <p className="text-sm text-gray-500">{formatAddress(userAddress)}</p>
            </div>
            <button className="px-3 py-1 bg-gray-100 text-graphite rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
              Change
            </button>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <div>
              <h4 className="font-medium text-graphite">Delete Account</h4>
              <p className="text-sm text-gray-500">Permanently delete your account and data</p>
            </div>
            <button className="px-3 py-1 bg-rustyred bg-opacity-10 text-rustyred rounded-md text-sm font-medium hover:bg-opacity-20 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;