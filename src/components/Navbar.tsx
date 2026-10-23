import React, { useState } from 'react';
import {
  Waves,
  Coins,
  TrendingUp,
  AlertTriangle,
  LayoutDashboard,
  ShieldAlert,
  Code2,
  LogIn,
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenPythonDocs: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenPythonDocs,
  onOpenAuth,
}) => {
  const { user, logout, switchDemoPersona } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Waves },
    { id: 'seed-prices', label: 'Seed Prices', icon: Coins },
    { id: 'market-rates', label: 'Market Rates', icon: TrendingUp },
    { id: 'diseases', label: 'Seasonal Diseases', icon: AlertTriangle },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  if (user?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin Hub', icon: ShieldAlert });
  }

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-sky-900/40 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 via-teal-400 to-cyan-500 flex items-center justify-center text-sky-950 font-black shadow-md shadow-cyan-500/20 group-hover:scale-105 transition">
              <Waves className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition">
                  Aqua <span className="text-cyan-400">Farmers</span>
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 hidden sm:inline-block">
                  Verified Mandi
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
                Aquaculture Market &amp; Biosecurity Portal
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {item.id === 'admin' && (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                      ADMIN
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            {/* Python & MySQL Code Inspector Button */}
            <button
              onClick={onOpenPythonDocs}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition"
              title="Inspect Python Flask backend code, MySQL schema, and pytest suite"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Python &amp; MySQL</span>
            </button>

            {/* Persona Switcher Quick Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold max-w-[110px] truncate">
                  {user ? user.name : 'Guest'}
                </span>
                <span className="text-[10px] uppercase font-bold text-cyan-400 px-1 rounded bg-cyan-950">
                  {user?.role === 'admin' ? 'Admin' : 'Farmer'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {personaDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-800 text-slate-400">
                    <p className="font-bold text-white text-[11px] uppercase tracking-wider">
                      Switch Role / Persona
                    </p>
                    <p className="text-[10px]">Instant profile switching for evaluation</p>
                  </div>

                  <div className="p-1 space-y-1">
                    <button
                      onClick={() => {
                        switchDemoPersona('farmer_ramesh');
                        setPersonaDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-800 ${
                        user?.name === 'Ramesh Naidu' ? 'bg-cyan-950/60 text-cyan-300' : 'text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold">Ramesh Naidu</div>
                        <div className="text-[10px] text-slate-400">Shrimp Farmer • Bhimavaram, AP</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-900 text-sky-200">Farmer</span>
                    </button>

                    <button
                      onClick={() => {
                        switchDemoPersona('farmer_priya');
                        setPersonaDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-800 ${
                        user?.name === 'Priya Patel' ? 'bg-cyan-950/60 text-cyan-300' : 'text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold">Priya Patel</div>
                        <div className="text-[10px] text-slate-400">Brackish Farm • Surat, Gujarat</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-900 text-sky-200">Farmer</span>
                    </button>

                    <button
                      onClick={() => {
                        switchDemoPersona('admin_rao');
                        setPersonaDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between hover:bg-slate-800 ${
                        user?.role === 'admin' ? 'bg-cyan-950/60 text-cyan-300' : 'text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-amber-300">Dr. K.V. Rao (Admin)</div>
                        <div className="text-[10px] text-slate-400">Fisheries Extension • Full Access</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                        Admin
                      </span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between px-2">
                    <button
                      onClick={() => {
                        setPersonaDropdownOpen(false);
                        onOpenAuth('login');
                      }}
                      className="text-cyan-400 hover:text-cyan-300 font-bold text-[11px]"
                    >
                      Custom Login
                    </button>
                    {user && (
                      <button
                        onClick={() => {
                          logout();
                          setPersonaDropdownOpen(false);
                        }}
                        className="text-rose-400 hover:text-rose-300 font-medium text-[11px] flex items-center gap-1"
                      >
                        <LogOut className="w-3 h-3" /> Logout
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'admin' && (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                      ADMIN
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-2 px-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPythonDocs();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 text-cyan-300 border border-cyan-800/50 text-xs font-bold"
              >
                <Code2 className="w-4 h-4" /> Python &amp; MySQL Code
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
