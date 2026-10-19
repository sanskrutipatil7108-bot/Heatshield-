import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { LocationModal } from './components/LocationModal';
import { DashboardOverview } from './components/DashboardOverview';
import { HeatRiskMap } from './components/HeatRiskMap';
import { JunctionMonitoringView } from './components/JunctionMonitoringView';
import { HeatRiskPredictionView } from './components/HeatRiskPredictionView';
import { DutyPlannerView } from './components/DutyPlannerView';
import { CoolingPrioritiesView } from './components/CoolingPrioritiesView';
import { AiAssistantView } from './components/AiAssistantView';
import { AnalyticsReportsView } from './components/AnalyticsReportsView';
import { SettingsView } from './components/SettingsView';

import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

import {
  INITIAL_PUNE_LOCATION,
  INITIAL_PUNE_JUNCTIONS,
  INITIAL_DUTY_PLANS,
  INITIAL_COOLING_PRIORITIES,
  generateLocalizedJunctions,
} from './data/mockData';
import {
  Junction,
  DutyPlan,
  CoolingPriority,
  LocationInfo,
  UserProfile,
  WeatherCondition,
  NavTab,
} from './types';
import { exportReportCsv, calculateHeatRiskScore, getRecommendedAction } from './utils/heatRisk';

function MainAppContent() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // Authenticated User State (defaults to Traffic Police Supervisor)
  const [user, setUser] = useState<UserProfile | null>({
    id: 'demo-user-1',
    fullName: 'Insp. R. Kulkarni',
    email: 'r.kulkarni@traffic.pune.gov.in',
    role: 'Supervisor',
    badgeNumber: 'TP-4102',
    stationName: 'Swargate Traffic Division',
    isLoggedIn: true,
  });

  // Current Location State
  const [location, setLocation] = useState<LocationInfo>(INITIAL_PUNE_LOCATION);

  // Weather State (Calibrated Pune Telemetry)
  const [weather, setWeather] = useState<WeatherCondition>({
    temperature: 39.2,
    apparentTemp: 44.5,
    humidity: 48,
    windSpeed: 11,
    uvIndex: 9,
    conditionDescription: 'Simulated Solar Thermal Load (Pune Traffic Grid)',
    isLive: false,
    source: 'Simulated Pune Telemetry - DEMO DATA',
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  // Monitored 5 Pune Junctions State
  const [junctions, setJunctions] = useState<Junction[]>(() => {
    const saved = localStorage.getItem('heatshield_pune_junctions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved junctions:', e);
      }
    }
    return INITIAL_PUNE_JUNCTIONS;
  });

  const [selectedJunction, setSelectedJunction] = useState<Junction | null>(
    junctions[3] || junctions[0] // Swargate (High Risk) by default
  );

  // Duty Plans & Cooling Priorities
  const [dutyPlans, setDutyPlans] = useState<DutyPlan[]>(INITIAL_DUTY_PLANS);
  const [coolingPriorities, setCoolingPriorities] = useState<CoolingPriority[]>(INITIAL_COOLING_PRIORITIES);

  // Badge counts
  const highRiskCount = junctions.filter((j) => j.riskCategory === 'High').length;
  const pendingDutyCount = dutyPlans.filter((dp) => dp.supervisorStatus !== 'Approved').length;

  // Update specific junction across application
  const handleUpdateJunction = (updated: Junction) => {
    setJunctions((prev) => {
      const next = prev.map((j) => (j.id === updated.id ? updated : j));
      localStorage.setItem('heatshield_pune_junctions', JSON.stringify(next));
      return next;
    });

    if (selectedJunction && selectedJunction.id === updated.id) {
      setSelectedJunction(updated);
    }
  };

  // Reset Junctions to initial demo state
  const handleResetJunctions = async () => {
    localStorage.removeItem('heatshield_pune_junctions');
    setJunctions(INITIAL_PUNE_JUNCTIONS);
    setSelectedJunction(INITIAL_PUNE_JUNCTIONS[3]);

    try {
      await fetch('/api/junctions/reset', { method: 'POST' });
    } catch (e) {
      console.warn('Backend reset call:', e);
    }
  };

  // Handle Location Change
  const handleSelectLocation = async (newLocation: LocationInfo) => {
    setLocation(newLocation);
    setIsRefreshing(true);

    try {
      const res = await fetch(`/api/weather/lookup?city=${encodeURIComponent(newLocation.city)}`);
      if (res.ok) {
        const data = await res.json();
        const liveTemp = data.temperature || 38.0;
        const liveHumidity = data.humidity || 50;

        setWeather({
          temperature: liveTemp,
          apparentTemp: data.apparentTemperature || Math.round((liveTemp + liveHumidity * 0.1) * 10) / 10,
          humidity: liveHumidity,
          windSpeed: data.windSpeed || 12,
          uvIndex: 9,
          conditionDescription: 'Calibrated Telemetry Stream',
          isLive: false,
          source: 'Simulated Baseline (Pune Traffic Prototype) - DEMO DATA',
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });

        const localizedJunctions = generateLocalizedJunctions(newLocation, liveTemp, liveHumidity);
        setJunctions(localizedJunctions);
        setSelectedJunction(localizedJunctions[0]);
      }
    } catch (err) {
      console.warn('Weather lookup fallback:', err);
      const fallbackJunctions = generateLocalizedJunctions(newLocation, weather.temperature, weather.humidity);
      setJunctions(fallbackJunctions);
      setSelectedJunction(fallbackJunctions[0]);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Refresh Conditions
  const handleRefreshConditions = async () => {
    setIsRefreshing(true);
    try {
      setJunctions((prev) =>
        prev.map((j, idx) => {
          const tempOffset = (idx - 2) * 0.4;
          const newT = Math.round((j.temp + tempOffset) * 10) / 10;
          const newH = Math.max(20, Math.min(85, Math.round(j.humidity + (idx % 2 === 0 ? 1 : -1))));
          const { score, category } = calculateHeatRiskScore(newT, newH, j.traffic, j.shadePercent);
          return {
            ...j,
            temp: newT,
            humidity: newH,
            riskScore: score,
            riskCategory: category,
            action: getRecommendedAction(category, newT),
            lastUpdated: 'Just now (Refreshed)',
          };
        })
      );
    } finally {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  // Export CSV Report
  const handleExportCsv = () => {
    exportReportCsv(junctions, location.name, weather.source);
  };

  // Update specific duty plan
  const handleUpdateDutyPlan = (updated: DutyPlan) => {
    setDutyPlans((prev) =>
      prev.map((dp) => (dp.id === updated.id ? updated : dp))
    );
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation Bar with Search, Clock, Language, Theme, Role Selector */}
      <Navbar
        location={location}
        user={user}
        junctions={junctions}
        onSelectJunction={(j) => setSelectedJunction(j)}
        onOpenLocationModal={() => setLocationModalOpen(true)}
        onOpenAuthModal={handleOpenAuth}
        onLogout={handleLogout}
        onRefreshConditions={handleRefreshConditions}
        onExportCsv={handleExportCsv}
        isRefreshing={isRefreshing}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        activeTab={activeTab}
      />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar with 9 Functional Tabs */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          highRiskCount={highRiskCount}
          pendingDutyCount={pendingDutyCount}
        />

        {/* Content View Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          {/* Tab 1: Dashboard */}
          {activeTab === 'dashboard' && (
            <DashboardOverview
              location={location}
              weather={weather}
              junctions={junctions}
              dutyPlans={dutyPlans}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onRefreshConditions={handleRefreshConditions}
              onExportCsv={handleExportCsv}
              isRefreshing={isRefreshing}
              onSelectJunction={(j) => setSelectedJunction(j)}
            />
          )}

          {/* Tab 2: Heat Risk Map */}
          {activeTab === 'map' && (
            <HeatRiskMap
              location={location}
              junctions={junctions}
              selectedJunction={selectedJunction}
              onSelectJunction={(j) => setSelectedJunction(j)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* Tab 3: Dedicated Junction Monitoring Grid */}
          {activeTab === 'monitoring' && (
            <JunctionMonitoringView
              junctions={junctions}
              onUpdateJunction={handleUpdateJunction}
              onSelectJunction={(j) => setSelectedJunction(j)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onResetJunctions={handleResetJunctions}
            />
          )}

          {/* Tab 4: Heat Risk Prediction Module */}
          {activeTab === 'prediction' && (
            <HeatRiskPredictionView
              junctions={junctions}
              onUpdateJunction={handleUpdateJunction}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectJunction={(j) => setSelectedJunction(j)}
            />
          )}

          {/* Tab 5: Smart Duty Planner */}
          {activeTab === 'duty-planner' && (
            <DutyPlannerView
              dutyPlans={dutyPlans}
              onUpdateDutyPlan={handleUpdateDutyPlan}
              locationName={location.city || location.name}
              junctions={junctions}
            />
          )}

          {/* Tab 6: Cooling Facilities Priority */}
          {activeTab === 'cooling-facilities' && (
            <CoolingPrioritiesView
              priorities={coolingPriorities}
              junctions={junctions}
              locationName={location.city || location.name}
            />
          )}

          {/* Tab 7: AI Safety Assistant (Nugen API Exclusive) */}
          {activeTab === 'ai-assistant' && (
            <AiAssistantView
              location={location}
              junctions={junctions}
              weather={weather}
              selectedJunction={selectedJunction}
            />
          )}

          {/* Tab 8: Analytics and Reports */}
          {activeTab === 'analytics' && (
            <AnalyticsReportsView
              location={location}
              junctions={junctions}
              onExportCsv={handleExportCsv}
            />
          )}

          {/* Tab 9: Settings and About */}
          {activeTab === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onLoginSuccess={(u) => setUser(u)}
      />

      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        currentLocation={location}
        onSelectLocation={handleSelectLocation}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MainAppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
