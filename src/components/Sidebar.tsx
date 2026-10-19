import React from 'react';
import {
  LayoutDashboard,
  Map,
  Activity,
  Calculator,
  CalendarClock,
  Droplets,
  BotMessageSquare,
  BarChart3,
  Settings as SettingsIcon,
  ChevronRight,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { NavTab } from '../types';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  highRiskCount: number;
  pendingDutyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  highRiskCount,
  pendingDutyCount,
}) => {
  const { t } = useLanguage();

  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: t.tabDashboard,
      icon: LayoutDashboard,
      badge: null,
      color: 'text-amber-500',
    },
    {
      id: 'map' as NavTab,
      label: t.tabMap,
      icon: Map,
      badge: highRiskCount > 0 ? `${highRiskCount}` : null,
      badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30',
      color: 'text-sky-400',
    },
    {
      id: 'monitoring' as NavTab,
      label: t.tabMonitoring,
      icon: Activity,
      badge: '5 Signals',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      color: 'text-emerald-400',
    },
    {
      id: 'prediction' as NavTab,
      label: t.tabPrediction,
      icon: Calculator,
      badge: 'Interactive',
      badgeColor: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
      color: 'text-orange-400',
    },
    {
      id: 'duty-planner' as NavTab,
      label: t.tabDutyPlanner,
      icon: CalendarClock,
      badge: pendingDutyCount > 0 ? `${pendingDutyCount}` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      color: 'text-amber-400',
    },
    {
      id: 'cooling-facilities' as NavTab,
      label: t.tabCooling,
      icon: Droplets,
      badge: null,
      color: 'text-cyan-400',
    },
    {
      id: 'ai-assistant' as NavTab,
      label: t.tabAiAssistant,
      icon: BotMessageSquare,
      badge: 'Nugen API',
      badgeColor: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
      color: 'text-violet-400',
    },
    {
      id: 'analytics' as NavTab,
      label: t.tabAnalytics,
      icon: BarChart3,
      badge: 'Reports',
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
      color: 'text-blue-400',
    },
    {
      id: 'settings' as NavTab,
      label: t.tabSettingsAbout || 'Settings & About',
      icon: SettingsIcon,
      badge: null,
      color: 'text-slate-400',
    },
  ];

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Sidebar (Desktop fixed + Mobile slide-over) */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 text-slate-200 transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation Item Links */}
        <div className="py-4 px-3 space-y-1.5 overflow-y-auto custom-scrollbar flex-1">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Navigation Modules</span>
            <span className="text-[10px] text-amber-400 font-mono">9 Tabs</span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 group ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-slate-950' : item.color
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-slate-900 text-amber-300 font-extrabold'
                          : item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-slate-950" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Traffic Police Public Safety Operational Badge in Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                Live Heat Advisory
              </span>
              <span className="text-[10px] font-mono text-slate-400">Pune Signal Grid</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Protocol: Mandatory 15-min shaded recovery for junctions exceeding 75 risk score.
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-slate-700/50 text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                System Active
              </span>
              <span>v2.4 Production</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
