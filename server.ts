import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// ========================================================
// NUGEN API CONFIGURATION (SOLE PERMITTED AI INTEGRATION)
// ========================================================
const rawNugenKey = process.env.NUGEN_API_KEY?.trim() || '';
const isNugenConfigured = rawNugenKey.length > 5;
const NUGEN_API_KEY = rawNugenKey;
const NUGEN_API_ENDPOINT = (process.env.NUGEN_API_ENDPOINT || 'https://api.nugen.in/api/v3').replace(/\/$/, '');
const NUGEN_MODEL = process.env.NUGEN_MODEL || 'nugen-flash-instruct';

console.log(`[HeatShield AI] Nugen API Endpoint: ${NUGEN_API_ENDPOINT}`);
console.log(`[HeatShield AI] Nugen Model: ${NUGEN_MODEL}`);
console.log(`[HeatShield AI] Nugen API Key configured: ${isNugenConfigured}`);

// ========================================================
// 5 SIMULATED PUNE DEMONSTRATION JUNCTIONS
// ========================================================
const INITIAL_DEMO_JUNCTIONS = [
  {
    id: 'pune-jm-road',
    name: 'JM Road Junction',
    neighborhood: 'Jungli Maharaj Road & Shivajinagar Commercial Axis',
    lat: 18.5246,
    lon: 73.8478,
    temp: 36.2,
    humidity: 40,
    traffic: 'Moderate',
    shadePercent: 35,
    riskScore: 42,
    riskCategory: 'Low',
    action: 'Standard duty hydration; maintain baseline water refills; normal staff monitoring and wellbeing check-ins.',
    vulnerableStaffCount: 8,
    outdoorDutyDurationMin: 90,
    drinkingWaterNearby: true,
    hasMistingFan: false,
    hasShadeShelter: true,
    dataSource: 'Simulated Pune Telemetry - DEMO DATA',
    lastUpdated: '5 mins ago (Simulated)',
    notes: 'Decent tree canopy cover along western pedestrian avenue. Moderate vehicle density.',
  },
  {
    id: 'pune-deccan',
    name: 'Deccan Gymkhana Junction',
    neighborhood: 'FC Road & Karve Road Nexus',
    lat: 18.5173,
    lon: 73.8415,
    temp: 38.0,
    humidity: 46,
    traffic: 'Moderate',
    shadePercent: 25,
    riskScore: 60,
    riskCategory: 'Moderate',
    action: 'Enforce 350ml hydration every 30 min; rotate traffic marshals from asphalt at 14:00.',
    vulnerableStaffCount: 10,
    outdoorDutyDurationMin: 60,
    drinkingWaterNearby: true,
    hasMistingFan: false,
    hasShadeShelter: true,
    dataSource: 'Simulated Pune Telemetry - DEMO DATA',
    lastUpdated: '8 mins ago (Simulated)',
    notes: 'FC Road approach has intermittent tree shadows. Heavy pedestrian crossings.',
  },
  {
    id: 'pune-shivajinagar',
    name: 'Shivajinagar Junction',
    neighborhood: 'Shivajinagar Metro Interchange & Court Road',
    lat: 18.5314,
    lon: 73.8446,
    temp: 38.8,
    humidity: 48,
    traffic: 'Heavy',
    shadePercent: 18,
    riskScore: 68,
    riskCategory: 'Moderate',
    action: 'Rotate officers every 60 min; deploy UV caps with neck shades; provide 500ml cold water.',
    vulnerableStaffCount: 12,
    outdoorDutyDurationMin: 60,
    drinkingWaterNearby: true,
    hasMistingFan: true,
    hasShadeShelter: true,
    dataSource: 'Simulated Pune Telemetry - DEMO DATA',
    lastUpdated: '10 mins ago (Simulated)',
    notes: 'Concrete flyover structure traps heat between bridge pillars with limited natural breeze.',
  },
  {
    id: 'pune-swargate',
    name: 'Swargate Junction',
    neighborhood: 'Swargate Multimodal Transit & Bus Terminal',
    lat: 18.5018,
    lon: 73.8586,
    temp: 41.2,
    humidity: 54,
    traffic: 'Gridlock',
    shadePercent: 8,
    riskScore: 86,
    riskCategory: 'High',
    action: 'Mandatory 15-min shaded rest every 45 min; chilled ORS electrolytes; active water misting canopy.',
    vulnerableStaffCount: 14,
    outdoorDutyDurationMin: 45,
    drinkingWaterNearby: false,
    hasMistingFan: false,
    hasShadeShelter: false,
    dataSource: 'Simulated Pune Telemetry - DEMO DATA',
    lastUpdated: '3 mins ago (Simulated)',
    notes: 'Massive asphalt footprint reradiates intense solar thermal load. High diesel bus exhaust concentration.',
  },
  {
    id: 'pune-hadapsar',
    name: 'Hadapsar Junction',
    neighborhood: 'Solapur Road Industrial Freight Gateway',
    lat: 18.5029,
    lon: 73.9272,
    temp: 42.0,
    humidity: 50,
    traffic: 'Heavy',
    shadePercent: 10,
    riskScore: 89,
    riskCategory: 'High',
    action: 'CRITICAL HEAT ADVISORY: Limit unshaded post to 40 min; supply cold ORS; misting fan required.',
    vulnerableStaffCount: 12,
    outdoorDutyDurationMin: 40,
    drinkingWaterNearby: false,
    hasMistingFan: false,
    hasShadeShelter: false,
    dataSource: 'Simulated Pune Telemetry - DEMO DATA',
    lastUpdated: '2 mins ago (Simulated)',
    notes: 'Wide 6-lane asphalt highway corridor with heavy freight diesel exhaust and zero natural canopy.',
  },
];

const INITIAL_DEMO_DUTY_PLANS = [
  {
    id: 'dp-1',
    junctionId: 'pune-swargate',
    junctionName: 'Swargate Junction',
    shiftName: 'Peak Heat Afternoon Shift',
    shiftHours: '11:00 – 15:00',
    riskCategory: 'High',
    personnelCount: 6,
    hydrationTargetMlPerHour: 650,
    restBreakIntervalMin: 45,
    rotationHours: 1.5,
    supervisorStatus: 'Action Required',
    supervisorNotes: 'High solar radiant load on south flyover approach. Extra relief marshal assigned for 15-minute rest rotations.',
    recommendations: [
      'Prohibit solo officer standing on exposed tarmac island without overhead canopy.',
      'Provide chilled electrolytes (ORS sachets) at the traffic control booth.',
      'Mandatory wellness check-in at 13:00 and 14:30.',
    ],
    tasks: [
      { id: 't-1', text: 'Distribute insulated 2-liter hydration flasks with ORS', completed: true, category: 'hydration' },
      { id: 't-2', text: 'Confirm shaded cooling awning erected at southern signal island', completed: false, category: 'ppe' },
      { id: 't-3', text: 'Schedule 45-minute alternating rotation with relief marshal', completed: false, category: 'rotation' },
      { id: 't-4', text: 'Verify nearest primary health center emergency standby contacts', completed: true, category: 'checkin' },
    ],
  },
  {
    id: 'dp-2',
    junctionId: 'pune-hadapsar',
    junctionName: 'Hadapsar Junction',
    shiftName: 'Peak Heat Afternoon Shift',
    shiftHours: '11:00 – 15:00',
    riskCategory: 'High',
    personnelCount: 5,
    hydrationTargetMlPerHour: 600,
    restBreakIntervalMin: 40,
    rotationHours: 1.5,
    supervisorStatus: 'Approved',
    supervisorNotes: 'Industrial freight heat load. Team provided with UV reflective caps and wet cooling neck wraps.',
    recommendations: [
      'Relieve officers at 40-minute intervals to air-cooled patrol vehicle or booth.',
      'Ensure on-site cold water dispenser is refilled before 11:30.',
    ],
    tasks: [
      { id: 't-5', text: 'Pre-shift hydration briefing and core temperature check', completed: true, category: 'checkin' },
      { id: 't-6', text: 'Equip officers with wide-brim UV hats and cooling neck towels', completed: true, category: 'ppe' },
      { id: 't-7', text: 'Coordinate with municipal tanker for road wetting mist', completed: true, category: 'rotation' },
    ],
  },
  {
    id: 'dp-3',
    junctionId: 'pune-shivajinagar',
    junctionName: 'Shivajinagar Junction',
    shiftName: 'Morning Peak Traffic Shift',
    shiftHours: '07:00 – 11:00',
    riskCategory: 'Moderate',
    personnelCount: 4,
    hydrationTargetMlPerHour: 400,
    restBreakIntervalMin: 60,
    rotationHours: 2.0,
    supervisorStatus: 'Approved',
    supervisorNotes: 'Moderate heat stress; temperature rises rapidly after 09:30. Hydration checkpoint established.',
    recommendations: [
      'Ensure 350ml water consumed every 30 minutes.',
      'Transition to covered umbrella signal posts at 10:00.',
    ],
    tasks: [
      { id: 't-8', text: 'Inspect chilled drinking water dispenser at bus stop', completed: true, category: 'hydration' },
      { id: 't-9', text: 'Confirm emergency first-aid kit in control booth', completed: true, category: 'checkin' },
    ],
  },
];

const INITIAL_DEMO_COOLING_PRIORITIES = [
  {
    id: 'cp-1',
    rank: 1,
    junctionId: 'pune-hadapsar',
    junctionName: 'Hadapsar Junction',
    riskScore: 89,
    riskCategory: 'High',
    facilityType: 'Misting Shade Awning',
    urgency: 'Immediate',
    status: 'Needed',
    reason: 'Wide open 6-lane asphalt highway corridor with extreme solar radiance (42.0°C) and heavy diesel truck emissions.',
    proposedAction: 'Install heavy-duty UV reflective shade canopy and high-pressure water misting nozzles at central traffic island.',
    targetCompletionDays: 2,
    lastUpdated: 'Today',
  },
  {
    id: 'cp-2',
    rank: 2,
    junctionId: 'pune-swargate',
    junctionName: 'Swargate Junction',
    riskScore: 86,
    riskCategory: 'High',
    facilityType: 'Drinking Water Kiosk',
    urgency: 'Immediate',
    status: 'In Progress',
    reason: 'Severe asphalt heat reradiation, 14 outdoor officers assigned without on-site cold drinking water dispensary.',
    proposedAction: 'Connect chilled RO drinking water dispenser with ORS sachet replenishment station at police chowki.',
    targetCompletionDays: 3,
    lastUpdated: 'Yesterday',
  },
  {
    id: 'cp-3',
    rank: 3,
    junctionId: 'pune-shivajinagar',
    junctionName: 'Shivajinagar Junction',
    riskScore: 68,
    riskCategory: 'Moderate',
    facilityType: 'Air-Cooled Transit Shelter',
    urgency: 'High',
    status: 'Installed',
    reason: 'High pedestrian and commuter volume; elevated flyover traps heat between concrete pillars.',
    proposedAction: 'Maintain and inspect existing air-cooler unit in traffic police cabin and refill water reservoir daily.',
    targetCompletionDays: 5,
    lastUpdated: '2 days ago',
  },
  {
    id: 'cp-4',
    rank: 4,
    junctionId: 'pune-deccan',
    junctionName: 'Deccan Gymkhana Junction',
    riskScore: 60,
    riskCategory: 'Moderate',
    facilityType: 'Drinking Water Kiosk',
    urgency: 'Scheduled',
    status: 'Installed',
    reason: 'Commercial hub with good tree canopy, but high footfall increases demand on roadside water supply.',
    proposedAction: 'Regular maintenance of municipal water filtration kiosk near Sambhaji Park crossing.',
    targetCompletionDays: 8,
    lastUpdated: '3 days ago',
  },
  {
    id: 'cp-5',
    rank: 5,
    junctionId: 'pune-jm-road',
    junctionName: 'JM Road Junction',
    riskScore: 42,
    riskCategory: 'Low',
    facilityType: 'ORS & First-Aid Standby',
    urgency: 'Scheduled',
    status: 'Installed',
    reason: 'Good avenue tree canopy; officers need quick access to emergency heat exhaustion packs during afternoon shifts.',
    proposedAction: 'Stock dedicated heatwave first-aid kit with instant cold packs, ORS sachets, and digital thermometer.',
    targetCompletionDays: 10,
    lastUpdated: '4 days ago',
  },
];

let demoJunctions = JSON.parse(JSON.stringify(INITIAL_DEMO_JUNCTIONS));
let demoDutyPlans = JSON.parse(JSON.stringify(INITIAL_DEMO_DUTY_PLANS));
let demoCoolingPriorities = JSON.parse(JSON.stringify(INITIAL_DEMO_COOLING_PRIORITIES));

// Static Heat Safety Fallback Resources
const STATIC_HEAT_SAFETY_RESOURCES = {
  protocol: 'PUNE-TRAFFIC-HEAT-SAFETY-SOP-2026',
  emergencyHelplines: {
    policeEmergency: '112',
    medicalAmbulance: '108',
    trafficControlRoom: '020-26122880',
  },
  heatExhaustionVsHeatstroke: {
    heatExhaustion: {
      symptoms: ['Heavy sweating', 'Cool clammy skin', 'Fast weak pulse', 'Muscle cramps, dizziness, headache'],
      treatment: 'Move immediately to shaded shelter, loosen collar/vest, apply cool wet cloth, drink 350-500ml water/ORS. Rest for 30 min.',
    },
    heatstroke: {
      symptoms: ['Core temp > 40°C', 'Hot red dry or damp skin', 'Confusion, slurred speech', 'Loss of consciousness'],
      treatment: 'LIFE-THREATENING EMERGENCY: Call 108/112 immediately. Move to AC/shade. Aggressively cool with cold water/ice under armpits and neck. Do NOT force oral fluids if unconscious.',
    },
  },
  hydrationGuideline: 'Drink 350ml-500ml water or ORS every 20-30 minutes. Do not wait for thirst.',
  rotationGuideline: 'High risk (>75): max 45 min standing / 15 min shaded rest. Moderate risk: max 60 min standing / 15 min rest.',
};

// Local Heat-Risk Formula
function calculateLocalHeatRisk(temp: number, humidity: number, traffic = 'Moderate', shadePercent = 20, hasWater = true, hasMisting = false) {
  const tempDiff = Math.max(0, temp - 24);
  const tempComponent = Math.min(55, tempDiff * 3.3);

  const humidityExcess = Math.max(0, humidity - 30);
  const humidityComponent = Math.min(30, humidityExcess * 0.45);

  const trafficMap: Record<string, number> = { Normal: 4, Moderate: 8, Heavy: 14, Gridlock: 18 };
  const trafficComponent = trafficMap[traffic] || 8;

  const shadeDiscount = Math.min(15, (shadePercent / 100) * 14);
  const facilityDiscount = (hasWater ? 4 : 0) + (hasMisting ? 5 : 0);

  const rawScore = tempComponent + humidityComponent + trafficComponent - shadeDiscount - facilityDiscount;
  const score = Math.max(10, Math.min(100, Math.round(rawScore)));

  let category: 'Low' | 'Moderate' | 'High' = 'Low';
  let action = '';
  let restInterval = 90;
  let breakDuration = 10;
  let hydrationTarget = 350;

  if (score >= 75) {
    category = 'High';
    action = 'Mandatory 15-min shaded rest every 45 min; chilled ORS replenishment; rotate staff from exposed tarmac posts; active water misting required.';
    restInterval = 45;
    breakDuration = 15;
    hydrationTarget = 650;
  } else if (score >= 45) {
    category = 'Moderate';
    action = 'Enforce 350ml hydration every 30 min; swap exposed posts during peak afternoon hours; deploy UV protective neck flaps and caps.';
    restInterval = 60;
    breakDuration = 15;
    hydrationTarget = 450;
  } else {
    category = 'Low';
    action = 'Standard duty hydration; maintain baseline water refills; normal staff monitoring and wellbeing check-ins.';
    restInterval = 90;
    breakDuration = 10;
    hydrationTarget = 350;
  }

  return {
    score,
    category,
    action,
    restIntervalMin: restInterval,
    breakDurationMin: breakDuration,
    hydrationTargetMlPerHour: hydrationTarget,
    breakdown: {
      temperatureComponent: Math.round(tempComponent * 10) / 10,
      humidityComponent: Math.round(humidityComponent * 10) / 10,
      trafficLoad: trafficComponent,
      shadeRelief: Math.round(shadeDiscount * 10) / 10,
      facilityRelief: facilityDiscount,
      rawTotal: Math.round(rawScore * 10) / 10,
    },
  };
}

// ========================================================
// REST API ENDPOINTS
// ========================================================

// 1. Health
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'HeatShield AI Core Server',
    version: '2.4.0',
    aiProvider: 'Nugen API (Sole Permitted AI Integration)',
    nugenConfigured: isNugenConfigured,
    nugenModel: NUGEN_MODEL,
    monitoredCity: 'Pune, Maharashtra, India',
    timestamp: new Date().toISOString(),
  });
});

// 2. Junctions
app.get('/api/junctions', (req, res) => {
  const { riskCategory, search } = req.query;
  let list = demoJunctions;

  if (riskCategory && riskCategory !== 'all') {
    list = list.filter((j: any) => j.riskCategory.toLowerCase() === (riskCategory as string).toLowerCase());
  }
  if (search) {
    const s = (search as string).toLowerCase();
    list = list.filter((j: any) => j.name.toLowerCase().includes(s) || j.neighborhood.toLowerCase().includes(s));
  }

  res.json({
    success: true,
    count: list.length,
    data: list,
    dataSource: 'Simulated Pune Telemetry - DEMO DATA',
  });
});

app.get('/api/junctions/:id', (req, res) => {
  const junction = demoJunctions.find((j: any) => j.id === req.params.id);
  if (!junction) {
    return res.status(404).json({ success: false, error: `Junction '${req.params.id}' not found` });
  }
  res.json({ success: true, data: junction });
});

app.put('/api/junctions/:id', (req, res) => {
  const junction = demoJunctions.find((j: any) => j.id === req.params.id);
  if (!junction) {
    return res.status(404).json({ success: false, error: `Junction '${req.params.id}' not found` });
  }

  const { temp, humidity, traffic, shadePercent, drinkingWaterNearby, hasMistingFan, hasShadeShelter, vulnerableStaffCount } = req.body;

  if (temp !== undefined) junction.temp = parseFloat(temp);
  if (humidity !== undefined) junction.humidity = parseFloat(humidity);
  if (traffic !== undefined) junction.traffic = traffic;
  if (shadePercent !== undefined) junction.shadePercent = Math.max(0, Math.min(100, parseFloat(shadePercent)));
  if (drinkingWaterNearby !== undefined) junction.drinkingWaterNearby = Boolean(drinkingWaterNearby);
  if (hasMistingFan !== undefined) junction.hasMistingFan = Boolean(hasMistingFan);
  if (hasShadeShelter !== undefined) junction.hasShadeShelter = Boolean(hasShadeShelter);
  if (vulnerableStaffCount !== undefined) junction.vulnerableStaffCount = parseInt(vulnerableStaffCount, 10);

  // Recalculate
  const recalc = calculateLocalHeatRisk(
    junction.temp,
    junction.humidity,
    junction.traffic,
    junction.shadePercent,
    junction.drinkingWaterNearby,
    junction.hasMistingFan
  );

  junction.riskScore = recalc.score;
  junction.riskCategory = recalc.category;
  junction.action = recalc.action;
  junction.outdoorDutyDurationMin = recalc.restIntervalMin;
  junction.lastUpdated = 'Just now (Supervisor update)';

  res.json({
    success: true,
    message: `Updated ${junction.name} successfully`,
    data: junction,
  });
});

app.post('/api/junctions/reset', (_req, res) => {
  demoJunctions = JSON.parse(JSON.stringify(INITIAL_DEMO_JUNCTIONS));
  demoDutyPlans = JSON.parse(JSON.stringify(INITIAL_DEMO_DUTY_PLANS));
  demoCoolingPriorities = JSON.parse(JSON.stringify(INITIAL_DEMO_COOLING_PRIORITIES));
  res.json({
    success: true,
    message: 'Reset all 5 Pune demonstration junctions to seed baseline data',
    data: demoJunctions,
  });
});

// 3. Heat Risk Calculate
app.post('/api/heat-risk/calculate', (req, res) => {
  const { temperature, humidity, traffic = 'Moderate', shadePercent = 20, drinkingWaterNearby = true, hasMistingFan = false } = req.body;

  const temp = parseFloat(temperature);
  const hum = parseFloat(humidity);

  if (isNaN(temp) || isNaN(hum)) {
    return res.status(400).json({ error: 'Temperature and humidity must be numeric.' });
  }

  if (temp < 15 || temp > 60) {
    return res.status(400).json({ error: 'Temperature must be between 15°C and 60°C.' });
  }
  if (hum < 5 || hum > 100) {
    return res.status(400).json({ error: 'Humidity must be between 5% and 100%.' });
  }

  const result = calculateLocalHeatRisk(temp, hum, traffic, parseFloat(shadePercent), Boolean(drinkingWaterNearby), Boolean(hasMistingFan));

  res.json({
    success: true,
    inputs: { temperature: temp, humidity: hum, traffic, shadePercent, drinkingWaterNearby, hasMistingFan },
    result,
    methodology: 'Transparent Rule-Based Demonstration Formula (Pune Traffic Operations S.O.P.)',
    disclaimer: 'Rule-based demonstration score, not a certified clinical or medical diagnosis index.',
  });
});

// 4. Duty Plans
app.get('/api/duty-plans', (_req, res) => {
  res.json({
    success: true,
    count: demoDutyPlans.length,
    data: demoDutyPlans,
  });
});

app.post('/api/duty-plans/generate', (req, res) => {
  const { junctionId = 'pune-swargate', maxContinuousMin = 45, restDurationMin = 15, shiftHours = '11:00 – 15:00', shiftName = 'Generated Heat-Safe Rotation' } = req.body;

  const junction = demoJunctions.find((j: any) => j.id === junctionId) || demoJunctions[0];
  const maxContinuous = parseInt(maxContinuousMin, 10);
  const restDuration = parseInt(restDurationMin, 10);

  const flags: string[] = [];
  if (junction.riskCategory === 'High' && maxContinuous > 45) {
    flags.push(`Assignment exceeds continuous duty limit for High risk (${maxContinuous}m > 45m).`);
  }
  if (junction.riskCategory === 'High' && restDuration < 15) {
    flags.push(`Rest duration of ${restDuration}m is insufficient for High risk.`);
  }

  const newPlan = {
    id: `dp-gen-${Date.now()}`,
    junctionId: junction.id,
    junctionName: junction.name,
    shiftName,
    shiftHours,
    riskCategory: junction.riskCategory,
    personnelCount: junction.riskCategory === 'High' ? 6 : 4,
    hydrationTargetMlPerHour: junction.riskCategory === 'High' ? 650 : 450,
    restBreakIntervalMin: maxContinuous,
    rotationHours: 1.5,
    supervisorStatus: flags.length > 0 ? 'Action Required' : 'Approved',
    supervisorNotes: flags.length > 0 ? flags.join(' | ') : `Validated deterministic rotation: ${maxContinuous}m post / ${restDuration}m rest.`,
    flags,
    recommendations: [
      `Rotate marshals from asphalt signal island every ${maxContinuous} minutes.`,
      `Mandatory ${restDuration}-minute shaded rest with cold water/electrolyte intake.`,
      'Escalate to supervisor if ambient temperature exceeds 42°C.',
    ],
    tasks: [
      { id: 't-g-1', text: 'Pre-shift hydration briefing', completed: true, category: 'checkin' },
      { id: 't-g-2', text: `Enforce ${maxContinuous}m alternating rotation with relief marshal`, completed: false, category: 'rotation' },
    ],
  };

  demoDutyPlans.unshift(newPlan);
  res.json({ success: true, data: newPlan });
});

app.put('/api/duty-plans/:id', (req, res) => {
  const plan = demoDutyPlans.find((p: any) => p.id === req.params.id);
  if (!plan) return res.status(404).json({ success: false, error: 'Duty plan not found' });

  const { supervisorStatus, supervisorNotes, tasks } = req.body;
  if (supervisorStatus) plan.supervisorStatus = supervisorStatus;
  if (supervisorNotes) plan.supervisorNotes = supervisorNotes;
  if (tasks) plan.tasks = tasks;

  res.json({ success: true, data: plan });
});

// 5. Cooling Facilities
app.get('/api/facilities', (_req, res) => {
  res.json({
    success: true,
    count: demoCoolingPriorities.length,
    data: demoCoolingPriorities,
  });
});

app.put('/api/facilities/:id', (req, res) => {
  const item = demoCoolingPriorities.find((f: any) => f.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, error: 'Facility priority not found' });

  const { status, proposedAction } = req.body;
  if (status) item.status = status;
  if (proposedAction) item.proposedAction = proposedAction;
  item.lastUpdated = 'Just now (Supervisor update)';

  res.json({ success: true, data: item });
});

// 6. Reports and Analytics Summary
app.get('/api/reports/summary', (_req, res) => {
  const total = demoJunctions.length;
  const highCount = demoJunctions.filter((j: any) => j.riskCategory === 'High').length;
  const modCount = demoJunctions.filter((j: any) => j.riskCategory === 'Moderate').length;
  const lowCount = demoJunctions.filter((j: any) => j.riskCategory === 'Low').length;
  const avgScore = Math.round(demoJunctions.reduce((acc: number, j: any) => acc + j.riskScore, 0) / total);
  const avgTemp = Math.round((demoJunctions.reduce((acc: number, j: any) => acc + j.temp, 0) / total) * 10) / 10;
  const totalOfficers = demoJunctions.reduce((acc: number, j: any) => acc + j.vulnerableStaffCount, 0);

  res.json({
    success: true,
    summary: {
      totalJunctions: total,
      highRiskCount: highCount,
      moderateRiskCount: modCount,
      lowRiskCount: lowCount,
      averageRiskScore: avgScore,
      averageTemperature: avgTemp,
      totalAssignedOfficers: totalOfficers,
      coolingFacilitiesAttention: demoCoolingPriorities.filter((f: any) => f.status === 'Needed').length,
    },
    junctions: demoJunctions,
    coolingGaps: demoCoolingPriorities.filter((f: any) => f.status === 'Needed'),
    dataSource: 'Simulated Pune Telemetry - DEMO DATA',
    generatedAt: new Date().toISOString(),
  });
});

// 7. Assistant Status
app.get('/api/assistant/status', (_req, res) => {
  res.json({
    configured: isNugenConfigured,
    provider: 'Nugen API',
    model: NUGEN_MODEL,
    endpoint: NUGEN_API_ENDPOINT,
    activeEngine: isNugenConfigured ? `Nugen API (${NUGEN_MODEL})` : 'Awaiting NUGEN_API_KEY in .env',
    hasKey: isNugenConfigured,
    note: 'Nugen API is the sole permitted AI service. No secondary AI services permitted.',
    timestamp: new Date().toISOString(),
  });
});

// 8. Dedicated Nugen Connection Test
app.get('/api/assistant/test-connection', async (_req, res) => {
  if (!isNugenConfigured) {
    return res.status(400).json({
      success: false,
      configured: false,
      model: NUGEN_MODEL,
      message: 'NUGEN_API_KEY is not configured in backend environment (.env).',
      hint: 'Set NUGEN_API_KEY=your_actual_key in .env to connect with Nugen API.',
    });
  }

  try {
    const testResp = await fetch(`${NUGEN_API_ENDPOINT}/inference/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NUGEN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: NUGEN_MODEL,
        prompt: 'Respond with exactly: "HeatShield AI Nugen connection verified."',
        max_tokens: 50,
        temperature: 0.2,
        stream: false,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (testResp.status === 401) {
      return res.status(401).json({
        success: false,
        configured: true,
        model: NUGEN_MODEL,
        error: 'Nugen API returned 401 Unauthorized. The NUGEN_API_KEY in .env was rejected.',
        message: 'Invalid NUGEN_API_KEY. Please verify your credentials.',
      });
    }

    if (!testResp.ok) {
      const errText = await testResp.text();
      return res.status(502).json({
        success: false,
        configured: true,
        model: NUGEN_MODEL,
        error: `Nugen API error status ${testResp.status}`,
        details: errText.slice(0, 300),
      });
    }

    const data: any = await testResp.json();
    const reply = data.choices?.[0]?.text || data.choices?.[0]?.message?.content || data.generated_text || data.text || 'Connection verified.';

    return res.json({
      success: true,
      configured: true,
      model: NUGEN_MODEL,
      message: 'Successfully authenticated and connected with Nugen API!',
      sampleResponse: reply,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(502).json({
      success: false,
      configured: true,
      model: NUGEN_MODEL,
      error: `Network error connecting to Nugen API: ${err.message}`,
      message: 'Failed to contact Nugen API endpoint.',
    });
  }
});

// 9. Nugen AI Assistant Chat Handler
async function handleAssistantChat(req: express.Request, res: express.Response) {
  const { message, context, language = 'en' } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required and must be a non-empty string.' });
  }

  const langCode = (language === 'hi' || language === 'mr') ? language : 'en';

  if (!isNugenConfigured) {
    return res.status(503).json({
      success: false,
      configured: false,
      isAiPowered: false,
      error: 'NUGEN_API_KEY is not configured in backend environment (.env).',
      message: 'Nugen API credentials missing. Displaying standard Pune Traffic Police heat safety resources.',
      staticResources: STATIC_HEAT_SAFETY_RESOURCES,
    });
  }

  const langDirective = langCode === 'mr'
    ? 'IMPORTANT: Answer entirely in natural, clear Marathi (मराठी) using Devanagari script. Use appropriate administrative and safety terms for Pune traffic police.'
    : langCode === 'hi'
    ? 'IMPORTANT: Answer entirely in natural, clear Hindi (हिन्दी) using Devanagari script. Use clear terms suitable for traffic police officers.'
    : 'Answer in clear, concise, professional English suitable for public safety professionals.';

  const systemInstruction = `You are the HeatShield AI Safety Assistant, an occupational heat-risk and public-safety copilot specifically designed for Pune traffic police officers and supervisors on outdoor junction duty.

CORE RESPONSIBILITIES:
1. Provide actionable, practical heat-risk safety advice based strictly on supplied junction context.
2. Differentiate clearly between Heat Exhaustion (move to shade, ORS, cool wet towels) and Heatstroke (life-threatening emergency: call 108/112 immediately, aggressive cooling, do not force oral fluids if confused/unconscious).
3. Recommend safe duty rotation schedules (e.g. 40-45 min standing / 15 min shaded rest during High Risk).
4. Emphasize hydration targets: 350-500ml water or ORS every 20-30 minutes.

BOUNDARIES & SAFETY GUARDRAILS:
- Use supplied junction readings; do not invent sensor measurements or official alerts.
- Do not diagnose medical conditions.
- Never claim responses are official police department orders or statutory regulations.
- Never expose personal information about individual officers.
- Be concise, structured, respectful, and authoritative.

LANGUAGE REQUIREMENT:
${langDirective}`;

  let contextStr = '';
  if (context?.selectedJunction) {
    const sj = context.selectedJunction;
    contextStr += `\nSelected Junction: ${sj.name} (${sj.temp}°C, Humidity: ${sj.humidity}%, Risk: ${sj.riskScore}/100 - ${sj.riskCategory}, Shade: ${sj.shadePercent}%, Traffic: ${sj.traffic}, Water nearby: ${sj.drinkingWaterNearby})`;
  }
  if (context?.weather) {
    contextStr += `\nRegional Pune Ambient: ${context.weather.temperature}°C, Humidity: ${context.weather.humidity}%`;
  }

  const fullPrompt = `${systemInstruction}\n\nOPERATIONAL CONTEXT:${contextStr}\n\nOFFICER / SUPERVISOR INQUIRY:\n${message.trim()}`;

  try {
    const nugenResp = await fetch(`${NUGEN_API_ENDPOINT}/inference/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NUGEN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: NUGEN_MODEL,
        prompt: fullPrompt,
        max_tokens: 800,
        temperature: 0.5,
        stream: false,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (nugenResp.status === 401) {
      return res.status(401).json({
        success: false,
        configured: true,
        isAiPowered: false,
        error: 'Nugen API returned 401 Unauthorized. The NUGEN_API_KEY was rejected by api.nugen.in.',
        message: 'Invalid NUGEN_API_KEY. Displaying verified local heat safety SOPs.',
        staticResources: STATIC_HEAT_SAFETY_RESOURCES,
      });
    }

    if (!nugenResp.ok) {
      const errText = await nugenResp.text();
      return res.status(502).json({
        success: false,
        configured: true,
        isAiPowered: false,
        error: `Nugen API returned HTTP ${nugenResp.status}`,
        details: errText.slice(0, 300),
        staticResources: STATIC_HEAT_SAFETY_RESOURCES,
      });
    }

    const nugenData: any = await nugenResp.json();
    const replyText = nugenData.choices?.[0]?.text ??
      nugenData.choices?.[0]?.message?.content ??
      nugenData.generated_text ??
      nugenData.text ??
      '';

    if (!replyText.trim()) {
      return res.status(502).json({
        success: false,
        configured: true,
        isAiPowered: false,
        error: 'Nugen returned an empty response.',
        staticResources: STATIC_HEAT_SAFETY_RESOURCES,
      });
    }

    return res.json({
      success: true,
      configured: true,
      isAiPowered: true,
      reply: replyText.trim(),
      source: `Nugen API (${NUGEN_MODEL})`,
      model: NUGEN_MODEL,
      language: langCode,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(502).json({
      success: false,
      configured: true,
      isAiPowered: false,
      error: `Nugen API request failed: ${err.message}`,
      message: 'Network error contacting Nugen. Displaying offline heat safety SOPs.',
      staticResources: STATIC_HEAT_SAFETY_RESOURCES,
    });
  }
}

app.post('/api/assistant/chat', handleAssistantChat);
app.post('/api/ai/chat', handleAssistantChat);

// Simulated Weather Lookup endpoint (pure simulated Pune data, NO external weather APIs)
app.get('/api/weather/lookup', (req, res) => {
  const city = (req.query.city as string) || 'Pune, Maharashtra, India';
  res.json({
    success: true,
    source: 'Simulated Baseline (Pune Traffic Prototype) - DEMO DATA',
    isLive: false,
    location: {
      name: city,
      lat: 18.5204,
      lon: 73.8567,
    },
    temperature: 38.4,
    apparentTemperature: 43.1,
    humidity: 50,
    windSpeed: 11,
    uvIndex: 9,
    weatherCode: 1,
    updatedAt: new Date().toISOString(),
    notice: 'Displaying calibrated Pune baseline telemetry (simulated).',
  });
});

// ========================================================
// STATIC SERVING & VITE SPA MOUNT
// ========================================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, 'localhost', () => {
    console.log(`[HeatShield AI] Server listening on http://localhost:${port}`);
  });
}

startServer();
