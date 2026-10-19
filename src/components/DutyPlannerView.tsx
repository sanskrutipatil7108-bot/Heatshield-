import React, { useState, useEffect } from 'react';
import { 
  CalendarClock, 
  Clock, 
  Droplets, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Info, 
  Users, 
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Filter,
  Download,
  AlertTriangle,
  Calendar,
  Layers
} from 'lucide-react';
import { DutyPlan, OfficerAssignment, Junction, NavTab } from '../types';
import { INITIAL_OFFICER_ASSIGNMENTS } from '../data/mockData';
import { getRiskColorClasses } from '../utils/heatRisk';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface DutyPlannerViewProps {
  dutyPlans: DutyPlan[];
  onUpdateDutyPlan: (updated: DutyPlan) => void;
  locationName: string;
  junctions?: Junction[];
}

export const DutyPlannerView: React.FC<DutyPlannerViewProps> = ({
  dutyPlans,
  onUpdateDutyPlan,
  locationName,
  junctions = [],
}) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  // Officer assignments persisted in localStorage
  const [assignments, setAssignments] = useState<OfficerAssignment[]>(() => {
    const saved = localStorage.getItem('heatshield_duty_assignments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved assignments:', e);
      }
    }
    return INITIAL_OFFICER_ASSIGNMENTS;
  });

  useEffect(() => {
    localStorage.setItem('heatshield_duty_assignments', JSON.stringify(assignments));
  }, [assignments]);

  // Filters & Views
  const [filterShift, setFilterShift] = useState<string>('all');
  const [filterJunction, setFilterJunction] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'timeline' | 'junctions'>('cards');

  // Modal State for Add / Edit Assignment
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formOfficerName, setFormOfficerName] = useState('');
  const [formBadgeNumber, setFormBadgeNumber] = useState('');
  const [formJunctionName, setFormJunctionName] = useState('Swargate Junction');
  const [formShiftName, setFormShiftName] = useState('Peak Heat Midday Shift (11:00 – 15:00)');
  const [formSensitivity, setFormSensitivity] = useState<'Standard' | 'Heat-Sensitive'>('Standard');
  const [formDurationHours, setFormDurationHours] = useState(4);
  const [formRotationMin, setFormRotationMin] = useState(45);
  const [formBreakMin, setFormBreakMin] = useState(15);
  const [formHydrationMl, setFormHydrationMl] = useState(650);

  // Auto-generate deterministic heat-safe rotation plan
  const handleAutoPlan = () => {
    const optimizedAssignments: OfficerAssignment[] = [
      {
        id: `asg-opt-1-${Date.now()}`,
        officerName: 'ASI Ramesh Kulkarni',
        badgeNumber: 'TP-4102',
        junctionId: 'pune-swargate',
        junctionName: 'Swargate Junction (High Risk)',
        shiftName: 'Peak Heat Midday Shift',
        shiftHours: '11:00 – 15:00',
        riskCategory: 'High',
        healthSensitivity: 'Standard',
        durationHours: 4,
        rotationIntervalMin: 40,
        breakDurationMin: 15,
        hydrationTargetMl: 700,
        status: 'Active',
        assignedDate: new Date().toISOString().split('T')[0],
        notes: 'Optimized rotation: 40 min tarmac duty / 15 min shaded misting rest.',
      },
      {
        id: `asg-opt-2-${Date.now()}`,
        officerName: 'HC Sachin Shinde',
        badgeNumber: 'TP-4188',
        junctionId: 'pune-jm-road',
        junctionName: 'JM Road Junction (Low Risk)',
        shiftName: 'Peak Heat Midday Shift',
        shiftHours: '11:00 – 15:00',
        riskCategory: 'Low',
        healthSensitivity: 'Heat-Sensitive',
        durationHours: 4,
        rotationIntervalMin: 60,
        breakDurationMin: 15,
        hydrationTargetMl: 450,
        status: 'Active',
        assignedDate: new Date().toISOString().split('T')[0],
        notes: 'Reassigned to tree-shaded JM Road post to accommodate heat sensitivity.',
      },
      {
        id: `asg-opt-3-${Date.now()}`,
        officerName: 'PC Anita More',
        badgeNumber: 'TP-4251',
        junctionId: 'pune-hadapsar',
        junctionName: 'Hadapsar Junction (High Risk)',
        shiftName: 'Peak Heat Midday Shift',
        shiftHours: '11:00 – 15:00',
        riskCategory: 'High',
        healthSensitivity: 'Standard',
        durationHours: 4,
        rotationIntervalMin: 35,
        breakDurationMin: 20,
        hydrationTargetMl: 750,
        status: 'Active',
        assignedDate: new Date().toISOString().split('T')[0],
        notes: 'Heavy freight heat corridor: mandatory 35-min rotation with relief marshal.',
      },
      {
        id: `asg-opt-4-${Date.now()}`,
        officerName: 'PC Nilesh Gaikwad',
        badgeNumber: 'TP-4310',
        junctionId: 'pune-shivajinagar',
        junctionName: 'Shivajinagar Junction',
        shiftName: 'Morning Shift',
        shiftHours: '07:00 – 11:00',
        riskCategory: 'Moderate',
        healthSensitivity: 'Standard',
        durationHours: 4,
        rotationIntervalMin: 60,
        breakDurationMin: 15,
        hydrationTargetMl: 450,
        status: 'Completed',
        assignedDate: new Date().toISOString().split('T')[0],
        notes: 'Completed morning duty cycle without thermal stress complaints.',
      },
      {
        id: `asg-opt-5-${Date.now()}`,
        officerName: 'HC Vijay Patil',
        badgeNumber: 'TP-4195',
        junctionId: 'pune-deccan',
        junctionName: 'Deccan Gymkhana Junction',
        shiftName: 'Late Afternoon Shift',
        shiftHours: '15:00 – 19:00',
        riskCategory: 'Moderate',
        healthSensitivity: 'Standard',
        durationHours: 4,
        rotationIntervalMin: 60,
        breakDurationMin: 15,
        hydrationTargetMl: 400,
        status: 'Scheduled',
        assignedDate: new Date().toISOString().split('T')[0],
        notes: 'Scheduled for evening peak traffic control; tree canopy available.',
      },
    ];

    setAssignments(optimizedAssignments);
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormOfficerName('');
    setFormBadgeNumber('');
    setFormJunctionName('Swargate Junction');
    setFormShiftName('Peak Heat Midday Shift (11:00 – 15:00)');
    setFormSensitivity('Standard');
    setFormDurationHours(4);
    setFormRotationMin(45);
    setFormBreakMin(15);
    setFormHydrationMl(650);
    setModalOpen(true);
  };

  const handleOpenEditModal = (asg: OfficerAssignment) => {
    setEditingId(asg.id);
    setFormOfficerName(asg.officerName);
    setFormBadgeNumber(asg.badgeNumber);
    setFormJunctionName(asg.junctionName);
    setFormShiftName(asg.shiftName);
    setFormSensitivity(asg.healthSensitivity);
    setFormDurationHours(asg.durationHours);
    setFormRotationMin(asg.rotationIntervalMin);
    setFormBreakMin(asg.breakDurationMin);
    setFormHydrationMl(asg.hydrationTargetMl);
    setModalOpen(true);
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formOfficerName.trim()) return;

    const isHighRisk = formJunctionName.includes('Swargate') || formJunctionName.includes('Hadapsar');
    const isLowRisk = formJunctionName.includes('JM Road');
    const riskCat: 'High' | 'Moderate' | 'Low' = isHighRisk ? 'High' : isLowRisk ? 'Low' : 'Moderate';

    // Conflict & Limit Checks
    const flags: string[] = [];
    if (riskCat === 'High' && formRotationMin > 45) {
      flags.push(`Exceeds maximum continuous limit for High risk (${formRotationMin}m > 45m max).`);
    }
    if (riskCat === 'High' && formBreakMin < 15) {
      flags.push(`Insufficient rest duration for High risk (${formBreakMin}m < 15m min).`);
    }
    if (formSensitivity === 'Heat-Sensitive' && riskCat === 'High') {
      flags.push('Warning: Heat-sensitive officer assigned to High risk post.');
    }

    if (editingId) {
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? {
                ...a,
                officerName: formOfficerName.trim(),
                badgeNumber: formBadgeNumber.trim() || 'TP-4000',
                junctionName: formJunctionName,
                shiftName: formShiftName,
                healthSensitivity: formSensitivity,
                durationHours: formDurationHours,
                rotationIntervalMin: formRotationMin,
                breakDurationMin: formBreakMin,
                hydrationTargetMl: formHydrationMl,
                riskCategory: riskCat,
                flags,
              }
            : a
        )
      );
    } else {
      const newAsg: OfficerAssignment = {
        id: `asg-${Date.now()}`,
        officerName: formOfficerName.trim(),
        badgeNumber: formBadgeNumber.trim() || `TP-${Math.floor(1000 + Math.random() * 9000)}`,
        junctionId: 'pune-custom',
        junctionName: formJunctionName,
        shiftName: formShiftName,
        shiftHours: formShiftName.includes('Morning') ? '07:00 – 11:00' : formShiftName.includes('Midday') ? '11:00 – 15:00' : '15:00 – 19:00',
        riskCategory: riskCat,
        healthSensitivity: formSensitivity,
        durationHours: formDurationHours,
        rotationIntervalMin: formRotationMin,
        breakDurationMin: formBreakMin,
        hydrationTargetMl: formHydrationMl,
        status: 'Active',
        assignedDate: new Date().toISOString().split('T')[0],
        flags,
      };
      setAssignments((prev) => [newAsg, ...prev]);
    }

    setModalOpen(false);
  };

  // Export Schedule as CSV
  const handleExportScheduleCsv = () => {
    const headers = [
      'Officer Name',
      'Badge Number',
      'Junction Assignment',
      'Shift Name',
      'Shift Hours',
      'Risk Category',
      'Health Sensitivity',
      'Continuous Duty (min)',
      'Rest Duration (min)',
      'Hydration Target (ml/hr)',
      'Status',
      'Conflict Warnings',
    ];

    const rows = assignments.map((a) => [
      `"${a.officerName.replace(/"/g, '""')}"`,
      `"${a.badgeNumber}"`,
      `"${a.junctionName.replace(/"/g, '""')}"`,
      `"${a.shiftName}"`,
      `"${a.shiftHours}"`,
      `"${a.riskCategory}"`,
      `"${a.healthSensitivity}"`,
      a.rotationIntervalMin,
      a.breakDurationMin,
      a.hydrationTargetMl,
      `"${a.status}"`,
      `"${(a.flags || []).join('; ')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pune_traffic_duty_roster_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filtered assignments
  const filteredAssignments = assignments.filter((a) => {
    if (filterShift !== 'all' && !a.shiftName.toLowerCase().includes(filterShift.toLowerCase())) return false;
    if (filterJunction !== 'all' && !a.junctionName.toLowerCase().includes(filterJunction.toLowerCase())) return false;
    return true;
  });

  // Check if high risk junctions are unstaffable under strict constraints
  const highRiskAssignments = assignments.filter((a) => a.riskCategory === 'High');
  const hasConflictFlags = assignments.some((a) => a.flags && a.flags.length > 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CalendarClock className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.dutyPlannerTitle}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
              Pune Traffic Division
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            {t.dutyPlannerSubtitle} Deterministic, heat-aware officer rotation planning and rest scheduling.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportScheduleCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition border border-slate-300 dark:border-slate-700 shadow-xs"
            title="Download Roster as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleAutoPlan}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Optimize Roster</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Officer</span>
          </button>
        </div>
      </div>

      {/* Safety Compliance & Escalation Warning */}
      {hasConflictFlags && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Operational Constraints Alert: Conflicting or Overloaded Assignments Detected</span>
          </div>
          <p className="text-[11px] text-amber-800 dark:text-amber-300">
            One or more assignments exceed maximum continuous outdoor standing limits (&gt;45 min on High Risk tarmac) or have insufficient shaded recovery. Please adjust rotation intervals or request additional relief marshals.
          </p>
        </div>
      )}

      {/* Medical Safety Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Operational Policy Note:</strong> Deterministic schedules follow recommended occupational heat stress guidelines. Generated rosters must be reviewed by the supervisory officer in charge against department policies. Roster planning does not replace clinical medical evaluation for heat exhaustion symptoms.
        </p>
      </div>

      {/* Filters & View Switcher */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Shift Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterShift}
              onChange={(e) => setFilterShift(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-hidden"
            >
              <option value="all">All Shifts</option>
              <option value="Midday">Midday Peak Heat (11:00-15:00)</option>
              <option value="Morning">Morning Shift (07:00-11:00)</option>
              <option value="Late">Late Afternoon (15:00-19:00)</option>
            </select>
          </div>

          {/* Junction Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <select
              value={filterJunction}
              onChange={(e) => setFilterJunction(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold focus:outline-hidden"
            >
              <option value="all">All Pune Junctions</option>
              <option value="Swargate">Swargate</option>
              <option value="Hadapsar">Hadapsar</option>
              <option value="Shivajinagar">Shivajinagar</option>
              <option value="Deccan">Deccan Gymkhana</option>
              <option value="JM Road">JM Road</option>
            </select>
          </div>
        </div>

        {/* View Switcher: Cards vs Timeline */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1 rounded-lg transition ${
              viewMode === 'cards'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            Officer Cards
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1 rounded-lg transition ${
              viewMode === 'timeline'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            Shift Timeline
          </button>
        </div>
      </div>

      {/* VIEW 1: OFFICER ASSIGNMENT CARDS */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssignments.map((asg) => {
            const riskStyle = getRiskColorClasses(asg.riskCategory);
            const hasFlags = asg.flags && asg.flags.length > 0;

            return (
              <div
                key={asg.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden ${
                  hasFlags
                    ? 'border-amber-400 dark:border-amber-700'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                          {asg.badgeNumber}
                        </span>
                        {asg.healthSensitivity === 'Heat-Sensitive' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                            Heat-Sensitive
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {asg.officerName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {asg.junctionName}
                      </p>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${riskStyle.badge}`}>
                      {asg.riskCategory}
                    </span>
                  </div>
                </div>

                {/* Duty Details */}
                <div className="p-5 space-y-3 text-xs bg-slate-50/50 dark:bg-slate-950/30">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Shift Timing</span>
                      <strong className="text-slate-900 dark:text-white">{asg.shiftHours}</strong>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Rotation Cycle</span>
                      <strong className="text-slate-900 dark:text-white">
                        {asg.rotationIntervalMin}m post / {asg.breakDurationMin}m rest
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400">Target Hydration:</span>
                    <strong className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5" />
                      {asg.hydrationTargetMl} ml / hour
                    </strong>
                  </div>

                  {/* Warning Flags */}
                  {hasFlags && (
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[11px] space-y-1">
                      {asg.flags!.map((flag, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                          <span>{flag}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {asg.notes && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                      "{asg.notes}"
                    </p>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Status: <strong className="text-slate-700 dark:text-slate-300">{asg.status}</strong>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(asg)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Edit Assignment"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAssignment(asg.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Remove Assignment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: TIMELINE VIEW */}
      {viewMode === 'timeline' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              Officer Duty & Shaded Rest Timeline (07:00 – 19:00)
            </h3>
            <span className="text-xs text-slate-400 font-mono">15-min Intervals</span>
          </div>

          <div className="space-y-3 overflow-x-auto">
            {filteredAssignments.map((asg) => (
              <div
                key={asg.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2 min-w-[500px]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {asg.officerName} ({asg.badgeNumber}) — {asg.junctionName}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {asg.shiftHours}
                  </span>
                </div>

                {/* Timeline Bar Mockup */}
                <div className="h-6 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center text-[10px] font-bold text-white text-center">
                  <div
                    style={{ width: '45%' }}
                    className="bg-amber-500 h-full flex items-center justify-center truncate px-1 text-slate-950 font-black"
                  >
                    Active Post ({asg.rotationIntervalMin}m)
                  </div>
                  <div
                    style={{ width: '20%' }}
                    className="bg-sky-500 h-full flex items-center justify-center truncate px-1"
                  >
                    Shade/ORS ({asg.breakDurationMin}m)
                  </div>
                  <div
                    style={{ width: '35%' }}
                    className="bg-amber-600 h-full flex items-center justify-center truncate px-1"
                  >
                    Relief Standby
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Assignment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingId ? 'Edit Officer Roster Assignment' : 'Add New Officer Roster Assignment'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Officer Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formOfficerName}
                    onChange={(e) => setFormOfficerName(e.target.value)}
                    placeholder="e.g. PC Rahul Jadhav"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Badge / Demo ID
                  </label>
                  <input
                    type="text"
                    value={formBadgeNumber}
                    onChange={(e) => setFormBadgeNumber(e.target.value)}
                    placeholder="e.g. TP-4320"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Junction Assignment
                </label>
                <select
                  value={formJunctionName}
                  onChange={(e) => setFormJunctionName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold"
                >
                  <option value="Swargate Junction (High Risk)">Swargate Junction (High Risk)</option>
                  <option value="Hadapsar Junction (High Risk)">Hadapsar Junction (High Risk)</option>
                  <option value="Shivajinagar Junction (Moderate Risk)">Shivajinagar Junction (Moderate Risk)</option>
                  <option value="Deccan Gymkhana Junction (Moderate Risk)">Deccan Gymkhana Junction (Moderate Risk)</option>
                  <option value="JM Road Junction (Low Risk)">JM Road Junction (Low Risk)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Continuous Standing Limit (min)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="120"
                    value={formRotationMin}
                    onChange={(e) => setFormRotationMin(parseInt(e.target.value, 10) || 45)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Mandatory Shaded Rest (min)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="60"
                    value={formBreakMin}
                    onChange={(e) => setFormBreakMin(parseInt(e.target.value, 10) || 15)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Health Sensitivity Status
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="sensitivity"
                      checked={formSensitivity === 'Standard'}
                      onChange={() => setFormSensitivity('Standard')}
                      className="text-amber-500"
                    />
                    <span>Standard Duty Profile</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="sensitivity"
                      checked={formSensitivity === 'Heat-Sensitive'}
                      onChange={() => setFormSensitivity('Heat-Sensitive')}
                      className="text-amber-500"
                    />
                    <span>Heat-Sensitive / High Exposure Risk</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-sm"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
