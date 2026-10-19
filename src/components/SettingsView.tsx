import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Languages, 
  Sun, 
  Moon, 
  Thermometer, 
  Bell, 
  Radio, 
  Database, 
  RotateCcw, 
  ShieldCheck, 
  Info,
  CheckCircle2,
  Cpu,
  Clock,
  Sliders,
  AlertTriangle,
  Building2,
  HeartPulse,
  Eye,
  Flame,
  Users
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Language } from '../i18n/translations';

export const SettingsView: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { 
    theme, 
    setTheme, 
    unit, 
    setUnit, 
    alertThreshold, 
    setAlertThreshold,
    notificationsEnabled,
    setNotificationsEnabled 
  } = useTheme();

  const [nugenStatus, setNugenStatus] = useState<any>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'about'>('settings');

  // Duty limit defaults in demo settings
  const [highRiskMaxDuty, setHighRiskMaxDuty] = useState<number>(45);
  const [highRiskMinBreak, setHighRiskMinBreak] = useState<number>(15);
  const [modRiskMaxDuty, setModRiskMaxDuty] = useState<number>(60);

  useEffect(() => {
    fetch('/api/assistant/status')
      .then((res) => res.json())
      .then((data) => setNugenStatus(data))
      .catch((err) => console.warn('Nugen status error in settings:', err));
  }, []);

  const handleResetData = async () => {
    localStorage.removeItem('heatshield_duty_assignments');
    localStorage.removeItem('heatshield_cooling_priorities');
    
    try {
      await fetch('/api/junctions/reset', { method: 'POST' });
    } catch (e) {
      console.warn('Backend reset call:', e);
    }

    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      window.location.reload();
    }, 1000);
  };

  const languageOptions: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी (Marathi)', flag: '🚩' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-500/10 text-slate-700 dark:text-slate-300">
              <SettingsIcon className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.settingsTitle}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            {t.settingsSubtitle}
          </p>
        </div>

        {/* Tab Switcher: Settings vs About */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            Preferences & Config
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'about'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            About & Methodology
          </button>
        </div>
      </div>

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: UI Preferences */}
          <div className="space-y-6">
            {/* 1. Language Preference */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.prefLanguage}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select the primary working interface language. This also directs the Nugen AI Assistant to reply in your chosen tongue.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {languageOptions.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => setLanguage(opt.code)}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between ${
                      language === opt.code
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs font-extrabold'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{opt.flag}</span>
                      <span>{opt.label}</span>
                    </div>
                    {language === opt.code && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Three Selectable Themes (Light, Dark, High-Contrast) */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.prefTheme}
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose between standard light mode, dark operations mode, or high-contrast accessibility mode for bright sunlight.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition ${
                    theme === 'light'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs font-extrabold'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Sun className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                  <span>Light Theme</span>
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition ${
                    theme === 'dark'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs font-extrabold'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Moon className="w-4 h-4 mx-auto mb-1 text-slate-400" />
                  <span>Dark Theme</span>
                </button>

                <button
                  onClick={() => setTheme('high-contrast')}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition ${
                    theme === 'high-contrast'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs font-extrabold'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Eye className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
                  <span>High Contrast</span>
                </button>
              </div>
            </div>

            {/* 3. Temperature Unit */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.prefUnit}
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setUnit('C')}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center transition ${
                    unit === 'C'
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Celsius (°C)
                </button>
                <button
                  onClick={() => setUnit('F')}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center transition ${
                    unit === 'F'
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Fahrenheit (°F)
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Scoring Config, Duty Thresholds & Reset */}
          <div className="space-y-6">
            {/* 4. Demo Risk-Score Formula Configuration */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Demo Heat-Risk Scoring Configuration
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configured weights for the demonstration scoring algorithm:
              </p>
              <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span>Base Comfort Temp:</span>
                  <strong>24.0°C</strong>
                </div>
                <div className="flex justify-between">
                  <span>Temp Multiplier:</span>
                  <strong>+3.3 pts / °C</strong>
                </div>
                <div className="flex justify-between">
                  <span>Humidity Penalty:</span>
                  <strong>+0.45 pts / % &gt;30%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Traffic Asphalt Multiplier:</span>
                  <strong>+4 to +18 pts</strong>
                </div>
                <div className="flex justify-between">
                  <span>Max Canopy Shade Relief:</span>
                  <strong>-14.0 pts</strong>
                </div>
              </div>
            </div>

            {/* 5. Duty Duration & Break Policy Settings */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Default Duty Limits & Rest Thresholds
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    High-Risk Max Standing (min)
                  </label>
                  <input
                    type="number"
                    value={highRiskMaxDuty}
                    onChange={(e) => setHighRiskMaxDuty(parseInt(e.target.value, 10) || 45)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    High-Risk Rest Break (min)
                  </label>
                  <input
                    type="number"
                    value={highRiskMinBreak}
                    onChange={(e) => setHighRiskMinBreak(parseInt(e.target.value, 10) || 15)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 6. Nugen API Connection Status (No Secret Exposing) */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-violet-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Nugen API Service Status
                </h2>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Permitted AI Service:</span>
                  <strong className="text-violet-600 dark:text-violet-400">Nugen API (Exclusive)</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span>Model Engine:</span>
                  <span className="font-mono">{nugenStatus?.model || 'nugen-flash-instruct'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Credentials Status:</span>
                  <span className={nugenStatus?.configured ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>
                    {nugenStatus?.configured ? 'Key Configured (Backend)' : 'Awaiting Valid Key'}
                  </span>
                </div>
              </div>
            </div>

            {/* 7. Reset Demonstration Data */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-red-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Reset Demonstration Data
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Restores the 5 Pune demonstration junction records, duty schedules, and cooling facility priorities to their initial baseline states.
              </p>

              {resetSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Demo data successfully reset! Reloading grid...</span>
                </div>
              )}

              <button
                onClick={handleResetData}
                className="w-full py-2.5 px-4 rounded-xl border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Demo Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ABOUT SECTION (SECTION 17) */}
      {activeTab === 'about' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 max-w-4xl">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              About HeatShield AI — Occupational Climate Safety System
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Designed for public safety professionals on outdoor intersection duty in high-density urban environments.
            </p>
          </div>

          {/* Problem Statement */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs leading-relaxed">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500" />
              1. The Climate Challenge for Traffic Police
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              During Indian summer months, traffic police officers stand for extended 4-to-6 hour shifts directly on black bitumen asphalt. Bitumen can reradiate surface temperatures exceeding 55°C, while idling vehicle exhaust under flyovers creates trapped thermal microclimates. General weather forecasts do not capture these localized intersection heat islands. Prolonged exposure causes dehydration, heat exhaustion, and life-threatening heatstroke.
            </p>
          </div>

          {/* Intended Users */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs leading-relaxed">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-500" />
              2. Intended User Roles
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
              <li><strong>Traffic Police Officers & Marshals:</strong> Track active thermal strain, hydration schedules, and recommended shaded relief intervals.</li>
              <li><strong>Duty Supervisors & Inspectors:</strong> Build heat-aware shift rotations, enforce maximum continuous outdoor standing constraints, and detect fatigue conflicts.</li>
              <li><strong>Municipal Authorities:</strong> Target high-exposure intersections for drinking water dispensers, misting canopies, and shaded kiosks based on empirical priority scoring.</li>
            </ul>
          </div>

          {/* Methodology */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs leading-relaxed">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-500" />
              3. Heat-Risk Assessment & Smart Duty Planning Methodology
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              HeatShield AI integrates microclimate variables (ambient temperature, relative humidity, vehicle congestion, canopy shade, and hydration access) into a transparent composite score (0–100). Deterministic duty planner algorithms enforce safe standing limits (e.g., maximum 40–45 minutes continuous tarmac standing during High Risk conditions) with mandatory 15-minute shaded recovery.
            </p>
          </div>

          {/* Limitations */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              4. Limitations of Simulated Demonstration Data
            </h3>
            <p>
              The five Pune demonstration junctions (JM Road, Deccan Gymkhana, Shivajinagar, Swargate, and Hadapsar) use simulated telemetry calibrated to realistic Pune microclimate patterns. This prototype demonstrates operational workflows and decision-support logic. The scoring formula is an explainable rule-based simulation and should not be used as an official medical diagnostic device.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
