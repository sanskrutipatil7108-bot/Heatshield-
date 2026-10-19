import React, { useState } from 'react';
import { 
  Flame, 
  Calculator, 
  Thermometer, 
  Droplets, 
  Sun, 
  Wind, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  History, 
  TrendingUp, 
  AlertTriangle, 
  Info, 
  Car, 
  Umbrella, 
  ArrowRight, 
  ShieldCheck, 
  MapPin,
  BotMessageSquare,
  Save
} from 'lucide-react';
import { Junction, NavTab, PredictionRecord, RiskCategory, TrafficIntensity } from '../types';
import { calculateHeatRiskScore, getRecommendedAction, getRiskColorClasses } from '../utils/heatRisk';
import { INITIAL_PREDICTIONS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface HeatRiskPredictionViewProps {
  junctions: Junction[];
  onUpdateJunction?: (updated: Junction) => void;
  onNavigateTab?: (tab: NavTab) => void;
  onSelectJunction?: (j: Junction) => void;
}

export const HeatRiskPredictionView: React.FC<HeatRiskPredictionViewProps> = ({
  junctions,
  onUpdateJunction,
  onNavigateTab,
  onSelectJunction,
}) => {
  const { t } = useLanguage();
  const { formatTemp } = useTheme();

  // Selected junction
  const [selectedJunctionId, setSelectedJunctionId] = useState<string>(
    junctions[0]?.id || 'pune-swargate'
  );

  // Form Inputs
  const [temp, setTemp] = useState<number>(40.5);
  const [forecastTemp, setForecastTemp] = useState<number>(42.0);
  const [humidity, setHumidity] = useState<number>(50);
  const [traffic, setTraffic] = useState<TrafficIntensity>('Heavy');
  const [shadePercent, setShadePercent] = useState<number>(15);
  const [hasWater, setHasWater] = useState<boolean>(true);
  const [dutyDurationMin, setDutyDurationMin] = useState<number>(60);
  const [sunExposure, setSunExposure] = useState<string>('Direct Intense Sunlight');
  const [windCondition, setWindCondition] = useState<string>('Light Breeze (5–15 km/h)');

  // Calculation Results
  const [isCalculating, setIsCalculating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Initial calculation result
  const initialCalc = calculateHeatRiskScore(40.5, 50, 'Heavy', 15);
  const [currentScore, setCurrentScore] = useState<number>(initialCalc.score);
  const [currentCategory, setCurrentCategory] = useState<RiskCategory>(initialCalc.category);
  const [formulaBreakdown, setFormulaBreakdown] = useState<string>(initialCalc.formulaBreakdown);

  // Prediction History
  const [history, setHistory] = useState<PredictionRecord[]>(INITIAL_PREDICTIONS);

  // Sync initial parameters when junction selector changes
  const handleJunctionSelect = (juncId: string) => {
    setSelectedJunctionId(juncId);
    const target = junctions.find((j) => j.id === juncId);
    if (target) {
      setTemp(target.temp);
      setForecastTemp(Math.round((target.temp + 1.5) * 10) / 10);
      setHumidity(target.humidity);
      setTraffic(target.traffic);
      setShadePercent(target.shadePercent);
      setHasWater(target.drinkingWaterNearby);
      setDutyDurationMin(target.outdoorDutyDurationMin || (target.riskCategory === 'High' ? 45 : 60));
    }
  };

  // Run calculation with validation
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSaveSuccessMsg(null);

    // Validation
    if (isNaN(temp) || temp < 15 || temp > 58) {
      setValidationError('Current temperature must be between 15°C and 58°C.');
      return;
    }
    if (isNaN(humidity) || humidity < 5 || humidity > 100) {
      setValidationError('Relative humidity must be between 5% and 100%.');
      return;
    }
    if (isNaN(dutyDurationMin) || dutyDurationMin < 15 || dutyDurationMin > 240) {
      setValidationError('Outdoor duty duration must be between 15 and 240 minutes.');
      return;
    }

    setIsCalculating(true);

    setTimeout(() => {
      // Calculate using transparent explainable formula
      const { score, category, formulaBreakdown: breakdown } = calculateHeatRiskScore(
        temp,
        humidity,
        traffic,
        shadePercent
      );

      const targetJunction = junctions.find((j) => j.id === selectedJunctionId);
      const juncName = targetJunction ? targetJunction.name : 'Pune Roadside Signal Post';

      const newRecord: PredictionRecord = {
        id: `pred-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        junctionName: juncName,
        temperature: temp,
        humidity,
        traffic,
        shadePercent,
        sunExposure,
        windSpeed: windCondition,
        riskScore: score,
        riskCategory: category,
        explanation: breakdown,
      };

      setHistory((prev) => [newRecord, ...prev.slice(0, 8)]);
      setCurrentScore(score);
      setCurrentCategory(category);
      setFormulaBreakdown(breakdown);
      setIsCalculating(false);
    }, 200);
  };

  // Save scenario to junction
  const handleSaveToJunction = async () => {
    const target = junctions.find((j) => j.id === selectedJunctionId);
    if (!target || !onUpdateJunction) return;

    const updated: Junction = {
      ...target,
      temp,
      humidity,
      traffic,
      shadePercent,
      drinkingWaterNearby: hasWater,
      riskScore: currentScore,
      riskCategory: currentCategory,
      outdoorDutyDurationMin: dutyDurationMin,
      action: getRecommendedAction(currentCategory, temp),
      lastUpdated: 'Just now (Prediction applied)',
    };

    onUpdateJunction(updated);

    try {
      await fetch(`/api/junctions/${target.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temp: updated.temp,
          humidity: updated.humidity,
          traffic: updated.traffic,
          shadePercent: updated.shadePercent,
          drinkingWaterNearby: updated.drinkingWaterNearby,
        }),
      });
    } catch (e) {
      console.warn('Backend sync error:', e);
    }

    setSaveSuccessMsg(`Updated ${target.name} with calculated Risk Score ${currentScore}/100.`);
  };

  // Reset to default baseline values
  const handleReset = () => {
    setTemp(38.5);
    setForecastTemp(40.0);
    setHumidity(45);
    setTraffic('Moderate');
    setShadePercent(20);
    setHasWater(true);
    setDutyDurationMin(60);
    setSunExposure('Direct Intense Sunlight');
    setWindCondition('Light Breeze (5–15 km/h)');
    setValidationError(null);
    setSaveSuccessMsg(null);
  };

  const riskStyle = getRiskColorClasses(currentCategory);
  const selectedJunc = junctions.find((j) => j.id === selectedJunctionId);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Calculator className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.predictionTitle}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700">
              Interactive Scenario Simulation
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            {t.predictionSubtitle}
          </p>
        </div>

        {/* Action to Request AI Explanation */}
        {onNavigateTab && selectedJunc && (
          <button
            onClick={() => {
              if (onSelectJunction) onSelectJunction(selectedJunc);
              onNavigateTab('ai-assistant');
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition shadow-xs shrink-0"
          >
            <BotMessageSquare className="w-4 h-4" />
            <span>Ask Nugen AI for Explanation</span>
          </button>
        )}
      </div>

      {/* Prominent Methodology Notice */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <Info className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Rule-Based Demonstration Scoring Model (Pune S.O.P.)</span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          This scoring module uses a transparent rule-based algorithm: Baseline temperature load above 24°C (+3.3 pts/°C) + Humidity perspiration penalty (+0.45 pts/%) + Traffic exhaust multiplier (+4 to +18 pts) - Canopy shade mitigation (-14 pts).
          <strong> Notice:</strong> This formula is a demonstration model for traffic planning and is not a scientifically validated clinical or medical diagnosis index.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Environmental & Operational Parameters
              </h2>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-amber-500 flex items-center gap-1 font-semibold transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {validationError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {saveSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleCalculate} className="space-y-4">
            {/* Junction Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Select Pune Junction
              </label>
              <select
                value={selectedJunctionId}
                onChange={(e) => handleJunctionSelect(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-amber-500"
              >
                {junctions.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.name} (Current: {j.temp}°C, {j.riskScore}/100 - {j.riskCategory} Risk)
                  </option>
                ))}
              </select>
            </div>

            {/* Temp & Forecast Temp */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Current Temperature (°C)
                </label>
                <div className="relative">
                  <Thermometer className="w-4 h-4 text-red-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    step="0.1"
                    min="15"
                    max="58"
                    value={temp}
                    onChange={(e) => setTemp(parseFloat(e.target.value) || 35)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Forecast Afternoon Temp (°C)
                </label>
                <div className="relative">
                  <TrendingUp className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    step="0.1"
                    min="15"
                    max="58"
                    value={forecastTemp}
                    onChange={(e) => setForecastTemp(parseFloat(e.target.value) || 38)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Humidity & Traffic */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Relative Humidity (%)
                </label>
                <div className="relative">
                  <Droplets className="w-4 h-4 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={humidity}
                    onChange={(e) => setHumidity(parseInt(e.target.value, 10) || 40)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Traffic Intensity Load
                </label>
                <select
                  value={traffic}
                  onChange={(e) => setTraffic(e.target.value as TrafficIntensity)}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Normal">Normal Traffic (+4 pts)</option>
                  <option value="Moderate">Moderate Traffic (+8 pts)</option>
                  <option value="Heavy">Heavy Traffic (+14 pts)</option>
                  <option value="Gridlock">Gridlock Trapped Exhaust (+18 pts)</option>
                </select>
              </div>
            </div>

            {/* Outdoor Duty Duration & Shade Slider */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Planned Continuous Duty (min)
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={dutyDurationMin}
                    onChange={(e) => setDutyDurationMin(parseInt(e.target.value, 10) || 45)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Canopy Shade: {shadePercent}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="70"
                  value={shadePercent}
                  onChange={(e) => setShadePercent(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer accent-amber-500 mt-3"
                />
              </div>
            </div>

            {/* Drinking Water Availability Checkbox */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={hasWater}
                  onChange={(e) => setHasWater(e.target.checked)}
                  className="rounded-sm text-amber-500 focus:ring-amber-500"
                />
                <span>Chilled Drinking Water Refill Dispenser on Site</span>
              </label>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${hasWater ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                {hasWater ? '-4 pts mitigation' : 'No water mitigation'}
              </span>
            </div>

            {/* Calculate Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={isCalculating}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-sm"
              >
                <Calculator className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
                <span>{isCalculating ? 'Calculating Score...' : 'Calculate Heat Risk'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToJunction}
                className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
                title="Save this simulated scenario to the active junction"
              >
                <Save className="w-4 h-4" />
                <span>Save to Junction</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Score Breakdown & Precautionary Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Score Result Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Simulated Output
              </span>
              <span className={`text-xs font-black px-3 py-0.5 rounded-full border ${riskStyle.badge}`}>
                {currentCategory} RISK
              </span>
            </div>

            {/* Big Risk Gauge Display */}
            <div className="text-center py-4 bg-slate-50/60 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {currentScore}
                <span className="text-2xl text-slate-400 font-normal">/100</span>
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Heat Risk Score
              </p>
            </div>

            {/* Contributing Factor Breakdown */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">
                Factor Contribution Breakdown:
              </span>
              <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                {formulaBreakdown}
              </p>
            </div>

            {/* Precautionary S.O.P. Guidance */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Recommended Precautionary SOP:</span>
              </div>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                {getRecommendedAction(currentCategory, temp)}
              </p>
            </div>
          </div>

          {/* Historical Prediction Log */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
              <History className="w-4 h-4 text-slate-400" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Calculation Log
              </h3>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {item.junctionName}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {formatTemp(item.temperature)} | {item.humidity}% RH | {item.traffic}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${
                      item.riskCategory === 'High'
                        ? 'bg-red-100 text-red-700 border-red-200'
                        : item.riskCategory === 'Moderate'
                        ? 'bg-amber-100 text-amber-700 border-amber-200'
                        : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {item.riskScore} ({item.riskCategory})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
