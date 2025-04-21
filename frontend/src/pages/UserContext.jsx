import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create context
const UserContext = createContext(null);

// API base URL
const API_URL = 'http://localhost:6400'; // Update to match your backend port

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Configure axios defaults once
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      console.log('Fetching current user from:', `${API_URL}/current-user`);
      
      const response = await axios.get(`${API_URL}/current-user`, {
        withCredentials: true
      });
      
      console.log('Current user response:', response.data);
      
      if (response.data.success) {
        setCurrentUser(response.data.user);
      } else {
        setCurrentUser(null);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching current user:', err);
      setCurrentUser(null);
      setError(err.response?.data?.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/login`, credentials, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setCurrentUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/logout`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setCurrentUser(null);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      console.error('Logout error:', err);
      return { success: false, message: 'Logout failed' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    initialized,
    login,
    logout,
    refreshUser: fetchCurrentUser
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;