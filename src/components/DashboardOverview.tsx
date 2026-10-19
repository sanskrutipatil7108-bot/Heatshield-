import React, { useState } from 'react';
import { 
  Flame, 
  MapPin, 
  Thermometer, 
  Clock, 
  ShieldAlert, 
  CalendarClock, 
  RefreshCw, 
  Download, 
  ArrowRight,
  TrendingUp,
  Droplets,
  AlertTriangle,
  Info,
  CheckCircle2,
  Users,
  Sun,
  Shield,
  Layers,
  ChevronRight,
  Radio,
  Eye,
  BotMessageSquare,
  Sparkles,
  Wind
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  Legend 
} from 'recharts';
import { Junction, DutyPlan, LocationInfo, WeatherCondition, NavTab } from '../types';
import { getRiskColorClasses } from '../utils/heatRisk';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface DashboardOverviewProps {
  location: LocationInfo;
  weather: WeatherCondition;
  junctions: Junction[];
  dutyPlans: DutyPlan[];
  onNavigateTab: (tab: NavTab) => void;
  onRefreshConditions: () => void;
  onExportCsv: () => void;
  isRefreshing: boolean;
  onSelectJunction: (junction: Junction) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  location,
  weather,
  junctions,
  dutyPlans,
  onNavigateTab,
  onRefreshConditions,
  onExportCsv,
  isRefreshing,
  onSelectJunction,
}) => {
  const { t } = useLanguage();
  const { formatTemp, theme } = useTheme();

  const [tableFilter, setTableFilter] = useState<'all' | 'high' | 'moderate' | 'low'>('all');

  // Filter junctions for the table
  const filteredJunctions = junctions.filter((j) => {
    if (tableFilter === 'high') return j.riskCategory === 'High';
    if (tableFilter === 'moderate') return j.riskCategory === 'Moderate';
    if (tableFilter === 'low') return j.riskCategory === 'Low';
    return true;
  });

  // Calculate summary counts
  const totalCount = junctions.length;
  const lowRiskCount = junctions.filter((j) => j.riskCategory === 'Low').length;
  const modRiskCount = junctions.filter((j) => j.riskCategory === 'Moderate').length;
  const highRiskCount = junctions.filter((j) => j.riskCategory === 'High').length;
  const activeAlertsCount = junctions.filter((j) => j.riskScore >= 75).length;
  const avgRiskScore = Math.round(junctions.reduce((acc, j) => acc + j.riskScore, 0) / Math.max(1, totalCount));
  const totalAssignedOfficers = junctions.reduce((acc, j) => acc + (j.vulnerableStaffCount || 0), 0);
  const coolingAttentionCount = junctions.filter((j) => !j.drinkingWaterNearby || (j.shadePercent < 15)).length;

  // Chart data 1: Temperature comparison
  const tempChartData = junctions.map((j) => ({
    name: j.name.replace(' Junction', '').replace(' Signal', ''),
    temperature: j.temp,
    humidity: j.humidity,
    riskScore: j.riskScore,
    category: j.riskCategory,
  }));

  // Chart data 2: Risk distribution
  const riskDistributionData = [
    { name: t.riskHigh, value: highRiskCount, color: '#EF4444' },
    { name: t.riskModerate, value: modRiskCount, color: '#F59E0B' },
    { name: t.riskLow, value: lowRiskCount, color: '#10B981' },
  ].filter((d) => d.value > 0);

  // Chart data 3: 24-Hour Diurnal temperature trend for Pune
  const hourlyTrendData = [
    { hour: '06:00', temp: 26.5, humidity: 68, risk: 28 },
    { hour: '08:00', temp: 29.8, humidity: 60, risk: 38 },
    { hour: '10:00', temp: 34.2, humidity: 52, risk: 54 },
    { hour: '12:00', temp: 38.6, humidity: 46, risk: 78 },
    { hour: '14:00', temp: 41.2, humidity: 42, risk: 88 },
    { hour: '16:00', temp: 39.4, humidity: 44, risk: 80 },
    { hour: '18:00', temp: 35.1, humidity: 50, risk: 58 },
    { hour: '20:00', temp: 31.0, humidity: 58, risk: 42 },
    { hour: '22:00', temp: 28.4, humidity: 64, risk: 32 },
  ];

  const isDark = theme === 'dark';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Operational Status Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t.dashboardTitle}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              {t.dashboardSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Data Source Badge: Distinguishes Live vs Simulated Data */}
            <div 
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 shadow-xs ${
                weather.isLive 
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200' 
                  : 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200'
              }`}
              title={weather.isLive ? 'Real-time readings from Open-Meteo' : 'Simulated Pune traffic baseline for prototype testing'}
            >
              <span className={`w-2 h-2 rounded-full ${weather.isLive ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              <span className="font-mono uppercase tracking-wider text-[11px]">
                {weather.isLive ? t.liveDataBadge : t.demoDataBadge}
              </span>
            </div>

            <button
              onClick={onRefreshConditions}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{t.refresh}</span>
            </button>
          </div>
        </div>
      </div>

      {/* A. SUMMARY CARDS (8 Required Section 9 Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 sm:gap-4">
        {/* 1. Total Monitored Junctions */}
        <div 
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTab('monitoring')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigateTab('monitoring'); }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-2xl p-4 shadow-xs cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group select-none"
          title="Click to view Junction Monitoring Grid"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span className="line-clamp-1">{t.totalJunctions}</span>
            <Layers className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white flex items-baseline justify-between">
            <span>{totalCount}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block truncate">
            Pune Traffic Grid
          </span>
        </div>

        {/* 2. High-Risk Junctions */}
        <div 
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTab('monitoring')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigateTab('monitoring'); }}
          className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 hover:border-red-400 dark:hover:border-red-600 rounded-2xl p-4 shadow-xs cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group select-none"
          title="Click to filter High Risk Junctions"
        >
          <div className="flex items-center justify-between text-red-700 dark:text-red-400 text-xs font-semibold">
            <span className="line-clamp-1">{t.highRiskCount}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div className="mt-2 text-2xl font-black text-red-600 dark:text-red-400 flex items-baseline justify-between">
            <span>{highRiskCount}</span>
            <ChevronRight className="w-3.5 h-3.5 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-[11px] text-red-600/80 dark:text-red-400/80 mt-0.5 block truncate">
            Critical (≥ 75)
          </span>
        </div>

        {/* 3. Moderate-Risk Junctions */}
        <div 
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTab('monitoring')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigateTab('monitoring'); }}
          className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 hover:border-amber-400 dark:hover:border-amber-600 rounded-2xl p-4 shadow-xs cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group select-none"
          title="Click to inspect Moderate Risk Junctions"
        >
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <span className="line-clamp-1">{t.modRiskCount}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400 flex items-baseline justify-between">
            <span>{modRiskCount}</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-0.5 block truncate">
            Caution (45–74)
          </span>
        </div>

        {/* 4. Low-Risk Junctions */}
        <div 
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTab('monitoring')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigateTab('monitoring'); }}
          className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-400 dark:hover:border-emerald-600 rounded-2xl p-4 shadow-xs cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group select-none"
          title="Click to inspect Low Risk Junctions"
        >
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <span className="line-clamp-1">{t.lowRiskCount}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-baseline justify-between">
            <span>{lowRiskCount}</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5 block truncate">
            Safe (&lt; 45 Score)
          </span>
        </div>

        {/* 5. Current Monitored Temperature */}
        <div 
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTab('prediction')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigateTab('prediction'); }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-400 dark:hover:border-orange-600 rounded-2xl p-4 shadow-xs cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group select-none"
          title="Click to simulate temperature scenarios"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span className="line-clamp-1">{t.currentTemp}</span>
            <Thermometer className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-black text-orange-600 dark:text-orange-400 font-mono flex items-baseline justify-between">
            <span>{formatTemp(weather.temperature)}</span>
            <ChevronRight className="w-3.5 h-3.5 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block truncate">
            {t.apparentTemp}: {formatTemp(weather.apparentTemp)}
          </span>
        </div>

        {/* 6. Average Heat-Risk Score */}
        <div 
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTab('analytics')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigateTab('analytics'); }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 rounded-2xl p-4 shadow-xs cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group select-none"
          title="Click to view analytics and score distribution"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span className="line-clamp-1">{t.avgRiskScoreCard}</span>
            <TrendingUp className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-black text-purple-600 dark:text-purple-400 font-mono flex items-baseline justify-between">
            <span>{avgRiskScore}</span>
            <span className="text-xs text-slate-400 font-normal">/100</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block truncate">
            Pune Microclimate Index
          </span>
        </div>

        {/* 7. Officers Assigned Outdoor Duty */}
        <div 
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTab('duty-planner')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigateTab('duty-planner'); }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-2xl p-4 shadow-xs cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group select-none"
          title="Click to manage shift rotations in Smart Duty Planner"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span className="line-clamp-1">{t.officersAssignedCard}</span>
            <Users className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400 flex items-baseline justify-between">
            <span>{totalAssignedOfficers}</span>
            <ChevronRight className="w-3.5 h-3.5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block truncate">
            Active Shifts Across Grid
          </span>
        </div>

        {/* 8. Cooling Facilities Attention Needed */}
        <div 
          role="button"
          tabIndex={0}
          onClick={() => onNavigateTab('cooling-facilities')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigateTab('cooling-facilities'); }}
          className="bg-white dark:bg-slate-900 border border-cyan-200 dark:border-cyan-900/50 hover:border-cyan-400 dark:hover:border-cyan-600 rounded-2xl p-4 shadow-xs cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group select-none"
          title="Click to view Cooling Facilities Prioritization"
        >
          <div className="flex items-center justify-between text-cyan-700 dark:text-cyan-400 text-xs font-semibold">
            <span className="line-clamp-1">{t.coolingAttentionCard}</span>
            <Droplets className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-black text-cyan-600 dark:text-cyan-400 flex items-baseline justify-between">
            <span>{coolingAttentionCount}</span>
            <ChevronRight className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-[11px] text-cyan-600/80 dark:text-cyan-400/80 mt-0.5 block truncate">
            Urgent Shade/Water Sites
          </span>
        </div>
      </div>

      {/* E. QUICK ACTIONS BAR */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-slate-200">
              {t.quickActionsTitle}:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateTab('map')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 transition flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>{t.actionViewMap}</span>
            </button>

            <button
              onClick={() => onNavigateTab('prediction')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 transition flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>{t.actionPredict}</span>
            </button>

            <button
              onClick={() => onNavigateTab('duty-planner')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 transition flex items-center gap-1.5"
            >
              <CalendarClock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.actionPlanDuty}</span>
            </button>

            <button
              onClick={() => onNavigateTab('cooling-facilities')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 transition flex items-center gap-1.5"
            >
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.actionCooling}</span>
            </button>

            <button
              onClick={() => onNavigateTab('ai-assistant')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <BotMessageSquare className="w-3.5 h-3.5" />
              <span>{t.actionAskAi}</span>
            </button>
          </div>
        </div>
      </div>

      {/* C. VISUALIZATIONS GRID (4 Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Junction Temperature Comparison */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <span>{t.tempComparisonTitle}</span>
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Monitored surface & ambient heat readings across Pune signals
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              5 Junctions
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tempChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#E2E8F0'} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11 }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  domain={[30, 45]} 
                  tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0F172A' : '#FFFFFF', 
                    borderColor: isDark ? '#334155' : '#CBD5E1',
                    borderRadius: '0.75rem',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="temperature" fill="#F97316" radius={[6, 6, 0, 0]}>
                  {tempChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.category === 'High' ? '#EF4444' : entry.category === 'Moderate' ? '#F59E0B' : '#10B981'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Heat-Risk Score Comparison */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" />
                <span>{t.riskComparisonTitle}</span>
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Composite heat stress index (0–100 scale: Low &lt;45, Mod 45–74, High ≥75)
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
              Risk Index
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tempChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#E2E8F0'} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11 }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis domain={[0, 100]} tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0F172A' : '#FFFFFF', 
                    borderColor: isDark ? '#334155' : '#CBD5E1',
                    borderRadius: '0.75rem',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="riskScore" radius={[6, 6, 0, 0]}>
                  {tempChartData.map((entry, index) => (
                    <Cell 
                      key={`score-${index}`} 
                      fill={entry.riskScore >= 75 ? '#EF4444' : entry.riskScore >= 45 ? '#F59E0B' : '#10B981'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Risk Distribution Donut */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="mb-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>{t.riskDistributionTitle}</span>
            </h2>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Distribution of monitored junctions by hazard category
            </span>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`slice-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: 24-Hour Diurnal Temperature Trend Forecast */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-500" />
                <span>{t.tempTrendTitle}</span>
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Peak danger window: 12:00 PM – 16:00 PM (Direct solar and bitumen radiation)
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
              Peak: 41.2°C at 14:00
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#E2E8F0'} />
                <XAxis dataKey="hour" tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11 }} />
                <YAxis tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0F172A' : '#FFFFFF', 
                    borderColor: isDark ? '#334155' : '#CBD5E1',
                    borderRadius: '0.75rem',
                    fontSize: '12px'
                  }} 
                />
                <Area type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#EF4444" fillOpacity={1} fill="url(#tempGradient)" />
                <Area type="monotone" dataKey="risk" name="Heat Risk Index" stroke="#8B5CF6" fillOpacity={1} fill="url(#riskGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* D. ALERTS PANEL */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t.alertsPanelTitle}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Actionable microclimate notifications for field supervisors
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-900">
            {activeAlertsCount} Active Hotspots
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Alert 1: Swargate Terminal */}
          <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-red-700 dark:text-red-400">
                Swargate Junction (84 Risk)
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white">HIGH</span>
            </div>
            <p className="text-xs text-red-900 dark:text-red-200 leading-snug">
              Gridlock bus exhaust reradiating 40.8°C thermal load. Enforce mandatory 15-min shaded rest every 45 min.
            </p>
            <div className="text-[11px] font-semibold text-red-700 dark:text-red-400 pt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Chilled ORS required on site</span>
            </div>
          </div>

          {/* Alert 2: Hadapsar Industrial Freight */}
          <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-red-700 dark:text-red-400">
                Hadapsar Junction (88 Risk)
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white">HIGH</span>
            </div>
            <p className="text-xs text-red-900 dark:text-red-200 leading-snug">
              Critical heat index: 41.5°C with heavy freight idling. Relieve officers from unshaded central posts.
            </p>
            <div className="text-[11px] font-semibold text-red-700 dark:text-red-400 pt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Misting shade awning needed</span>
            </div>
          </div>

          {/* Alert 3: Hydration Break Schedule */}
          <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-700 dark:text-amber-400">
                Citywide Hydration Protocol
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">ADVISORY</span>
            </div>
            <p className="text-xs text-amber-900 dark:text-amber-200 leading-snug">
              All active field officers must consume 250–350ml water every 20–30 minutes, regardless of thirst.
            </p>
            <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 pt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Hydration check interval: 30 min</span>
            </div>
          </div>

          {/* Alert 4: Emergency First Aid Protocol */}
          <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-blue-700 dark:text-blue-400">
                Medical Hotline Standby
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">SOP</span>
            </div>
            <p className="text-xs text-blue-900 dark:text-blue-200 leading-snug">
              For any signs of heatstroke (confusion, cessation of sweating), move to shade and call emergency services immediately.
            </p>
            <div className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 pt-1 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5" />
              <span>Emergency Dispatch: Dial 112 / 108</span>
            </div>
          </div>
        </div>
      </div>

      {/* B. JUNCTION MONITORING TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>{t.junctionTableTitle}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              5 clearly identified simulated Pune traffic junctions for operational demonstration
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setTableFilter('all')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                tableFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setTableFilter('high')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                tableFilter === 'high'
                  ? 'bg-red-500 text-white shadow-xs'
                  : 'text-red-600 dark:text-red-400 hover:text-red-700'
              }`}
            >
              High ({highRiskCount})
            </button>
            <button
              onClick={() => setTableFilter('moderate')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                tableFilter === 'moderate'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-amber-600 dark:text-amber-400 hover:text-amber-700'
              }`}
            >
              Moderate ({modRiskCount})
            </button>
            <button
              onClick={() => setTableFilter('low')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                tableFilter === 'low'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700'
              }`}
            >
              Low ({lowRiskCount})
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Junction Name & Area</th>
                <th className="py-3 px-3">Temp</th>
                <th className="py-3 px-3">Humidity</th>
                <th className="py-3 px-3">Traffic</th>
                <th className="py-3 px-3">Shade</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-4 min-w-[220px]">Recommended Action</th>
                <th className="py-3 px-3">Last Updated</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredJunctions.map((j) => {
                const colors = getRiskColorClasses(j.riskCategory);
                return (
                  <tr 
                    key={j.id} 
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {j.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                        {j.neighborhood}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                      {formatTemp(j.temp)}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                      {j.humidity}%
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                        {j.traffic}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                      {j.shadePercent}%
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm font-mono text-slate-900 dark:text-white">
                          {j.riskScore}
                        </span>
                        <div className="w-16 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${colors.indicator}`} 
                            style={{ width: `${j.riskScore}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${colors.badge}`}>
                        {j.riskCategory}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300 leading-snug">
                      {j.action}
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {j.lastUpdated}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          onSelectJunction(j);
                          onNavigateTab('map');
                        }}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
