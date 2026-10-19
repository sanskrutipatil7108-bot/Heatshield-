import React, { useState } from 'react';
import { 
  BookOpen, 
  Sun, 
  ShieldAlert, 
  Droplets, 
  Clock, 
  HeartPulse, 
  PhoneCall, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  ShieldCheck,
  Zap,
  Sparkles,
  Thermometer
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HeatSafetyGuideView: React.FC = () => {
  const { t, language } = useLanguage();

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    sec1: true,
    sec2: true,
    sec3: true,
    sec4: true,
    sec5: true,
    sec6: true,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.guideTitle}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
              Standard Operating Procedures (SOP)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            {t.guideSubtitle}
          </p>
        </div>
      </div>

      {/* Emergency Hotlines Banner */}
      <div className="bg-red-600 text-white p-4 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-black text-sm uppercase tracking-wide block">
              {t.emergencyCallBanner}
            </span>
            <span className="text-xs text-red-100">
              National Emergency: 112 &bull; Ambulance Helpline: 108
            </span>
          </div>
        </div>
      </div>

      {/* 6 Structured Educational Sections */}
      <div className="space-y-4">
        {/* Section 1: Before Starting Duty */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <button
            onClick={() => toggleSection('sec1')}
            className="w-full p-4 text-left flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                1
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {t.secBeforeDuty}
                </h2>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Pre-shift hydration, nutritional preparation, and uniform checks
                </span>
              </div>
            </div>
            {openSections.sec1 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSections.sec1 && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <strong className="text-slate-900 dark:text-white block font-bold">1. Pre-Hydration</strong>
                  <p className="text-slate-600 dark:text-slate-400">
                    Drink at least 500ml of water or light lemon water 30 minutes before leaving home. Never report to hot weather duty dehydrated.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <strong className="text-slate-900 dark:text-white block font-bold">2. Breathable Cotton Uniform</strong>
                  <p className="text-slate-600 dark:text-slate-400">
                    Wear light, breathable 100% cotton undershirts. Avoid heavy synthetic materials that trap body sweat against the skin.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <strong className="text-slate-900 dark:text-white block font-bold">3. Gear & UV Equipment</strong>
                  <p className="text-slate-600 dark:text-slate-400">
                    Inspect your wide-brim traffic police hat, UV sunglasses, wet neck cooler wrap, and bring an insulated 2-liter water bottle with ORS.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: During Hot Weather */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <button
            onClick={() => toggleSection('sec2')}
            className="w-full p-4 text-left flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xs">
                2
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {t.secDuringDuty}
                </h2>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Managing bitumen reradiation, exhaust fumes, and smart signal post positioning
                </span>
              </div>
            </div>
            {openSections.sec2 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSections.sec2 && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <strong className="text-slate-900 dark:text-white block font-bold">Asphalt Thermal Reradiation</strong>
                  <p className="text-slate-600 dark:text-slate-400">
                    Dark bitumen surfaces absorb and reradiate heat, increasing local foot-level temperature by +3°C to +5°C above ambient air.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <strong className="text-slate-900 dark:text-white block font-bold">Utilize Shade & Canopy Angles</strong>
                  <p className="text-slate-600 dark:text-slate-400">
                    Position traffic control posts under tree shadows, building eaves, or umbrella islands whenever visibility permits.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <strong className="text-slate-900 dark:text-white block font-bold">45-Minute Post Limit</strong>
                  <p className="text-slate-600 dark:text-slate-400">
                    Never remain stationary on unshaded tarmac for over 45 minutes during high-risk conditions without rotating to shade.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Hydration and Rest */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <button
            onClick={() => toggleSection('sec3')}
            className="w-full p-4 text-left flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs">
                3
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {t.secHydrationRest}
                </h2>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Scientific fluid intake schedule and electrolyte replenishment rules
                </span>
              </div>
            </div>
            {openSections.sec3 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSections.sec3 && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-900 space-y-2">
                <span className="font-extrabold text-cyan-900 dark:text-cyan-200 block text-sm">
                  Recommended Hydration Schedule:
                </span>
                <ul className="list-disc pl-5 space-y-1.5 text-cyan-950 dark:text-cyan-100">
                  <li><strong>Every 20–30 Minutes:</strong> Drink 250ml to 350ml of clean drinking water or chilled electrolytes.</li>
                  <li><strong>Do Not Wait for Thirst:</strong> Thirst is a delayed symptom of dehydration; by the time you feel thirsty, your body is already 2% dehydrated.</li>
                  <li><strong>Electrolyte (ORS) Packets:</strong> Consume 1 packet of WHO-formula Oral Rehydration Salts mixed in 1 liter of water during mid-shift.</li>
                  <li><strong>Avoid Dehydrating Fluids:</strong> Restrict hot tea, sugary sodas, and excess caffeine as they stimulate fluid loss.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Warning Signs of Heat Illness */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <button
            onClick={() => toggleSection('sec4')}
            className="w-full p-4 text-left flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">
                4
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {t.secWarningSigns}
                </h2>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Critical diagnostic differences between Heat Cramps, Exhaustion, and Heatstroke
                </span>
              </div>
            </div>
            {openSections.sec4 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSections.sec4 && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs leading-relaxed">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-[11px] uppercase">
                      <th className="py-2 px-3">Condition</th>
                      <th className="py-2 px-3">Symptoms</th>
                      <th className="py-2 px-3">Urgency</th>
                      <th className="py-2 px-3">Immediate Response</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-amber-600">Heat Cramps</td>
                      <td className="py-2.5 px-3">Muscle spasms, cramping in legs/abdomen, heavy sweating.</td>
                      <td className="py-2.5 px-3 font-bold text-amber-500">Moderate</td>
                      <td className="py-2.5 px-3">Rest in shade, drink ORS or salty fluid, gently stretch.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-orange-600">Heat Exhaustion</td>
                      <td className="py-2.5 px-3">Dizziness, nausea, headache, pale clammy skin, fast weak pulse.</td>
                      <td className="py-2.5 px-3 font-bold text-orange-500">High</td>
                      <td className="py-2.5 px-3">Move to shade, loosen uniform, apply cold cloths, sip water.</td>
                    </tr>
                    <tr className="bg-red-50/50 dark:bg-red-950/20 font-bold">
                      <td className="py-2.5 px-3 text-red-600">Heatstroke (Emergency)</td>
                      <td className="py-2.5 px-3 text-red-700 dark:text-red-300">
                        Body temp &gt;40°C, lack of sweating (hot dry skin), confusion, fainting, seizures.
                      </td>
                      <td className="py-2.5 px-3 text-red-600">CRITICAL</td>
                      <td className="py-2.5 px-3 text-red-700 dark:text-red-300">
                        DIAL 112 / 108. Rapid cooling with cold water/ice packs. Do not force fluids.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Emergency Response Protocols */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <button
            onClick={() => toggleSection('sec5')}
            className="w-full p-4 text-left flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                5
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {t.secEmergencyResponse}
                </h2>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Step-by-step emergency protocol when a colleague collapses or shows heatstroke
                </span>
              </div>
            </div>
            {openSections.sec5 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSections.sec5 && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">Step 1: Move to Shade</span>
                  <p className="text-slate-600 dark:text-slate-400">Immediately transfer the affected person away from direct sun into shade or an air-conditioned police vehicle.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">Step 2: Loosen Clothing</span>
                  <p className="text-slate-600 dark:text-slate-400">Remove heavy tactical vest, belt, and shoes. Loosen collar buttons to promote ventilation.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">Step 3: Rapid Body Cooling</span>
                  <p className="text-slate-600 dark:text-slate-400">Apply cold wet towels or water to the neck, armpits, and groin. Fan aggressively to evaporate heat.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 space-y-1">
                  <span className="font-bold text-red-700 dark:text-red-400 block">Step 4: Dial 112 / 108</span>
                  <p className="text-red-900 dark:text-red-200">Call emergency services immediately. State clearly: "Suspected heatstroke at [Junction Name]".</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 6: After Completing Duty */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <button
            onClick={() => toggleSection('sec6')}
            className="w-full p-4 text-left flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-xs">
                6
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {t.secAfterDuty}
                </h2>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Post-shift recovery, electrolyte rebalancing, and sleep hygiene
                </span>
              </div>
            </div>
            {openSections.sec6 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSections.sec6 && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Cool Down Gradually:</strong> Do not immediately enter sub-zero blast air conditioning with heavy sweat; allow body temperature to normalize over 10 minutes.</li>
                <li><strong>Replenish Fluids:</strong> Continue consuming water, buttermilk (chaas), or coconut water for 2–3 hours after shift completion.</li>
                <li><strong>Monitor for Delayed Symptoms:</strong> Watch out for late-onset headaches, dizziness, or dark-colored urine (an indicator of severe dehydration).</li>
                <li><strong>Adequate Sleep:</strong> Ensure 7–8 hours of restful sleep in a well-ventilated room to allow cellular repair before next day's rotation.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
