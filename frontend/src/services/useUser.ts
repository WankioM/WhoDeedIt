// src/hooks/useUser.ts

import { useState, useEffect, useCallback } from 'react';
import userService, { 
  UserProfile, 
  WorldIDCredential, 
  ProfileUpdateData 
} from '../services/UserService';

interface UseUserReturn {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: WorldIDCredential) => Promise<void>;
  logout: () => void;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  fetchUser: () => Promise<void>;
}

/**
 * Hook for managing user authentication and profile
 */
const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    userService.isAuthenticated()
  );

  // Fetch user data on initial load if authenticated
  useEffect(() => {
    if (userService.isAuthenticated() && !user) {
      fetchUser();
    }
  }, []);

  // Function to fetch the current user's profile
  const fetchUser = useCallback(async () => {
    if (!userService.isAuthenticated()) return;

    setLoading(true);
    setError(null);
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
      // If we get an authentication error, clear the token
      if (err instanceof Error && err.message.includes('Authentication expired')) {
        userService.clearToken();
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to handle World ID login
  const login = useCallback(async (credentials: WorldIDCredential) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.authenticateWithWorldID(credentials);
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to handle logout
  const logout = useCallback(() => {
    userService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Function to update user profile
  const updateProfile = useCallback(async (data: ProfileUpdateData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateProfile(data);
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    updateProfile,
    fetchUser
  };
};

export default useUser;