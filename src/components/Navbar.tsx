import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  RefreshCw, 
  Download, 
  LogIn, 
  User as UserIcon, 
  LogOut, 
  ShieldAlert, 
  Menu, 
  X,
  Sun,
  Moon,
  Eye,
  Languages,
  Thermometer,
  Radio,
  Search,
  Clock,
  ChevronDown
} from 'lucide-react';
import { Junction, LocationInfo, UserProfile, UserRole } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Language } from '../i18n/translations';

interface NavbarProps {
  location: LocationInfo;
  user: UserProfile | null;
  junctions?: Junction[];
  onSelectJunction?: (junction: Junction) => void;
  onOpenLocationModal: () => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onRefreshConditions: () => void;
  onExportCsv: () => void;
  isRefreshing: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  location,
  user,
  junctions = [],
  onSelectJunction,
  onOpenLocationModal,
  onOpenAuthModal,
  onLogout,
  onRefreshConditions,
  onExportCsv,
  isRefreshing,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, toggleTheme, unit, setUnit } = useTheme();

  // Live Clock
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  // Quick Search state
  const [quickSearch, setQuickSearch] = useState('');
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  // User Role Switcher for demo
  const [demoRole, setDemoRole] = useState<UserRole>(user?.role || 'Supervisor');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const languageOptions: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी', flag: '🚩' },
  ];

  const matchedJunctions = quickSearch.trim()
    ? junctions.filter((j) =>
        j.name.toLowerCase().includes(quickSearch.toLowerCase()) ||
        j.neighborhood.toLowerCase().includes(quickSearch.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 flex items-center justify-center shadow-md shadow-orange-950/40 border border-orange-400/30">
                <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                    {t.appName}
                  </span>
                  <span className="hidden xl:inline-flex text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    TRAFFIC POLICE
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 hidden lg:block truncate max-w-[280px]">
                  {t.appSubtitle}
                </span>
              </div>
            </div>
          </div>

          {/* Current Date & Time Clock */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentDate}</span>
            <span className="text-amber-400 font-bold">{currentTime}</span>
          </div>

          {/* Quick Search Junction Control */}
          <div className="relative hidden md:block w-44 lg:w-56">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => {
                  setQuickSearch(e.target.value);
                  setSearchDropdownOpen(true);
                }}
                onFocus={() => setSearchDropdownOpen(true)}
                placeholder="Search junction..."
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {searchDropdownOpen && matchedJunctions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 text-xs">
                {matchedJunctions.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => {
                      if (onSelectJunction) onSelectJunction(j);
                      setQuickSearch('');
                      setSearchDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-700 text-slate-200 flex items-center justify-between border-b border-slate-750 last:border-0"
                  >
                    <span className="font-bold truncate">{j.name}</span>
                    <span className="text-[10px] font-mono text-amber-400 shrink-0">
                      {j.riskScore} ({j.riskCategory})
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Weather-Data Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="truncate max-w-[120px] text-amber-300 font-bold">DEMO TELEMETRY</span>
          </div>

          {/* 3-Language Selector */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/70 shadow-inner">
            {languageOptions.map((opt) => (
              <button
                key={opt.code}
                onClick={() => setLanguage(opt.code)}
                className={`px-2 py-0.5 text-xs font-bold rounded-lg transition duration-150 flex items-center gap-1 ${
                  language === opt.code
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
                title={`Switch to ${opt.label}`}
              >
                <span className="text-[11px]">{opt.flag}</span>
                <span className="hidden sm:inline">{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Right Controls: Theme Selector, User Role Selector, Auth */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme Selector (Light, Dark, High-Contrast) */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700">
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-lg transition ${
                  theme === 'light' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="Light Theme"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-lg transition ${
                  theme === 'dark' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="Dark Theme"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('high-contrast')}
                className={`p-1.5 rounded-lg transition ${
                  theme === 'high-contrast' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
                title="High-Contrast Accessibility Mode"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* User-Role Selector for Demo */}
            <div className="hidden lg:flex items-center">
              <select
                value={demoRole}
                onChange={(e) => setDemoRole(e.target.value as UserRole)}
                className="py-1 px-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-amber-400 focus:outline-hidden"
                title="Demo User Role"
              >
                <option value="Supervisor">Supervisor</option>
                <option value="Traffic Police">Police Officer</option>
                <option value="Municipal Officer">Municipal Officer</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefreshConditions}
              disabled={isRefreshing}
              className="p-1.5 sm:px-2 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs flex items-center gap-1 transition"
              title="Refresh Simulated Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline font-bold">Refresh</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={onExportCsv}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition"
              title="Export CSV Dataset"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>CSV</span>
            </button>

            {/* User Icon */}
            {user ? (
              <div 
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 border border-amber-300/40 flex items-center justify-center text-xs font-bold text-white shadow-xs"
                title={`${user.fullName} (${demoRole})`}
              >
                {user.fullName.slice(0, 2).toUpperCase()}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuthModal('login')}
                className="px-2.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
