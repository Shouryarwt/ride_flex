import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { User, Lock, Save, Camera, Trash2 } from 'lucide-react';

const ProfileSettings = () => {
  const { user, updateUser, changePassword, deleteAccount } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  
  // Personal Info State
  const [personalData, setPersonalData] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    shopName: user?.shopName || '', // Seller only
    address: user?.address || '', // Seller only
    profilePic: user?.profilePic || ''
  });

  // Password State
  const [passData, setPassData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    const res = updateUser(personalData);
    if (res.success) alert("Profile updated successfully!");
    else alert(res.message);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) {
      alert("New passwords do not match.");
      return;
    }
    const res = changePassword(passData.current, passData.new);
    if (res.success) {
      alert("Password changed successfully!");
      setPassData({ current: '', new: '', confirm: '' });
    } else {
      alert(res.message);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      const res = deleteAccount();
      if (res.success) {
        alert("Account deleted successfully.");
      } else {
        alert(res.message);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonalData(prev => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Profile Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-white rounded-xl shadow p-4 h-fit">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-2 relative group">
              {personalData.profilePic ? (
                <img src={personalData.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-full h-full p-4 text-gray-400" />
              )}
              <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white">
                <Camera size={24} />
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            <h3 className="font-bold text-lg">{user?.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          </div>
          
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('personal')}
              className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 ${activeTab === 'personal' ? 'bg-slate-900 text-white' : 'hover:bg-gray-100'}`}
            >
              <User size={18} /> Personal Details
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-4 py-2 rounded flex items-center gap-2 ${activeTab === 'security' ? 'bg-slate-900 text-white' : 'hover:bg-gray-100'}`}
            >
              <Lock size={18} /> Security
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl shadow p-6">
          {activeTab === 'personal' && (
            <form onSubmit={handlePersonalSubmit} className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Full Name</label><input type="text" className="w-full border p-2 rounded" value={personalData.name} onChange={e => setPersonalData({...personalData, name: e.target.value})} /></div>
                <div><label className="block text-sm font-medium mb-1">Mobile</label><input type="text" className="w-full border p-2 rounded" value={personalData.mobile} onChange={e => setPersonalData({...personalData, mobile: e.target.value})} /></div>
                <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Email</label><input type="email" disabled className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed" value={personalData.email} /></div>
                
                {user?.role === 'seller' && (
                  <>
                    <div><label className="block text-sm font-medium mb-1">Shop Name</label><input type="text" className="w-full border p-2 rounded" value={personalData.shopName} onChange={e => setPersonalData({...personalData, shopName: e.target.value})} /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Address</label><textarea className="w-full border p-2 rounded" value={personalData.address} onChange={e => setPersonalData({...personalData, address: e.target.value})} /></div>
                  </>
                )}
              </div>
              <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-slate-800"><Save size={18} /> Save Changes</button>
            </form>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Change Password</h2>
                <div><label className="block text-sm font-medium mb-1">Current Password</label><input type="password" required className="w-full border p-2 rounded" value={passData.current} onChange={e => setPassData({...passData, current: e.target.value})} /></div>
                <div><label className="block text-sm font-medium mb-1">New Password</label><input type="password" required className="w-full border p-2 rounded" value={passData.new} onChange={e => setPassData({...passData, new: e.target.value})} /></div>
                <div><label className="block text-sm font-medium mb-1">Confirm New Password</label><input type="password" required className="w-full border p-2 rounded" value={passData.confirm} onChange={e => setPassData({...passData, confirm: e.target.value})} /></div>
                <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-slate-800"><Save size={18} /> Update Password</button>
              </form>

              <div className="border-t pt-6">
                <h3 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h3>
                <p className="text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <button 
                  onClick={handleDeleteAccount} 
                  className="bg-red-50 text-red-600 border border-red-200 px-6 py-2 rounded font-semibold hover:bg-red-100 transition flex items-center gap-2"
                >
                  <Trash2 size={18} /> Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;