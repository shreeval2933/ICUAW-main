import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Activity,
  LayoutGrid,
  Users,
  UserPlus,
  ClipboardList,
  FileSpreadsheet,
  Settings as SettingsIcon,
  Bell,
  ChevronRight,
  ChevronLeft,
  Beaker,
  Sun,
  Moon,
  LogOut,
  User,
  Menu
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const userStr = localStorage.getItem('icu_user');
  let userEmail = 'shreeval@text.com';
  try {
    if (userStr) {
      const u = JSON.parse(userStr);
      if (u && u.email) userEmail = u.email;
    }
  } catch (e) { }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light-mode');
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout API failed:', err);
    }
    localStorage.removeItem('icu_token');
    localStorage.removeItem('icu_user');
    window.location.href = '/login';
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutGrid },
    { name: 'Patients', path: '/patients', icon: Users },
    { name: 'Register Patient', path: '/new-patient', icon: UserPlus },
    { name: 'Daily Entry', path: '/daily-entry', icon: ClipboardList },
    { name: 'Lab Entry', path: '/lab-entry', icon: Beaker },
    { name: 'Reports', path: '/reports', icon: FileSpreadsheet },
  ];

  return (
    <div className={`min-h-screen bg-[#070f15] text-[#e2e8f0] flex flex-col font-body ${isDarkMode ? 'dark' : 'light'}`}>

      {/* Top Navbar Header */}
      <header className="bg-[#0b131a] border-b border-[#1e2e3d]/60 px-6 py-4 flex items-center justify-between shadow-lg relative">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="block sm:hidden p-1.5 bg-[#132230] border border-[#1e2e3d] rounded-lg text-[#94a3b8] hover:text-white transition"
            title="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center justify-center p-2 bg-[#0ba5e9] text-black rounded-lg">
            <Activity className="h-5 w-5" />
          </div>
          <div className="text-left">
            <h1 className="text-md font-bold font-heading text-white tracking-wide leading-none">
              AIIMS Jodhpur
            </h1>
            <p className="text-[#64748b] text-[11px] font-semibold mt-0.5">
              ICU Patient Data System
            </p>
          </div>
        </div>

        {/* Right utility items */}
        <div className="flex items-center gap-4 text-[#94a3b8] relative">
          <button
            onClick={toggleTheme}
            className="p-1.5 hover:bg-[#132230] rounded-lg transition hover:text-white"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-sky-400" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1.5 hover:bg-[#132230] rounded-lg transition hover:text-white"
            >
              <User className="h-5 w-5" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-56 bg-[#0f1b26] border border-[#1e2e3d] rounded-2xl p-4 shadow-xl z-50 animate-fade-in text-left">
                <div className="space-y-0.5 pb-3 border-b border-[#1e2e3d]/60">
                  <h4 className="font-extrabold text-white text-sm">shreeval</h4>
                  <p className="text-xs text-[#64748b] font-bold">shreeval@text.com</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 text-xs text-rose-500 font-black hover:text-rose-400 pt-3 transition"
                >
                  <LogOut className="h-4 w-4 stroke-[2.5]" /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main sidebar + content layout */}
      <div className="flex-1 flex overflow-hidden">

        {/* Sleek Vertical Navigation Bar */}
        <aside
          className={`bg-[#0b131a] border-r border-[#1e2e3d]/60 flex flex-col items-center py-4 transition-all duration-300 ${
            collapsed ? 'w-0 sm:w-16 overflow-hidden border-r-0 sm:border-r' : 'w-52'
          }`}
        >
          {/* Collapse/Expand Toggle button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 rounded-lg bg-[#132230] border border-[#1e2e3d] flex items-center justify-center hover:bg-[#1e2e3d] text-[#94a3b8] transition mb-6"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          <nav className="flex-1 w-full space-y-3 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  title={item.name}
                  onClick={() => {
                    if (window.innerWidth < 640) {
                      setCollapsed(true);
                    }
                  }}
                  className={`flex items-center rounded-xl p-3 text-sm font-semibold transition ${active
                    ? 'bg-[#132230] text-[#0ba5e9] border border-[#1e2e3d]'
                    : 'text-[#94a3b8] hover:bg-[#132230]/50 hover:text-white'
                    } ${collapsed ? 'justify-center' : 'gap-3 px-4'}`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 bg-[#070f15]">
          {children}
        </main>
      </div>
    </div>
  );
}
