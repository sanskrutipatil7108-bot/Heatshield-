import React, { useEffect, useRef, useState } from 'react';
import { 
  MapPin, 
  Flame, 
  Layers, 
  ShieldAlert, 
  Maximize2, 
  Navigation, 
  Info, 
  Sun, 
  Users, 
  Droplets,
  Search,
  List,
  Map as MapIcon,
  CalendarClock,
  Clock,
  AlertTriangle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Junction, LocationInfo, NavTab } from '../types';
import { getRiskColorClasses } from '../utils/heatRisk';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import L from 'leaflet';

interface HeatRiskMapProps {
  location: LocationInfo;
  junctions: Junction[];
  selectedJunction: Junction | null;
  onSelectJunction: (junction: Junction) => void;
  onNavigateTab?: (tab: NavTab) => void;
}

export const HeatRiskMap: React.FC<HeatRiskMapProps> = ({
  location,
  junctions,
  selectedJunction,
  onSelectJunction,
  onNavigateTab,
}) => {
  const { t } = useLanguage();
  const { formatTemp } = useTheme();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
  const [mapLoaded, setMapLoaded] = useState(false);
  const [tileError, setTileError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'moderate' | 'low'>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const activeJunction = selectedJunction || junctions[0];

  // Filter junctions based on search & risk filter
  const filteredJunctions = junctions.filter((j) => {
    const matchesSearch = 
      j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (riskFilter === 'high') return j.riskCategory === 'High';
    if (riskFilter === 'moderate') return j.riskCategory === 'Moderate';
    if (riskFilter === 'low') return j.riskCategory === 'Low';
    return true;
  });

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (viewMode !== 'map' || !mapContainerRef.current) return;

    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: [activeJunction?.lat || location.lat, activeJunction?.lon || location.lon],
        zoom: 13,
        zoomControl: true,
        attributionControl: false,
      });

      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      });

      tileLayer.on('tileerror', () => {
        setTileError(true);
      });

      tileLayer.addTo(map);
      leafletMapRef.current = map;
      setMapLoaded(true);

      markersRef.current = [];
      filteredJunctions.forEach((j) => {
        const pinColor = 
          j.riskCategory === 'High' ? '#EF4444' : 
          j.riskCategory === 'Moderate' ? '#F59E0B' : 
          '#10B981';

        const isSelected = activeJunction?.id === j.id;

        const customIcon = L.divIcon({
          className: 'custom-heat-pin',
          html: `
            <div style="
              background-color: ${pinColor};
              width: ${isSelected ? '36px' : '30px'};
              height: ${isSelected ? '36px' : '30px'};
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: 800;
              font-size: ${isSelected ? '12px' : '10px'};
              cursor: pointer;
              transition: all 0.2s;
              outline: ${isSelected ? '3px solid #F59E0B' : 'none'};
            ">
              ${j.riskScore}
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const marker = L.marker([j.lat, j.lon], { icon: customIcon }).addTo(map);
        
        marker.on('click', () => {
          onSelectJunction(j);
        });

        const popupContent = `
          <div style="font-family: inherit; font-size: 12px; padding: 6px; min-width: 200px;">
            <div style="font-size: 13px; font-weight: 800; color: #0F172A; margin-bottom: 2px;">${j.name}</div>
            <div style="font-size: 11px; color: #64748B; margin-bottom: 6px;">${j.neighborhood}</div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>Risk Score:</span>
              <strong style="color: ${pinColor}">${j.riskScore}/100 (${j.riskCategory})</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span>Temp / Humidity:</span>
              <strong>${j.temp}°C / ${j.humidity}%</strong>
            </div>
            <div style="background: #F1F5F9; padding: 6px; border-radius: 6px; font-size: 11px; color: #334155; line-height: 1.3;">
              ${j.action}
            </div>
          </div>
        `;
        marker.bindPopup(popupContent);
        markersRef.current.push(marker);
      });

      if (activeJunction) {
        map.setView([activeJunction.lat, activeJunction.lon], 14);
      }
    } catch (e) {
      console.warn('Leaflet map initialization warning:', e);
      setTileError(true);
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [location.lat, location.lon, filteredJunctions, activeJunction?.id, viewMode]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <MapIcon className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.mapTitle}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
              {location.city || location.name}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.mapSubtitle}
          </p>
        </div>

        {/* View Mode Toggle (Map vs Table) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition"
          >
            {viewMode === 'map' ? (
              <>
                <List className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.viewListAlternative}</span>
              </>
            ) : (
              <>
                <MapIcon className="w-3.5 h-3.5 text-sky-500" />
                <span>{t.viewMapAlternative}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchJunctionsPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          />
        </div>

        {/* Risk Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setRiskFilter('all')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
              riskFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All ({junctions.length})
          </button>
          <button
            onClick={() => setRiskFilter('high')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
              riskFilter === 'high'
                ? 'bg-red-500 text-white shadow-xs'
                : 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100'
            }`}
          >
            High Risk ({junctions.filter((j) => j.riskCategory === 'High').length})
          </button>
          <button
            onClick={() => setRiskFilter('moderate')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
              riskFilter === 'moderate'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 hover:bg-amber-100'
            }`}
          >
            Moderate ({junctions.filter((j) => j.riskCategory === 'Moderate').length})
          </button>
          <button
            onClick={() => setRiskFilter('low')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
              riskFilter === 'low'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
            }`}
          >
            Low ({junctions.filter((j) => j.riskCategory === 'Low').length})
          </button>
        </div>
      </div>

      {/* Main Map Content + Inspector Drawer */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map View Canvas */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden relative flex flex-col min-h-[500px]">
            {/* Map Element */}
            <div 
              ref={mapContainerRef} 
              className="w-full h-[520px] z-10" 
              style={{ background: '#CBD5E1' }}
            />

            {/* Fallback Notification if Tiles Fail */}
            {tileError && (
              <div className="absolute top-3 left-3 right-3 z-30 bg-amber-50 dark:bg-amber-950/90 border border-amber-300 dark:border-amber-700 p-3 rounded-xl text-xs text-amber-900 dark:text-amber-200 shadow-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Map tile connection slow or constrained. Click any junction in the inspector or switch to table view.</span>
              </div>
            )}

            {/* Map Legend Overlay */}
            <div className="absolute top-3 left-3 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs shadow-md">
              <span className="font-bold text-slate-800 dark:text-white block mb-1">
                {t.mapLegendTitle}
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-700 dark:text-slate-300 font-semibold text-[11px]">Low (&lt; 45)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-slate-700 dark:text-slate-300 font-semibold text-[11px]">Mod (45–74)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-slate-700 dark:text-slate-300 font-semibold text-[11px]">High (≥ 75)</span>
                </div>
              </div>
            </div>

            {/* Center Coordinate Info */}
            <div className="absolute bottom-3 left-3 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 shadow-sm flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 text-amber-500" />
              <span>Center: <strong>{location.lat.toFixed(4)}°N, {location.lon.toFixed(4)}°E (Pune Grid)</strong></span>
            </div>
          </div>

          {/* Inspector Panel */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs uppercase font-extrabold text-slate-500 dark:text-slate-400 tracking-wider">
                  {t.junctionDetailsTitle}
                </span>
                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${getRiskColorClasses(activeJunction.riskCategory).badge}`}>
                  {activeJunction.riskCategory}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {activeJunction.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  {activeJunction.neighborhood}
                </p>
              </div>

              {/* Score Display Card */}
              <div className={`p-4 rounded-xl border ${getRiskColorClasses(activeJunction.riskCategory).bg} ${getRiskColorClasses(activeJunction.riskCategory).border}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                      {t.riskScore}
                    </span>
                    <span className={`text-3xl font-black font-mono ${getRiskColorClasses(activeJunction.riskCategory).text}`}>
                      {activeJunction.riskScore}
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/100</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 block">
                      {t.temperature}
                    </span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                      {formatTemp(activeJunction.temp)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Microclimate Details */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">{t.humidity}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeJunction.humidity}%</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">{t.trafficLevel}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeJunction.traffic}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">{t.shadeCover}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeJunction.shadePercent}%</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">{t.officersCount}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeJunction.vulnerableStaffCount} Marshals</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Drinking Water Station:</span>
                  <span className={`font-bold ${activeJunction.drinkingWaterNearby ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {activeJunction.drinkingWaterNearby ? 'Verified Kiosk' : 'Missing / Needed'}
                  </span>
                </div>
              </div>

              {/* Protocol Guidance */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  {t.suggestedPrecautions}:
                </span>
                <p className="leading-relaxed">{activeJunction.action}</p>
              </div>

              {/* Plan Duty Button */}
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('duty-planner')}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <CalendarClock className="w-4 h-4" />
                  <span>{t.planDutyForJunction}</span>
                </button>
              )}
            </div>

            {/* Quick Switch List */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Select Monitored Pune Junction:
              </span>
              <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                {filteredJunctions.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => onSelectJunction(j)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition ${
                      activeJunction.id === j.id
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="truncate">{j.name}</span>
                    <span className={`font-mono text-xs font-bold ${
                      activeJunction.id === j.id 
                        ? 'text-slate-950' 
                        : j.riskScore >= 75 ? 'text-red-500' : j.riskScore >= 45 ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {j.riskScore}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Accessible Table Alternative to Map */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Accessible Tabular Junction Directory
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Alternative list view for screen readers and low-bandwidth connections
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[11px] font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Junction</th>
                  <th className="py-3 px-3">Temp</th>
                  <th className="py-3 px-3">Humidity</th>
                  <th className="py-3 px-3">Risk Score</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-4">Safety Guidance</th>
                  <th className="py-3 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredJunctions.map((j) => {
                  const colors = getRiskColorClasses(j.riskCategory);
                  return (
                    <tr key={j.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {j.name}
                        <div className="text-[11px] font-normal text-slate-500">{j.neighborhood}</div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold">{formatTemp(j.temp)}</td>
                      <td className="py-3 px-3 font-mono">{j.humidity}%</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        {j.riskScore}/100
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors.badge}`}>
                          {j.riskCategory}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300 max-w-xs">
                        {j.action}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => {
                            onSelectJunction(j);
                            setViewMode('map');
                          }}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition"
                        >
                          View Map
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
