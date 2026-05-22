import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { User, Mail, Phone, CreditCard, Save, MapPin, Lock, Moon, Sun } from 'lucide-react';

const Profile = () => {
  const { user, updateUser, changePassword, darkMode, toggleTheme } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    defaultPaymentMethod: 'card',
    address: '',
    upiId: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        defaultPaymentMethod: user.defaultPaymentMethod || 'card',
        address: user.address || '',
        upiId: user.upiId || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = updateUser(formData);
    if (res.success) {
      alert("Profile updated successfully!");
      setIsEditing(false);
    } else {
      alert(res.message);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("New passwords do not match!");
      return;
    }
    const res = changePassword(passwordData.currentPassword, passwordData.newPassword);
    if (res.success) {
      alert("Password changed successfully!");
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setShowPasswordChange(false);
    } else {
      alert(res.message);
    }
  };

  if (!user) return <div className="p-6 text-center">Please login to view profile.</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User size={24} /> My Profile
          </h1>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 transition"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <User size={16} /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white disabled:text-gray-500 dark:disabled:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <Mail size={16} /> Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={true}
                  className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-slate-800 dark:border-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <Phone size={16} /> Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white disabled:text-gray-500 dark:disabled:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <MapPin size={16} /> Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white disabled:text-gray-500 dark:disabled:text-gray-400"
                  placeholder="Your address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                  <CreditCard size={16} /> Refund UPI ID
                </label>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white disabled:text-gray-500 dark:disabled:text-gray-400"
                  placeholder="username@upi"
                />
              </div>
              
              {user.role === 'seller' && (
                <div className="md:col-span-2 bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border dark:border-slate-600">
                  <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-2">Verification Status</h3>
                  {(() => {
                    const status = user.dealer?.approvalStatus || (user.isVerified ? 'approved' : 'pending');
                    const isApproved = status === 'approved';
                    return (
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {isApproved ? 'Verified' : status === 'rejected' ? 'Rejected' : 'Pending Verification'}
                        </span>
                        {status === 'pending' && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">Documents uploaded and under review.</span>
                        )}
                        {status === 'rejected' && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">Your dealer profile was rejected. Contact support to update documents.</span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard size={20} /> Payment Preferences
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Payment Method</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['card', 'wallet', 'upi'].map(method => (
                    <label 
                      key={method}
                      className={`border rounded-lg p-4 flex items-center gap-3 cursor-pointer transition ${
                        formData.defaultPaymentMethod === method 
                          ? 'border-slate-900 bg-slate-50 dark:bg-slate-700 ring-1 ring-slate-900 dark:ring-slate-500 dark:border-slate-500' 
                          : 'hover:bg-gray-50 dark:hover:bg-slate-700 dark:border-slate-600'
                      } ${!isEditing ? 'opacity-75 pointer-events-none' : ''}`}
                    >
                      <input
                        type="radio"
                        name="defaultPaymentMethod"
                        value={method}
                        checked={formData.defaultPaymentMethod === method}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="text-slate-900 focus:ring-slate-900 dark:bg-slate-800"
                      />
                      <span className="capitalize font-medium dark:text-white">{method === 'card' ? 'Credit/Debit Card' : method.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  This method will be selected by default for your future bookings.
                </p>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end pt-4">
                <button 
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Save size={20} /> Save Changes
                </button>
              </div>
            )}
          </form>

          <div className="border-t pt-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                <span>Dark Mode</span>
              </div>
              <button 
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${darkMode ? 'bg-slate-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <button 
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="flex items-center gap-2 text-slate-800 dark:text-white font-bold hover:text-slate-600 dark:hover:text-slate-300"
            >
              <Lock size={20} /> Change Password
            </button>

            {showPasswordChange && (
              <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4 bg-gray-50 dark:bg-slate-700 p-4 rounded-lg border dark:border-slate-600">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                  />
                </div>
                <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded font-bold hover:bg-slate-800">
                  Update Password
                </button>
              </form>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;