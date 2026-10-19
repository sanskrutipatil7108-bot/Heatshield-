import React, { useState } from 'react';
import {
  Activity,
  Flame,
  Thermometer,
  Droplets,
  Car,
  Umbrella,
  Users,
  Clock,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Edit3,
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  CheckCircle2,
  X,
  MapPin,
  BotMessageSquare,
  CalendarClock,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { Junction, NavTab, RiskCategory, TrafficIntensity } from '../types';
import { calculateHeatRiskScore, getRecommendedAction, getRiskColorClasses } from '../utils/heatRisk';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface JunctionMonitoringViewProps {
  junctions: Junction[];
  onUpdateJunction: (updated: Junction) => void;
  onSelectJunction: (junction: Junction) => void;
  onNavigateTab: (tab: NavTab) => void;
  onResetJunctions?: () => void;
}

export const JunctionMonitoringView: React.FC<JunctionMonitoringViewProps> = ({
  junctions,
  onUpdateJunction,
  onSelectJunction,
  onNavigateTab,
  onResetJunctions,
}) => {
  const { t } = useLanguage();
  const { formatTemp } = useTheme();

  // Search, Filter, Sort
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'High' | 'Moderate' | 'Low'>('all');
  const [sortBy, setSortBy] = useState<'score-desc' | 'score-asc' | 'temp-desc' | 'officers-desc'>('score-desc');

  // Edit Modal State
  const [editingJunction, setEditingJunction] = useState<Junction | null>(null);
  const [editTemp, setEditTemp] = useState<number>(38);
  const [editHumidity, setEditHumidity] = useState<number>(50);
  const [editTraffic, setEditTraffic] = useState<TrafficIntensity>('Heavy');
  const [editShade, setEditShade] = useState<number>(15);
  const [editWater, setEditWater] = useState<boolean>(true);
  const [editMisting, setEditMisting] = useState<boolean>(false);
  const [editShelter, setEditShelter] = useState<boolean>(true);
  const [editOfficers, setEditOfficers] = useState<number>(10);
  const [editSuccessMsg, setEditSuccessMsg] = useState<string | null>(null);

  // Comparison State
  const [comparingIds, setComparingIds] = useState<string[]>([]);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);

  // Filter & Sort Junctions
  const filteredJunctions = junctions
    .filter((j) => {
      const matchesSearch =
        j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.id.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (riskFilter !== 'all' && j.riskCategory !== riskFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'score-desc') return b.riskScore - a.riskScore;
      if (sortBy === 'score-asc') return a.riskScore - b.riskScore;
      if (sortBy === 'temp-desc') return b.temp - a.temp;
      if (sortBy === 'officers-desc') return b.vulnerableStaffCount - a.vulnerableStaffCount;
      return 0;
    });

  // Open Edit Modal
  const handleOpenEdit = (j: Junction) => {
    setEditingJunction(j);
    setEditTemp(j.temp);
    setEditHumidity(j.humidity);
    setEditTraffic(j.traffic);
    setEditShade(j.shadePercent);
    setEditWater(j.drinkingWaterNearby);
    setEditMisting(j.hasMistingFan ?? false);
    setEditShelter(j.hasShadeShelter ?? false);
    setEditOfficers(j.vulnerableStaffCount);
    setEditSuccessMsg(null);
  };

  // Save Edited Simulated Readings
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJunction) return;

    // Recalculate using transparent formula
    const { score, category } = calculateHeatRiskScore(editTemp, editHumidity, editTraffic, editShade);
    const action = getRecommendedAction(category, editTemp);
    const restMin = category === 'High' ? 45 : category === 'Moderate' ? 60 : 90;

    const updated: Junction = {
      ...editingJunction,
      temp: Math.round(editTemp * 10) / 10,
      humidity: Math.round(editHumidity),
      traffic: editTraffic,
      shadePercent: editShade,
      drinkingWaterNearby: editWater,
      hasMistingFan: editMisting,
      hasShadeShelter: editShelter,
      vulnerableStaffCount: editOfficers,
      riskScore: score,
      riskCategory: category,
      action,
      outdoorDutyDurationMin: restMin,
      lastUpdated: 'Just now (Supervisor update)',
    };

    onUpdateJunction(updated);

    // Call backend API PUT /api/junctions/:id
    try {
      await fetch(`/api/junctions/${editingJunction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temp: updated.temp,
          humidity: updated.humidity,
          traffic: updated.traffic,
          shadePercent: updated.shadePercent,
          drinkingWaterNearby: updated.drinkingWaterNearby,
          hasMistingFan: updated.hasMistingFan,
          hasShadeShelter: updated.hasShadeShelter,
          vulnerableStaffCount: updated.vulnerableStaffCount,
        }),
      });
    } catch (err) {
      console.warn('Backend update failed:', err);
    }

    setEditSuccessMsg(`Updated ${updated.name}: New Risk Score ${score}/100 (${category})`);
    setTimeout(() => {
      setEditingJunction(null);
      setEditSuccessMsg(null);
    }, 900);
  };

  const toggleCompare = (id: string) => {
    setComparingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Prominent DEMO DATA Notice Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                DEMO DATA
              </span>
              <span className="font-bold text-sm sm:text-base">
                Simulated Pune Traffic Telemetry Grid
              </span>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-0.5 leading-relaxed">
              All 5 junction records are explicitly calibrated demonstration datasets for Pune, Maharashtra. Authorized supervisors can edit readings to test heat index shifts.
            </p>
          </div>
        </div>

        {onResetJunctions && (
          <button
            onClick={onResetJunctions}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700 hover:bg-amber-50 text-xs font-bold transition shrink-0 shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        )}
      </div>

      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Activity className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.monitoringTitle}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
              5 Pune Signals
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            {t.monitoringSubtitle}
          </p>
        </div>

        {comparingIds.length >= 2 && (
          <button
            onClick={() => setComparisonModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition shadow-sm"
          >
            <Layers className="w-4 h-4" />
            <span>Compare {comparingIds.length} Junctions</span>
          </button>
        )}
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Pune junction or ID..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700">
            {(['all', 'High', 'Moderate', 'Low'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setRiskFilter(cat)}
                className={`px-3 py-1 rounded-lg transition ${
                  riskFilter === cat
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Risks' : `${cat} Risk`}
              </button>
            ))}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold focus:outline-hidden"
            >
              <option value="score-desc">Risk: High to Low</option>
              <option value="score-asc">Risk: Low to High</option>
              <option value="temp-desc">Temp: High to Low</option>
              <option value="officers-desc">Staff: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Junction Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJunctions.map((junction) => {
          const riskStyle = getRiskColorClasses(junction.riskCategory);
          const isComparing = comparingIds.includes(junction.id);

          return (
            <div
              key={junction.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden ${
                isComparing
                  ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold">
                        {junction.id}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {junction.lat.toFixed(4)}, {junction.lon.toFixed(4)}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {junction.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {junction.neighborhood}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black tracking-wide border shadow-xs ${riskStyle.badge}`}
                  >
                    {junction.riskScore}/100 {junction.riskCategory}
                  </span>
                </div>

                {/* Simulated Telemetry Banner */}
                <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {junction.dataSource || 'Simulated Pune Telemetry'}
                  </span>
                  <span>{junction.lastUpdated}</span>
                </div>
              </div>

              {/* Card Metrics Grid */}
              <div className="p-5 grid grid-cols-2 gap-3 text-xs bg-slate-50/50 dark:bg-slate-950/30">
                {/* Temp */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Temperature</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {formatTemp(junction.temp)}
                    </span>
                  </div>
                </div>

                {/* Humidity */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Humidity</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {junction.humidity}%
                    </span>
                  </div>
                </div>

                {/* Traffic */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Traffic Load</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {junction.traffic}
                    </span>
                  </div>
                </div>

                {/* Outdoor Duty Max */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Max Continuous</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {junction.outdoorDutyDurationMin || (junction.riskCategory === 'High' ? 45 : 60)} min
                    </span>
                  </div>
                </div>
              </div>

              {/* Facilities Status Badges */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Facilities & Mitigation</span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">{junction.vulnerableStaffCount} Assigned Officers</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {/* Shade */}
                  <span className="text-[11px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1 border border-slate-200 dark:border-slate-700">
                    <Umbrella className="w-3 h-3 text-sky-500" />
                    <span>Shade: {junction.shadePercent}%</span>
                  </span>

                  {/* Water */}
                  <span
                    className={`text-[11px] px-2 py-1 rounded-lg font-medium flex items-center gap-1 border ${
                      junction.drinkingWaterNearby
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                    }`}
                  >
                    <Droplets className="w-3 h-3" />
                    <span>{junction.drinkingWaterNearby ? 'Water Dispenser' : 'No Water'}</span>
                  </span>

                  {/* Shelter */}
                  <span
                    className={`text-[11px] px-2 py-1 rounded-lg font-medium flex items-center gap-1 border ${
                      junction.hasShadeShelter
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>{junction.hasShadeShelter ? 'Rest Shelter' : 'No Shelter'}</span>
                  </span>

                  {/* Misting Fan */}
                  {junction.hasMistingFan && (
                    <span className="text-[11px] px-2 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 font-medium">
                      Misting Fan
                    </span>
                  )}
                </div>

                {/* Recommended Action */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">SOP Precaution:</span>
                  <p className="text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {junction.action}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenEdit(junction)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Telemetry</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onSelectJunction(junction);
                      onNavigateTab('duty-planner');
                    }}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-emerald-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                    title="Plan Duty Roster for this junction"
                  >
                    <CalendarClock className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      onSelectJunction(junction);
                      onNavigateTab('map');
                    }}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-sky-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                    title="View on Map"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      onSelectJunction(junction);
                      onNavigateTab('ai-assistant');
                    }}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-violet-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                    title="Ask Nugen AI Assistant about this junction"
                  >
                    <BotMessageSquare className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleCompare(junction.id)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition border ${
                      isComparing
                        ? 'bg-sky-500 text-slate-950 border-sky-500'
                        : 'text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {isComparing ? 'Comparing' : 'Compare'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Simulated Environmental Readings Modal */}
      {editingJunction && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
                  <Edit3 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Edit Simulated Telemetry: {editingJunction.name}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Modify demonstration inputs to simulate microclimate shifts.
                  </span>
                </div>
              </div>

              <button
                onClick={() => setEditingJunction(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{editSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Temperature */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="15"
                    max="58"
                    value={editTemp}
                    onChange={(e) => setEditTemp(parseFloat(e.target.value) || 35)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold"
                  />
                </div>

                {/* Humidity */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Relative Humidity (%)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={editHumidity}
                    onChange={(e) => setEditHumidity(parseInt(e.target.value, 10) || 50)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Traffic */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Traffic Intensity
                  </label>
                  <select
                    value={editTraffic}
                    onChange={(e) => setEditTraffic(e.target.value as TrafficIntensity)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold"
                  >
                    <option value="Normal">Normal Traffic (+4 pts)</option>
                    <option value="Moderate">Moderate Traffic (+8 pts)</option>
                    <option value="Heavy">Heavy Traffic (+14 pts)</option>
                    <option value="Gridlock">Gridlock Exhaust (+18 pts)</option>
                  </select>
                </div>

                {/* Shade Percent */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Canopy Shade ({editShade}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={editShade}
                    onChange={(e) => setEditShade(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-amber-500 mt-2"
                  />
                </div>
              </div>

              {/* Facilities Checkboxes */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Cooling Infrastructure Availability
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={editWater}
                      onChange={(e) => setEditWater(e.target.checked)}
                      className="rounded-sm text-amber-500 focus:ring-amber-500"
                    />
                    <span>Drinking Water Nearby</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={editShelter}
                      onChange={(e) => setEditShelter(e.target.checked)}
                      className="rounded-sm text-amber-500 focus:ring-amber-500"
                    />
                    <span>Shaded Rest Shelter</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={editMisting}
                      onChange={(e) => setEditMisting(e.target.checked)}
                      className="rounded-sm text-amber-500 focus:ring-amber-500"
                    />
                    <span>Misting Cooler Fan</span>
                  </label>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                      Assigned Officers
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={editOfficers}
                      onChange={(e) => setEditOfficers(parseInt(e.target.value, 10) || 5)}
                      className="w-20 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Instant Recalculation Preview */}
              {(() => {
                const preview = calculateHeatRiskScore(editTemp, editHumidity, editTraffic, editShade);
                return (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-amber-900 dark:text-amber-200 block">
                        Estimated Score: {preview.score}/100
                      </span>
                      <span className="text-[11px] text-amber-800 dark:text-amber-300">
                        Risk Classification: <strong>{preview.category}</strong>
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-1 rounded-md bg-amber-500 text-slate-950 font-black">
                      AUTO-CALCULATED
                    </span>
                  </div>
                );
              })()}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingJunction(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-sm"
                >
                  Save & Update Grid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Side-by-Side Junction Comparison Modal */}
      {comparisonModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-sky-500 text-slate-950 font-bold">
                  <Layers className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Junction Thermal Microclimate Comparison
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Side-by-side assessment of heat risk indicators across selected Pune intersections.
                  </span>
                </div>
              </div>

              <button
                onClick={() => setComparisonModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comparingIds.map((id) => {
                const j = junctions.find((item) => item.id === id);
                if (!j) return null;
                const riskStyle = getRiskColorClasses(j.riskCategory);

                return (
                  <div
                    key={j.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {j.name}
                      </h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${riskStyle.badge}`}>
                        {j.riskScore} ({j.riskCategory})
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500 dark:text-slate-400">Temperature</span>
                        <strong className="text-slate-900 dark:text-white">{formatTemp(j.temp)}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500 dark:text-slate-400">Humidity</span>
                        <strong className="text-slate-900 dark:text-white">{j.humidity}%</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500 dark:text-slate-400">Traffic Load</span>
                        <strong className="text-slate-900 dark:text-white">{j.traffic}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500 dark:text-slate-400">Canopy Shade</span>
                        <strong className="text-slate-900 dark:text-white">{j.shadePercent}%</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500 dark:text-slate-400">Drinking Water</span>
                        <strong className={j.drinkingWaterNearby ? 'text-emerald-500' : 'text-red-500'}>
                          {j.drinkingWaterNearby ? 'Available' : 'Missing'}
                        </strong>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500 dark:text-slate-400">Assigned Staff</span>
                        <strong className="text-slate-900 dark:text-white">{j.vulnerableStaffCount} Officers</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setComparisonModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
