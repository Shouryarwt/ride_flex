import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, Moon, Sun, UserRound, X } from 'lucide-react';
import { useAuth } from './AuthContext';
import { notificationAPI } from './api/notifications';

export default function Navbar() {
  const { user, logout, darkMode, toggleTheme } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return setNotifications([]);
    notificationAPI.getNotifications().then((r) => setNotifications(r.notifications || [])).catch(() => {});
  }, [user]);

  const unread = notifications.filter((n) => !n.read).length;
  const go = (path) => { setOpen(false); navigate(path); };
  const dashboard = user?.role === 'seller' ? '/dealer' : user?.role === 'admin' ? '/admin-dashboard' : '/dashboard';

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[#08090b]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-200 to-amber-600 text-black grid place-items-center font-black text-sm">RF</span>
          <span className="font-semibold tracking-tight text-lg">Ride <span className="text-amber-300">Flex</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-7 text-sm text-white/55">
          <a href="#fleet" className="hover:text-white transition">Fleet</a>
          <a href="#experience" className="hover:text-white transition">Experience</a>
          <span className="text-white/20">|</span>
          {user ? (
            <>
              <button onClick={() => go(dashboard)} className="hover:text-white transition">Dashboard</button>
              <button onClick={() => go('/profile')} className="hover:text-white transition">Profile</button>
              <button onClick={() => { logout(); go('/'); }} className="text-red-300/80 hover:text-red-200">Logout</button>
            </>
          ) : (
            <Link to="/auth" className="rounded-xl bg-white text-black px-5 py-2.5 font-semibold hover:bg-amber-100 transition">Login / Register</Link>
          )}
          <button onClick={toggleTheme} className="text-white/50 hover:text-white">{darkMode ? <Sun size={18}/> : <Moon size={18}/>}</button>
          {user && <div className="relative"><Bell size={18}/>{unread > 0 && <span className="absolute -top-2 -right-2 h-4 min-w-4 px-1 rounded-full bg-amber-400 text-black text-[10px] font-bold grid place-items-center">{unread}</span>}</div>}
        </div>

        <button className="md:hidden text-white/70" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#08090b] px-5 py-5 space-y-2">
          <button onClick={() => go('/')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5">Home</button>
          {user ? (
            <>
              <button onClick={() => go(dashboard)} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5">Dashboard</button>
              <button onClick={() => go('/profile')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5"><UserRound size={16} className="inline mr-2"/>Profile</button>
              <button onClick={() => { logout(); go('/'); }} className="w-full text-left px-4 py-3 rounded-xl text-red-300">Logout</button>
            </>
          ) : <button onClick={() => go('/auth')} className="w-full text-left px-4 py-3 rounded-xl bg-white text-black font-semibold">Login / Register</button>}
        </div>
      )}
    </nav>
  );
}
