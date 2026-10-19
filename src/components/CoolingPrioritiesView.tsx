import React, { useState } from 'react';
import { 
  Droplets, 
  Wind, 
  HeartPulse, 
  Building2, 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Edit3, 
  Plus, 
  Umbrella, 
  MapPin,
  Flame,
  Check
} from 'lucide-react';
import { CoolingPriority, Junction } from '../types';
import { INITIAL_COOLING_PRIORITIES } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface CoolingPrioritiesViewProps {
  priorities?: CoolingPriority[];
  junctions: Junction[];
  locationName: string;
}

export const CoolingPrioritiesView: React.FC<CoolingPrioritiesViewProps> = ({
  priorities: initialPriorities = INITIAL_COOLING_PRIORITIES,
  junctions,
  locationName,
}) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const [prioritiesList, setPrioritiesList] = useState<CoolingPriority[]>(() => {
    const saved = localStorage.getItem('heatshield_cooling_priorities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved cooling priorities:', e);
      }
    }
    return initialPriorities;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'Immediate' | 'High' | 'Scheduled'>('all');
  const [selectedItem, setSelectedItem] = useState<CoolingPriority>(prioritiesList[0] || initialPriorities[0]);

  // Modal for updating status
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<'Needed' | 'In Progress' | 'Installed'>('Needed');
  const [modalNotes, setModalNotes] = useState('');

  const handleOpenStatusModal = (item: CoolingPriority) => {
    setSelectedItem(item);
    setModalStatus(item.status);
    setModalNotes(item.proposedAction);
    setModalOpen(true);
  };

  const handleSaveStatus = () => {
    const updated = prioritiesList.map((p) =>
      p.id === selectedItem.id
        ? {
            ...p,
            status: modalStatus,
            proposedAction: modalNotes || p.proposedAction,
            lastUpdated: 'Just now (Supervisor update)',
          }
        : p
    );
    setPrioritiesList(updated);
    localStorage.setItem('heatshield_cooling_priorities', JSON.stringify(updated));
    setSelectedItem((prev) => ({
      ...prev,
      status: modalStatus,
      proposedAction: modalNotes || prev.proposedAction,
      lastUpdated: 'Just now (Supervisor update)',
    }));
    setModalOpen(false);
  };

  const filtered = prioritiesList.filter((item) => {
    const matchesSearch = 
      item.junctionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.facilityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (urgencyFilter !== 'all' && item.urgency !== urgencyFilter) return false;
    return true;
  });

  const getUrgencyBadge = (urgency: CoolingPriority['urgency']) => {
    switch (urgency) {
      case 'Immediate':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-900';
      case 'High':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'Scheduled':
      default:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
    }
  };

  const getStatusBadge = (status: CoolingPriority['status']) => {
    switch (status) {
      case 'Installed':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-700';
      case 'Needed':
      default:
        return 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-300 dark:border-orange-700';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Droplets className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.coolingTitle}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
              {locationName} Municipal Grid
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            {t.coolingSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {prioritiesList.length} Monitored Facilities
          </span>
        </div>
      </div>

      {/* Official Municipal Policy Disclaimer */}
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 p-4 rounded-xl text-xs text-emerald-950 dark:text-emerald-200 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Municipal Infrastructure Planning Policy: </span>
          The facilities listed below represent municipal inspection priorities and urban cooling interventions. Authorized traffic supervisors can update operational statuses as temporary misting fans and water dispensers are deployed on site.
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by junction name, facility, or area..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        {/* Urgency Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setUrgencyFilter('all')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
              urgencyFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            All ({prioritiesList.length})
          </button>
          <button
            onClick={() => setUrgencyFilter('Immediate')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
              urgencyFilter === 'Immediate'
                ? 'bg-red-500 text-white'
                : 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400'
            }`}
          >
            Immediate (24–48h)
          </button>
          <button
            onClick={() => setUrgencyFilter('High')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
              urgencyFilter === 'High'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
            }`}
          >
            High Priority
          </button>
          <button
            onClick={() => setUrgencyFilter('Scheduled')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
              urgencyFilter === 'Scheduled'
                ? 'bg-emerald-500 text-white'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            Scheduled
          </button>
        </div>
      </div>

      {/* Main Grid: Priority Ranking Cards & Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ranked Facilities List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {filtered.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-4 rounded-2xl border transition cursor-pointer shadow-xs ${
                  isSelected
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-500 ring-2 ring-amber-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-black flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 text-sm">
                      #{item.rank}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {item.junctionName}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          {item.facilityType}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getUrgencyBadge(item.urgency)}`}>
                    {item.urgency}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-snug line-clamp-2">
                  {item.reason}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Risk Score: <strong className="text-red-500 font-mono">{item.riskScore}/100</strong>
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold text-[11px] flex items-center gap-1">
                    <span>Inspect & Update</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Facility Detail & Update Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedItem && (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs uppercase font-extrabold text-slate-500 dark:text-slate-400 tracking-wider">
                  Facility Upgrade Inspector
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(selectedItem.status)}`}>
                  {selectedItem.status}
                </span>
              </div>

              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {selectedItem.junctionName}
                </h2>
                <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                  Priority #{selectedItem.rank} &bull; {selectedItem.facilityType}
                </div>
              </div>

              {/* Justification & Microclimate Risk */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Municipal Justification:
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedItem.reason}
                </p>
              </div>

              {/* Proposed Action */}
              <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-1.5 text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-200 block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Recommended Action:
                </span>
                <p className="text-amber-950 dark:text-amber-100 leading-relaxed">
                  {selectedItem.proposedAction}
                </p>
              </div>

              {/* Meta indicators */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Target Timeline:</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white">
                    Within {selectedItem.targetCompletionDays} Days
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Last Reviewed:</span>
                  <span className="text-slate-700 dark:text-slate-300">{selectedItem.lastUpdated}</span>
                </div>
              </div>

              {/* Update Status Button */}
              <button
                onClick={() => handleOpenStatusModal(selectedItem)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
              >
                <Edit3 className="w-4 h-4" />
                <span>{t.updateStatus}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Update Status Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Update Facility Installation Status
            </h2>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              Location: <strong className="text-slate-900 dark:text-white">{selectedItem?.junctionName}</strong>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Installation Status:
                </label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Needed">Needed / Under Review</option>
                  <option value="In Progress">In Progress (Vendor Mobilized)</option>
                  <option value="Installed">Installed & Verified On Site</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Supervisor Notes / Proposed Action:
                </label>
                <textarea
                  rows={3}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveStatus}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Save Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
