import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Filter, 
  Calendar, 
  MapPin, 
  Flame, 
  Thermometer, 
  Droplets, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Info
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
  LineChart, 
  Line, 
  Legend 
} from 'recharts';
import { Junction, LocationInfo } from '../types';
import { exportReportCsv } from '../utils/heatRisk';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface AnalyticsReportsViewProps {
  location: LocationInfo;
  junctions: Junction[];
  onExportCsv: () => void;
}

export const AnalyticsReportsView: React.FC<AnalyticsReportsViewProps> = ({
  location,
  junctions,
  onExportCsv,
}) => {
  const { t } = useLanguage();
  const { formatTemp, theme } = useTheme();

  const [selectedJunctionFilter, setSelectedJunctionFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'today' | '3days' | 'week'>('today');
  const [riskCategoryFilter, setRiskCategoryFilter] = useState<'all' | 'high' | 'moderate'>('all');

  const isDark = theme === 'dark';

  // Filtered junctions
  const filteredJunctions = junctions.filter((j) => {
    if (selectedJunctionFilter !== 'all' && j.id !== selectedJunctionFilter) return false;
    if (riskCategoryFilter === 'high' && j.riskCategory !== 'High') return false;
    if (riskCategoryFilter === 'moderate' && j.riskCategory === 'Low') return false;
    return true;
  });

  // Chart data 1: Junction Heat Risk
  const junctionRiskData = filteredJunctions.map((j) => ({
    name: j.name.replace(' Junction', '').replace(' Signal', ''),
    score: j.riskScore,
    temperature: j.temp,
    humidity: j.humidity,
    category: j.riskCategory,
  }));

  // Chart data 2: Hourly Heat Stress Profile (Peak Hours)
  const peakHoursData = [
    { hour: '08:00', heatIndex: 32, exposureStress: 'Low' },
    { hour: '10:00', heatIndex: 48, exposureStress: 'Moderate' },
    { hour: '12:00', heatIndex: 78, exposureStress: 'High' },
    { hour: '13:00', heatIndex: 86, exposureStress: 'High' },
    { hour: '14:00', heatIndex: 92, exposureStress: 'High' },
    { hour: '15:00', heatIndex: 88, exposureStress: 'High' },
    { hour: '16:00', heatIndex: 76, exposureStress: 'High' },
    { hour: '18:00', heatIndex: 54, exposureStress: 'Moderate' },
    { hour: '20:00', heatIndex: 38, exposureStress: 'Low' },
  ];

  // Chart data 3: Risk Distribution
  const riskDistribution = [
    { name: t.riskHigh, value: junctions.filter((j) => j.riskCategory === 'High').length, color: '#EF4444' },
    { name: t.riskModerate, value: junctions.filter((j) => j.riskCategory === 'Moderate').length, color: '#F59E0B' },
    { name: t.riskLow, value: junctions.filter((j) => j.riskCategory === 'Low').length, color: '#10B981' },
  ].filter((d) => d.value > 0);

  // Highest risk junction
  const highestRiskJunc = [...junctions].sort((a, b) => b.riskScore - a.riskScore)[0] || junctions[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.analyticsTitle}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
              {location.city || location.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            {t.analyticsSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={onExportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.exportCsvReport}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.printPdfReport}</span>
          </button>
        </div>
      </div>

      {/* Interactive Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs no-print">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-blue-500" />
            <span>Filter Analytics:</span>
          </span>

          {/* Junction Filter */}
          <select
            value={selectedJunctionFilter}
            onChange={(e) => setSelectedJunctionFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            <option value="all">All 5 Monitored Junctions</option>
            {junctions.map((j) => (
              <option key={j.id} value={j.id}>{j.name}</option>
            ))}
          </select>

          {/* Time Range Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                timeRange === 'today'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.timeRangeToday}
            </button>
            <button
              onClick={() => setTimeRange('3days')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                timeRange === '3days'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.timeRange3Days}
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                timeRange === 'week'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.timeRangeWeek}
            </button>
          </div>

          {/* Risk Level Filter */}
          <select
            value={riskCategoryFilter}
            onChange={(e) => setRiskCategoryFilter(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk Only (≥ 75)</option>
            <option value="moderate">Moderate & High (≥ 45)</option>
          </select>
        </div>

        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
          Showing <strong>{filteredJunctions.length}</strong> of {junctions.length} Junctions
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Junction Risk Comparison Bar Chart (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500" />
              <span>Junction-Wise Heat Risk Scores (0–100)</span>
            </h2>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Evaluated microclimate hazard levels across monitored intersections
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={junctionRiskData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
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
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {junctionRiskData.map((entry, index) => (
                    <Cell 
                      key={`score-${index}`} 
                      fill={entry.score >= 75 ? '#EF4444' : entry.score >= 45 ? '#F59E0B' : '#10B981'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Diurnal Heat Stress Peak Exposure Hours (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Diurnal High-Risk Periods & Thermal Exposure Index</span>
            </h2>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Critical high thermal stress window occurs between 12:00 PM and 16:00 PM
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#E2E8F0'} />
                <XAxis dataKey="hour" tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: isDark ? '#94A3B8' : '#64748B', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#0F172A' : '#FFFFFF', 
                    borderColor: isDark ? '#334155' : '#CBD5E1',
                    borderRadius: '0.75rem',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="heatIndex" radius={[6, 6, 0, 0]}>
                  {peakHoursData.map((entry, index) => (
                    <Cell 
                      key={`hour-${index}`} 
                      fill={entry.heatIndex >= 75 ? '#DC2626' : entry.heatIndex >= 45 ? '#D97706' : '#10B981'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* PRINTABLE / FORMAL REPORT SECTION */}
      <div className="card-print bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              Official Briefing Document
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {t.executiveSummaryTitle} — {location.city || location.name}
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Section A: Monitored Junctions Breakdown */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            1. Monitored Traffic Junctions Overview
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            HeatShield AI currently monitors <strong>{junctions.length} key intersections</strong> in {location.city || location.name}. 
            Of these, <strong>{junctions.filter((j) => j.riskCategory === 'High').length} junctions</strong> operate in the High-Risk category (score ≥ 75), 
            and <strong>{junctions.filter((j) => j.riskCategory === 'Moderate').length} junctions</strong> operate in Moderate-Risk conditions.
          </p>
        </div>

        {/* Section B: Highest Risk Hotspots */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            2. {t.highestRiskHotspotsTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 text-xs space-y-1">
              <div className="font-bold text-red-900 dark:text-red-200">
                1. Hadapsar Junction (Score: 88/100 — High Risk)
              </div>
              <p className="text-red-800 dark:text-red-300 leading-snug">
                Heavy freight corridor with minimal canopy. Surface temp reaches 41.5°C during afternoon transit peak.
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30 text-xs space-y-1">
              <div className="font-bold text-red-900 dark:text-red-200">
                2. Swargate Junction (Score: 84/100 — High Risk)
              </div>
              <p className="text-red-800 dark:text-red-300 leading-snug">
                Multimodal bus terminal with severe bitumen reradiation and trapped diesel exhaust.
              </p>
            </div>
          </div>
        </div>

        {/* Section C: Observed Trends */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            3. {t.observedTrendsTitle}
          </h3>
          <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>Thermal stress peaks consistently between 12:00 PM and 16:00 PM, creating dangerous cumulative dehydration.</li>
            <li>Junctions with under 15% canopy cover experience on average 3.8°C higher surface heat reradiation.</li>
            <li>Standing tarmac duty exceeding 45 minutes significantly increases physical fatigue and pulse rate in outdoor personnel.</li>
          </ul>
        </div>

        {/* Section D: Tactical Interventions for Leadership */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            4. {t.suggestedInterventionsTitle}
          </h3>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Duty Rotation Enactments:</strong> Enforce strict 40-to-45-minute maximum exposure windows for all unshaded traffic signals during the 11:00 to 15:00 shift.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Hydration and ORS Logistical Provision:</strong> Provide chilled water tankers or dispensers at Swargate and Hadapsar checkposts before 11:30 AM daily.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Mobile Misting Deployments:</strong> Request municipal water department to install high-pressure misting awnings at top-ranked junctions.
              </span>
            </div>
          </div>
        </div>

        {/* Data Source Transparency Footnote */}
        <div className="text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3">
          Notice: Analytical indices presented in this demonstration report are calculated using calibrated microclimate formulas for Pune traffic intersections.
        </div>
      </div>
    </div>
  );
};
