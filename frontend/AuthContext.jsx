import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // User State: null or { name, role: 'user' | 'seller', ...details }
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('rideFlexUser')) || null);
  
  // Persistent Database for All Users (to check uniqueness across sessions)
  const [usersDB, setUsersDB] = useState(JSON.parse(localStorage.getItem('rideFlexUsersDB')) || []);

  // OTP State for simulation { identifier: '1234' }
  const [activeOTPs, setActiveOTPs] = useState({});

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('rideFlexDarkMode')) || false);

  useEffect(() => {
    localStorage.setItem('rideFlexDarkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('rideFlexUser', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('rideFlexUsersDB', JSON.stringify(usersDB));
  }, [usersDB]);

  const login = (identifier, password, role) => {
    const foundUser = usersDB.find(u => 
      (u.email === identifier || u.mobile === identifier) && 
      u.password === password && 
      u.role === role
    );
    
    if (foundUser) {
      setUser(foundUser);
      return { success: true };
    }
    return { success: false, message: "Invalid credentials or role mismatch." };
  };

  const register = (formData, role) => {
    // Check Email Uniqueness
    if (usersDB.find(u => u.email === formData.email)) {
      return { success: false, message: "Email already registered." };
    }

    // Check Mobile Uniqueness
    if (formData.mobile && usersDB.find(u => u.mobile === formData.mobile)) {
      return { success: false, message: "Mobile number already registered." };
    }

    // Critical Rule: Seller GST Check
    if (role === 'seller') {
      const existingGST = usersDB.find(u => u.role === 'seller' && u.gstNumber === formData.gstNumber);
      if (existingGST) {
        return { success: false, message: "A seller with this GST Number already exists." };
      }
    }

    const newUser = {
      ...formData,
      role,
      isVerified: role === 'user' ? false : 'pending' // Sellers need Doc verification
    };
    
    setUsersDB([...usersDB, newUser]);
    setUser(newUser);
    return { success: true };
  };

  const sendOTP = (identifier, role) => {
    const userExists = usersDB.find(u => (u.email === identifier || u.mobile === identifier) && u.role === role);
    if (!userExists) {
      return { success: false, message: "User not found with these details." };
    }
    // Generate 4 digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setActiveOTPs(prev => ({ ...prev, [identifier]: otp }));
    
    // SIMULATION: Alert the OTP
    alert(`[RIDE FLEX SIMULATION]\nYour OTP is: ${otp}\n(Sent to ${identifier})`);
    
    return { success: true };
  };

  const sendResetLink = (identifier, role) => {
    const userExists = usersDB.find(u => (u.email === identifier || u.mobile === identifier) && u.role === role);
    if (!userExists) {
      return { success: false, message: "User not found with these details." };
    }
    // SIMULATION: Alert the Link
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
    const userIndex = usersDB.findIndex(u => (u.email === identifier || u.mobile === identifier) && u.role === role);
    if (userIndex > -1) {
      const updatedDB = [...usersDB];
      updatedDB[userIndex].password = newPassword;
      setUsersDB(updatedDB);
      
      // Cleanup OTP
      const newOTPs = { ...activeOTPs };
      delete newOTPs[identifier];
      setActiveOTPs(newOTPs);
      
      return { success: true };
    }
    return { success: false, message: "User not found with this email and role." };
  };

  const updateUser = (updatedData) => {
    if (!user) return { success: false, message: "No user logged in." };

    const userIndex = usersDB.findIndex(u => (u.email === user.email || u.mobile === user.mobile) && u.role === user.role);
    
    if (userIndex > -1) {
      const updatedDB = [...usersDB];
      const updatedUserObj = { ...updatedDB[userIndex], ...updatedData };
      updatedDB[userIndex] = updatedUserObj;
      setUsersDB(updatedDB);
      setUser(updatedUserObj);
      return { success: true };
    }
    return { success: false, message: "User record not found." };
  };

  const changePassword = (currentPassword, newPassword) => {
    if (!user) return { success: false, message: "No user logged in." };
    
    if (user.password !== currentPassword) {
      return { success: false, message: "Current password is incorrect." };
    }

    const userIndex = usersDB.findIndex(u => (u.email === user.email || u.mobile === user.mobile) && u.role === user.role);
    if (userIndex > -1) {
      const updatedDB = [...usersDB];
      updatedDB[userIndex].password = newPassword;
      setUsersDB(updatedDB);
      setUser({ ...user, password: newPassword });
      return { success: true };
    }
    return { success: false, message: "User record not found." };
  };

  const deleteAccount = () => {
    if (!user) return { success: false, message: "No user logged in." };

    const userIndex = usersDB.findIndex(u => (u.email === user.email || u.mobile === user.mobile) && u.role === user.role);
    
    if (userIndex > -1) {
      const updatedDB = usersDB.filter((_, index) => index !== userIndex);
      setUsersDB(updatedDB);
      logout();
      return { success: true };
    }
    return { success: false, message: "User record not found." };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('rideFlexUser');
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, resetPassword, sendOTP, verifyOTP, sendResetLink, updateUser, changePassword, deleteAccount, darkMode, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);