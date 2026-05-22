import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from './api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getStoredUser = () => {
    const sessionUser = sessionStorage.getItem('rideFlexUser');
    const localUser = localStorage.getItem('rideFlexUser');
    return sessionUser ? JSON.parse(sessionUser) : localUser ? JSON.parse(localUser) : null;
  };

  const sanitizeUser = (authUser) => {
    if (!authUser) return null;
    const { id, name, email, mobile, role, city, dlNumber, profilePic, isVerified, dealer } = authUser;
    const safeUser = { id, name, email, mobile, role, city, dlNumber, profilePic, isVerified };

    if (dealer) {
      const { id: dealerId, _id, gstNumber, shopName, address, city: dealerCity, pincode, bankName, accountNo, ifsc, approvalStatus, isActive } = dealer;
      safeUser.dealer = {
        id: dealerId || _id,
        gstNumber,
        shopName,
        address,
        city: dealerCity,
        pincode,
        bankName,
        accountNo,
        ifsc,
        approvalStatus,
        isActive,
      };
    }

    return safeUser;
  };

  // User State: null or { name, role: 'user' | 'seller', ...details }
  const [user, setUser] = useState(getStoredUser);

  // OTP State for simulation { identifier: '1234' }
  const [activeOTPs, setActiveOTPs] = useState({});

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('rideFlexDarkMode');
    if (savedTheme !== null) return JSON.parse(savedTheme);
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
  });

  useEffect(() => {
    localStorage.setItem('rideFlexDarkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const getStoredToken = () => sessionStorage.getItem('rideFlexToken') || localStorage.getItem('rideFlexToken');

  const persistAuth = (token, authUser, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    const otherStorage = rememberMe ? sessionStorage : localStorage;

    storage.setItem('rideFlexToken', token);
    storage.setItem('rideFlexUser', JSON.stringify(authUser));
    otherStorage.removeItem('rideFlexToken');
    otherStorage.removeItem('rideFlexUser');
  };

  useEffect(() => {
    const refreshUser = async () => {
      const token = getStoredToken();
      if (!token) return;
      try {
        const response = await authAPI.getProfile();
        setUser(sanitizeUser(response.user));
      } catch (error) {
        console.error('Failed to refresh profile:', error);
        localStorage.removeItem('rideFlexToken');
        sessionStorage.removeItem('rideFlexToken');
        setUser(null);
      }
    };

    refreshUser();
  }, []);

  const login = async (identifier, password, role, rememberMe = false) => {
    try {
      const response = await authAPI.login({ identifier, password, role });
      const { token, user: loggedUser } = response;
      const safeUser = sanitizeUser(loggedUser);

      persistAuth(token, safeUser, rememberMe);
      setUser(safeUser);
      return { success: true, user: safeUser };
    } catch (error) {
      console.error('Login error:', error);
      const message = error?.response?.data?.message || error?.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  const register = async (formData, role) => {
    try {
      const payload = { ...formData, role };
      console.log('Registering with payload:', payload);
      const response = await authAPI.register(payload);
      const { token, user: registeredUser } = response;
      const safeUser = sanitizeUser(registeredUser);

      persistAuth(token, safeUser, true);
      setUser(safeUser);
      return { success: true, user: safeUser };
    } catch (error) {
      console.error('Register error:', error);
      const message = error?.response?.data?.message || error?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    }
  };

  const sendOTP = (identifier, role) => {
    if (!user || (user.email !== identifier && user.mobile !== identifier) || user.role !== role) {
      return { success: false, message: "User not found with these details." };
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setActiveOTPs(prev => ({ ...prev, [identifier]: otp }));
    alert(`[RIDE FLEX SIMULATION]\nYour OTP is: ${otp}\n(Sent to ${identifier})`);
    return { success: true };
  };

  const sendResetLink = (identifier, role) => {
    if (!user || (user.email !== identifier && user.mobile !== identifier) || user.role !== role) {
      return { success: false, message: "User not found with these details." };
    }
    alert(`[RIDE FLEX SIMULATION]\nPassword Reset Link sent to ${identifier}.\n\n(In a real app, check your email.)`);
    return { success: true };
  };

  const verifyOTP = (identifier, otp) => {
    if (activeOTPs[identifier] && activeOTPs[identifier] === otp) {
      return { success: true };
    }
    return { success: false, message: "Invalid OTP." };
  };

  const resetPassword = (identifier, newPassword, role) => {
    if (!user || (user.email !== identifier && user.mobile !== identifier) || user.role !== role) {
      return { success: false, message: "User not found with this email and role." };
    }

    // This is a frontend simulation only for the current logged-in user.
    setUser({ ...user, password: newPassword });
    const newOTPs = { ...activeOTPs };
    delete newOTPs[identifier];
    setActiveOTPs(newOTPs);
    return { success: true };
  };

  const updateUser = async (updatedData) => {
    if (!user) return { success: false, message: "No user logged in." };

    try {
      const response = await authAPI.updateProfile(updatedData);
      const updatedUser = sanitizeUser(response.user);
      setUser(updatedUser);
      if (localStorage.getItem('rideFlexToken')) {
        localStorage.setItem('rideFlexUser', JSON.stringify(updatedUser));
      } else if (sessionStorage.getItem('rideFlexToken')) {
        sessionStorage.setItem('rideFlexUser', JSON.stringify(updatedUser));
      }
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) return { success: false, message: "No user logged in." };

    try {
      await authAPI.changePassword({ currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message };
    }
  };

  const deleteAccount = async () => {
    if (!user) return { success: false, message: "No user logged in." };
    try {
      const token = getStoredToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        return { success: false, message: err?.message || 'Failed to delete account' };
      }

      logout();
      window.location.href = '/auth';
      return { success: true };
    } catch (e) {
      return { success: false, message: e?.message || 'Failed to delete account' };
    }

  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem('rideFlexUser');
    localStorage.removeItem('rideFlexToken');
    sessionStorage.removeItem('rideFlexUser');
    sessionStorage.removeItem('rideFlexToken');
  };

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, resetPassword, sendOTP, verifyOTP, sendResetLink, updateUser, changePassword, deleteAccount, darkMode, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
