import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Car, LogOut, User, MapPin, Bell, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout, darkMode, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: "Booking confirmed: BMW R 1250 GS", time: "2 mins ago" },
    { id: 2, text: "Reminder: Return Vespa SXL 150 tomorrow", time: "1 hour ago" },
    { id: 3, text: "Welcome to Ride Flex!", time: "1 day ago" }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 dark:bg-slate-950 text-white p-4 shadow-lg transition-colors duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-yellow-500">
          <Car size={32} />
          Ride Flex
        </Link>

        <div className="flex items-center gap-6">
          <button onClick={toggleTheme} className="hover:text-yellow-500 focus:outline-none">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {!user ? (
            <Link to="/auth" className="bg-yellow-500 text-slate-900 px-4 py-2 rounded font-semibold hover:bg-yellow-400">
              Login / Register
            </Link>
          ) : (
            <>
              <span className="text-gray-300">Welcome, {user.role === 'seller' ? user.shopName : user.name}</span>
              
              <Link 
                to={
                  user.role === 'admin' ? '/admin-dashboard' :
                  user.role === 'seller' ? '/seller-dashboard' :
                  '/dashboard'
                } 
                className="hover:text-yellow-500"
              >
                {
                  user.role === 'admin' ? 'Admin Dashboard' :
                  user.role === 'seller' ? 'Manage Inventory' :
                  'Browse Vehicles'
                }
              </Link>

              <Link to="/profile" className="hover:text-yellow-500 flex items-center gap-1">
                <User size={18} /> Profile
              </Link>
              
              {/* Notifications Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)} 
                  className="relative hover:text-yellow-500 focus:outline-none flex items-center"
                >
                  <Bell size={20} />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200 dark:border-slate-700">
                    <div className="p-3 border-b dark:border-slate-700 font-bold bg-gray-50 dark:bg-slate-700 text-sm">Notifications</div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(notif => (
                        <div key={notif.id} className="p-3 border-b dark:border-slate-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-slate-700 text-sm">
                          <p className="font-medium text-slate-800 dark:text-slate-200">{notif.text}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button onClick={handleLogout} className="flex items-center gap-1 text-red-400 hover:text-red-300">
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;