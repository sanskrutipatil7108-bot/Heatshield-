export type Language = 'en' | 'hi' | 'mr';

export interface TranslationDictionary {
  // Brand & Header
  appName: string;
  appSubtitle: string;
  departmentTag: string;
  demoDataBadge: string;
  liveDataBadge: string;
  unavailableDataBadge: string;

  // Navigation Tabs (9 required)
  tabDashboard: string;
  tabMap: string;
  tabMonitoring: string;
  tabPrediction: string;
  tabDutyPlanner: string;
  tabCooling: string;
  tabAiAssistant: string;
  tabAnalytics: string;
  tabSafetyGuide: string;
  tabSettings: string;
  tabSettingsAbout: string;

  // Junction Monitoring
  monitoringTitle: string;
  monitoringSubtitle: string;
  demoDataNotice: string;
  editReadings: string;
  compareJunctions: string;
  outdoorDutyDuration: string;

  // Common Actions
  refresh: string;
  exportCsv: string;
  printReport: string;
  saveChanges: string;
  cancel: string;
  delete: string;
  edit: string;
  add: string;
  search: string;
  filterAll: string;
  status: string;
  lastUpdated: string;
  actions: string;
  viewDetails: string;
  close: string;
  confirm: string;

  // Risk Levels
  riskLow: string;
  riskModerate: string;
  riskHigh: string;
  riskScore: string;
  riskCategory: string;

  // Metrics
  temperature: string;
  humidity: string;
  apparentTemp: string;
  windSpeed: string;
  trafficLevel: string;
  shadeCover: string;
  officersCount: string;
  activeAlerts: string;

  // Traffic levels
  trafficNormal: string;
  trafficModerate: string;
  trafficHeavy: string;
  trafficGridlock: string;

  // Dashboard Page
  dashboardTitle: string;
  dashboardSubtitle: string;
  totalJunctions: string;
  lowRiskCount: string;
  modRiskCount: string;
  highRiskCount: string;
  currentTemp: string;
  currentHumidity: string;
  avgRiskScoreCard: string;
  officersAssignedCard: string;
  coolingAttentionCard: string;
  alertsPanelTitle: string;
  junctionTableTitle: string;
  tempComparisonTitle: string;
  riskComparisonTitle: string;
  riskDistributionTitle: string;
  tempTrendTitle: string;
  quickActionsTitle: string;
  actionViewMap: string;
  actionPredict: string;
  actionPlanDuty: string;
  actionCooling: string;
  actionAskAi: string;

  // Heat Risk Map Page
  mapTitle: string;
  mapSubtitle: string;
  searchJunctionsPlaceholder: string;
  mapLegendTitle: string;
  viewListAlternative: string;
  viewMapAlternative: string;
  junctionDetailsTitle: string;
  riskExplanation: string;
  suggestedPrecautions: string;
  hydrationRecommendation: string;
  facilityNeeds: string;
  planDutyForJunction: string;

  // Heat Risk Prediction Page
  predictionTitle: string;
  predictionSubtitle: string;
  selectJunctionLabel: string;
  sunExposureLabel: string;
  sunDirect: string;
  sunGlaze: string;
  sunPartial: string;
  sunOvercast: string;
  windCalm: string;
  windLight: string;
  windModerate: string;
  windHigh: string;
  calculateButton: string;
  calculating: string;
  predictionResultTitle: string;
  factorsBreakdownTitle: string;
  recommendationsTitle: string;
  previousPredictionsTitle: string;
  clearHistory: string;
  modelDisclaimer: string;

  // Smart Duty Planner Page
  dutyPlannerTitle: string;
  dutyPlannerSubtitle: string;
  autoPlanButton: string;
  addAssignmentButton: string;
  filterByOfficer: string;
  filterByJunction: string;
  filterByShift: string;
  shiftMorning: string;
  shiftPeakAfternoon: string;
  shiftLateAfternoon: string;
  shiftNight: string;
  dutyDuration: string;
  rotationInterval: string;
  breakSchedule: string;
  officerName: string;
  badgeNumber: string;
  healthProfile: string;
  healthNormal: string;
  healthHeatSensitive: string;
  recommendedHydration: string;
  suggestedRest: string;
  statusApproved: string;
  statusPending: string;
  statusActionRequired: string;
  dutyDisclaimer: string;

  // Cooling Facilities Page
  coolingTitle: string;
  coolingSubtitle: string;
  facilityShade: string;
  facilityWater: string;
  facilityRest: string;
  facilityMisting: string;
  urgencyImmediate: string;
  urgencyHigh: string;
  urgencyScheduled: string;
  existingFacilities: string;
  missingFacilities: string;
  priorityLevel: string;
  updateStatus: string;
  facilityComparisonTitle: string;

  // AI Safety Assistant Page
  aiTitle: string;
  aiSubtitle: string;
  nugenActiveBadge: string;
  nugenSandboxBadge: string;
  askAssistantPlaceholder: string;
  sendQuestion: string;
  clearChat: string;
  suggestedQuestionsTitle: string;
  qHighRisk: string;
  qHeatstroke: string;
  qHydration: string;
  qPrecautions: string;
  emergencyNotice: string;
  nugenConfigNotice: string;

  // Analytics and Reports Page
  analyticsTitle: string;
  analyticsSubtitle: string;
  timeRangeToday: string;
  timeRange3Days: string;
  timeRangeWeek: string;
  executiveSummaryTitle: string;
  highestRiskHotspotsTitle: string;
  observedTrendsTitle: string;
  suggestedInterventionsTitle: string;
  exportCsvReport: string;
  printPdfReport: string;

  // Heat Safety Guide Page
  guideTitle: string;
  guideSubtitle: string;
  secBeforeDuty: string;
  secDuringDuty: string;
  secHydrationRest: string;
  secWarningSigns: string;
  secEmergencyResponse: string;
  secAfterDuty: string;
  emergencyCallBanner: string;

  // Settings Page
  settingsTitle: string;
  settingsSubtitle: string;
  prefLanguage: string;
  prefTheme: string;
  themeLight: string;
  themeDark: string;
  themeHighContrast: string;
  prefUnit: string;
  unitCelsius: string;
  unitFahrenheit: string;
  prefAlertThreshold: string;
  prefNotifications: string;
  prefDataSource: string;
  sourceSimulated: string;
  sourceLive: string;
  systemDiagnostics: string;
  resetDemoData: string;
  aboutHeatShield: string;
  appVersion: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'HeatShield AI',
    appSubtitle: 'Traffic Police Heat Risk Monitoring & Smart Duty Planner',
    departmentTag: 'Traffic Police Public Safety System',
    demoDataBadge: 'SIMULATED DATA (Pune Traffic)',
    liveDataBadge: 'LIVE WEATHER DATA',
    unavailableDataBadge: 'METEOROLOGICAL DATA UNAVAILABLE',

    tabDashboard: 'Dashboard',
    tabMap: 'Heat Risk Map',
    tabMonitoring: 'Junction Monitoring',
    tabPrediction: 'Heat Risk Prediction',
    tabDutyPlanner: 'Smart Duty Planner',
    tabCooling: 'Cooling Facilities',
    tabAiAssistant: 'AI Safety Assistant',
    tabAnalytics: 'Analytics and Reports',
    tabSafetyGuide: 'Heat Safety Guide',
    tabSettings: 'Settings',
    tabSettingsAbout: 'Settings and About',

    monitoringTitle: 'Simulated Junction Monitoring Grid',
    monitoringSubtitle: 'Real-time inspection of environmental heat stress, traffic intensity, outdoor duty duration, and cooling facility availability across Pune demonstration junctions.',
    demoDataNotice: 'DEMO DATA: Explicitly simulated records for Pune traffic demonstration.',
    editReadings: 'Edit Simulated Readings',
    compareJunctions: 'Compare Junctions',
    outdoorDutyDuration: 'Continuous Duty Duration',

    refresh: 'Refresh Data',
    exportCsv: 'Export CSV',
    printReport: 'Print Report / PDF',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add New',
    search: 'Search...',
    filterAll: 'All Locations',
    status: 'Status',
    lastUpdated: 'Last Updated',
    actions: 'Actions',
    viewDetails: 'View Details',
    close: 'Close',
    confirm: 'Confirm',

    riskLow: 'LOW RISK',
    riskModerate: 'MODERATE RISK',
    riskHigh: 'HIGH RISK',
    riskScore: 'Risk Score',
    riskCategory: 'Risk Category',

    temperature: 'Temperature',
    humidity: 'Relative Humidity',
    apparentTemp: 'Feels Like',
    windSpeed: 'Wind Speed',
    trafficLevel: 'Traffic Density',
    shadeCover: 'Canopy Shade',
    officersCount: 'Assigned Officers',
    activeAlerts: 'Active Heat Alerts',

    trafficNormal: 'Normal Traffic',
    trafficModerate: 'Moderate Traffic',
    trafficHeavy: 'Heavy Traffic',
    trafficGridlock: 'Gridlock (High Engine Heat)',

    dashboardTitle: 'Traffic Junction Heat Monitoring Dashboard',
    dashboardSubtitle: 'Real-time urban microclimate thermal stress indicators and operational safety status across Pune intersections.',
    totalJunctions: 'Monitored Junctions',
    lowRiskCount: 'Low-Risk Junctions',
    modRiskCount: 'Moderate-Risk Junctions',
    highRiskCount: 'High-Risk Junctions',
    currentTemp: 'Ambient Temp',
    currentHumidity: 'Air Humidity',
    avgRiskScoreCard: 'Average Risk Score',
    officersAssignedCard: 'Officers on Outdoor Duty',
    coolingAttentionCard: 'Cooling Attention Required',
    alertsPanelTitle: 'High-Priority Heat Alerts & Safety Notices',
    junctionTableTitle: 'Pune Traffic Junction Real-Time Heat Radar',
    tempComparisonTitle: 'Junction Temperature Comparison (°C)',
    riskComparisonTitle: 'Heat Risk Score Comparison (0–100)',
    riskDistributionTitle: 'Risk Category Distribution',
    tempTrendTitle: '24-Hour Diurnal Heat & Humidity Forecast',
    quickActionsTitle: 'Quick Operational Actions',
    actionViewMap: 'Open Heat Map',
    actionPredict: 'Calculate Heat Risk',
    actionPlanDuty: 'Create Duty Plan',
    actionCooling: 'View Cooling Needs',
    actionAskAi: 'Ask AI Safety Assistant',

    mapTitle: 'Interactive Traffic Junction Heat Risk Map',
    mapSubtitle: 'Geographic visualization of thermal hotspots across Pune city intersections with microclimate risk levels.',
    searchJunctionsPlaceholder: 'Search junction by name or neighborhood...',
    mapLegendTitle: 'Heat Risk Classification Legend',
    viewListAlternative: 'Switch to Table View',
    viewMapAlternative: 'Switch to Interactive Map',
    junctionDetailsTitle: 'Junction Heat Profile & Safety Protocols',
    riskExplanation: 'Microclimate Risk Factors',
    suggestedPrecautions: 'Mandatory Duty Precautions',
    hydrationRecommendation: 'Hydration & Rest Interval',
    facilityNeeds: 'Cooling Facility Requirements',
    planDutyForJunction: 'Plan Duty Roster for this Junction',

    predictionTitle: 'Heat Risk Calculator & Predictive Scoring',
    predictionSubtitle: 'Simulate microclimate weather variables and calculate expected heat-risk scores for outdoor traffic duty.',
    selectJunctionLabel: 'Select Junction for Simulation',
    sunExposureLabel: 'Sun Exposure & Solar Radiation',
    sunDirect: 'Direct Intense Sunlight (Peak Load)',
    sunGlaze: 'Afternoon Glare / Direct Exposure',
    sunPartial: 'Partial Sun / Filtered Light',
    sunOvercast: 'Overcast / Cloudy',
    windCalm: 'Calm (< 5 km/h)',
    windLight: 'Light Breeze (5–15 km/h)',
    windModerate: 'Moderate Wind (15–25 km/h)',
    windHigh: 'Strong Breeze (> 25 km/h)',
    calculateButton: 'Calculate Heat Risk Score',
    calculating: 'Evaluating Microclimate Factors...',
    predictionResultTitle: 'Heat Risk Evaluation Result',
    factorsBreakdownTitle: 'Explainable Score Factors Breakdown',
    recommendationsTitle: 'Operational Safety Guidance',
    previousPredictionsTitle: 'Session Calculation History',
    clearHistory: 'Clear History',
    modelDisclaimer: 'Transparent Demonstration Scoring Model: Integrates ambient temperature, relative humidity, asphalt urban heat island re-radiation, and shade mitigation. Calibrated for demonstration purposes.',

    dutyPlannerTitle: 'Smart Duty Rotation & Break Planner',
    dutyPlannerSubtitle: 'Safety-first scheduling module for traffic police supervisors to rotate personnel away from dangerous heat exposure.',
    autoPlanButton: 'Auto-Plan Safe Rotation Schedule',
    addAssignmentButton: 'Add Officer Duty Shift',
    filterByOfficer: 'All Officers',
    filterByJunction: 'All Junctions',
    filterByShift: 'All Shifts',
    shiftMorning: 'Morning Shift (07:00 – 11:00)',
    shiftPeakAfternoon: 'Peak Heat Midday Shift (11:00 – 15:00)',
    shiftLateAfternoon: 'Late Afternoon Shift (15:00 – 19:00)',
    shiftNight: 'Evening / Night Shift (19:00 – 23:00)',
    dutyDuration: 'Duty Duration',
    rotationInterval: 'Rotation Interval',
    breakSchedule: 'Rest Break Duration',
    officerName: 'Officer Name',
    badgeNumber: 'Badge Number',
    healthProfile: 'Health Sensitivity Profile',
    healthNormal: 'Standard Tolerance',
    healthHeatSensitive: 'Heat Sensitive / Senior Marshal',
    recommendedHydration: 'Hydration Target',
    suggestedRest: 'Rest Break Protocol',
    statusApproved: 'Approved',
    statusPending: 'Pending Review',
    statusActionRequired: 'Action Required',
    dutyDisclaimer: 'Notice: Suggested duty rotations provide heat-safety guidelines and do not replace official department policies or supervisor approval.',

    coolingTitle: 'Cooling Facilities Priority & Municipal Needs',
    coolingSubtitle: 'Identify and rank high-risk traffic signals needing shade shelters, chilled drinking water, and misting fans.',
    facilityShade: 'Shade Canopy / Sun Awning',
    facilityWater: 'Drinking Water Kiosk / Dispenser',
    facilityRest: 'Air-Cooled Rest Cabin',
    facilityMisting: 'High-Pressure Water Misting Fan',
    urgencyImmediate: 'Immediate (24–48 Hours)',
    urgencyHigh: 'High Priority (3–5 Days)',
    urgencyScheduled: 'Scheduled (10 Days)',
    existingFacilities: 'Installed Facilities',
    missingFacilities: 'Missing / Needed Upgrades',
    priorityLevel: 'Intervention Priority',
    updateStatus: 'Update Facility Status',
    facilityComparisonTitle: 'Facility Needs vs Risk Correlation',

    aiTitle: 'AI Heat Safety Assistant (Powered by Nugen API)',
    aiSubtitle: 'Occupational health co-pilot providing heatstroke prevention, hydration rules, and emergency guidelines for traffic marshals.',
    nugenActiveBadge: 'Nugen API Connected',
    nugenSandboxBadge: 'Nugen API Architecture Sandbox',
    askAssistantPlaceholder: 'Ask about hydration, heatstroke symptoms, duty rotations, or junction precautions...',
    sendQuestion: 'Send Question',
    clearChat: 'Clear Conversation',
    suggestedQuestionsTitle: 'Frequently Asked Safety Questions',
    qHighRisk: 'What should I do during high heat risk?',
    qHeatstroke: 'What are the warning signs of heatstroke?',
    qHydration: 'When should I take a hydration break?',
    qPrecautions: 'What precautions should I take at Swargate Junction?',
    emergencyNotice: 'Emergency Warning: If an officer exhibits confusion, lack of sweating, or fainting, move immediately to shade, apply cold water, and call 112 / 108.',
    nugenConfigNotice: 'Nugen API Integration Layer active. Set NUGEN_API_KEY in your environment for direct LLM inference.',

    analyticsTitle: 'Analytics, Reports & Heat Vulnerability Insights',
    analyticsSubtitle: 'Longitudinal heat indices, risk distribution trends, and exportable operational reports for municipal supervisors.',
    timeRangeToday: 'Today (Real-Time)',
    timeRange3Days: '3-Day Outlook',
    timeRangeWeek: '7-Day Summary',
    executiveSummaryTitle: 'Executive Heat Hazard Summary',
    highestRiskHotspotsTitle: 'Most Vulnerable Traffic Junctions',
    observedTrendsTitle: 'Observed Microclimate Trends',
    suggestedInterventionsTitle: 'Recommended Interventions for Police Leadership',
    exportCsvReport: 'Download CSV Report',
    printPdfReport: 'Print / Export PDF Report',

    guideTitle: 'Traffic Police Heat Safety & First-Aid Guide',
    guideSubtitle: 'Practical occupational health handbook for outdoor traffic police officers working in extreme summer conditions.',
    secBeforeDuty: '1. Before Starting Duty (Preparation & Gear)',
    secDuringDuty: '2. During Hot Weather (On-Road Safety Protocols)',
    secHydrationRest: '3. Hydration & Shaded Rest Intervals',
    secWarningSigns: '4. Warning Signs of Heat-Related Illness',
    secEmergencyResponse: '5. Emergency First-Aid Protocols (Call 112 / 108)',
    secAfterDuty: '6. After Completing Duty (Recovery & Health Checks)',
    emergencyCallBanner: 'MEDICAL EMERGENCY HOTLINE: Dial 112 or 108 immediately for suspected heatstroke.',

    settingsTitle: 'System Settings & Operational Preferences',
    settingsSubtitle: 'Configure language, visual display themes, measurement units, and telemetry data sources.',
    prefLanguage: 'Interface Language',
    prefTheme: 'Display Theme (Light / Dark Mode)',
    themeLight: 'Light Theme',
    themeDark: 'Dark Theme',
    themeHighContrast: 'High Contrast Mode',
    prefUnit: 'Temperature Display Unit',
    unitCelsius: 'Celsius (°C)',
    unitFahrenheit: 'Fahrenheit (°F)',
    prefAlertThreshold: 'High Risk Alert Threshold (0–100)',
    prefNotifications: 'Heat Risk Audio & Visual Alerts',
    prefDataSource: 'Weather Data Stream Mode',
    sourceSimulated: 'Simulated Baseline (Pune Traffic Prototype)',
    sourceLive: 'Open-Meteo Live API Stream',
    systemDiagnostics: 'System Connectivity & Storage Diagnostics',
    resetDemoData: 'Reset Demonstration Data',
    aboutHeatShield: 'About HeatShield AI',
    appVersion: 'HeatShield AI v2.4 (Production Release)',
  },

  hi: {
    appName: 'हीटशील्ड एआई',
    appSubtitle: 'ट्रैफिक पुलिस हीट रिस्क मॉनिटरिंग और स्मार्ट ड्यूटी प्लानर',
    departmentTag: 'ट्रैफिक पुलिस सार्वजनिक सुरक्षा प्रणाली',
    demoDataBadge: 'सिम्युलेटेड डेटा (पुणे ट्रैफिक)',
    liveDataBadge: 'लाइव मौसम डेटा',
    unavailableDataBadge: 'मौसम डेटा अनुपलब्ध',

    tabDashboard: 'डैशबोर्ड',
    tabMap: 'हीट रिस्क मैप',
    tabMonitoring: 'जंक्शन मॉनिटरिंग',
    tabPrediction: 'गर्मी के जोखिम का अनुमान',
    tabDutyPlanner: 'स्मार्ट ड्यूटी प्लानर',
    tabCooling: 'शीतलन सुविधाएँ',
    tabAiAssistant: 'एआई सुरक्षा सहायक',
    tabAnalytics: 'विश्लेषण और रिपोर्ट',
    tabSafetyGuide: 'हीट सुरक्षा गाइड',
    tabSettings: 'सेटिंग्स',
    tabSettingsAbout: 'सेटिंग्स व परिचय',

    monitoringTitle: 'सिम्युलेटेड जंक्शन मॉनिटरिंग ग्रिड',
    monitoringSubtitle: 'पुणे के प्रदर्शन चौराहों पर पर्यावरणीय ताप तनाव, ट्रैफिक घनत्व, आउटडोर ड्यूटी अवधि और कूलिंग सुविधाओं का वास्तविक समय निरीक्षण।',
    demoDataNotice: 'डेमो डेटा: पुणे ट्रैफिक प्रदर्शन हेतु सिम्युलेटेड रिकॉर्ड।',
    editReadings: 'सिम्युलेटेड रीडिंग्स संपादित करें',
    compareJunctions: 'जंक्शन तुलना करें',
    outdoorDutyDuration: 'आउटडोर ड्यूटी अवधि',

    refresh: 'डेटा रिफ्रेश करें',
    exportCsv: 'सीएसवी डाउनलोड',
    printReport: 'रिपोर्ट प्रिंट / पीडीएफ',
    saveChanges: 'बदलाव सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    add: 'नया जोड़ें',
    search: 'खोजें...',
    filterAll: 'सभी स्थान',
    status: 'स्थिति',
    lastUpdated: 'अंतिम अपडेट',
    actions: 'कार्रवाई',
    viewDetails: 'विवरण देखें',
    close: 'बंद करें',
    confirm: 'पुष्टि करें',

    riskLow: 'कम जोखिम',
    riskModerate: 'मध्यम जोखिम',
    riskHigh: 'उच्च जोखिम',
    riskScore: 'जोखिम स्कोर',
    riskCategory: 'जोखिम श्रेणी',

    temperature: 'तापमान',
    humidity: 'सापेक्ष आर्द्रता',
    apparentTemp: 'अनुभूत तापमान',
    windSpeed: 'हवा की गति',
    trafficLevel: 'ट्रैफिक घनत्व',
    shadeCover: 'छाया कवरेज',
    officersCount: 'तैनात पुलिसकर्मी',
    activeAlerts: 'सक्रिय हीट अलर्ट',

    trafficNormal: 'सामान्य ट्रैफिक',
    trafficModerate: 'मध्यम ट्रैफिक',
    trafficHeavy: 'भारी ट्रैफिक',
    trafficGridlock: 'गंभीर जाम (अत्यधिक इंजन गर्मी)',

    dashboardTitle: 'ट्रैफिक जंक्शन हीट मॉनिटरिंग डैशबोर्ड',
    dashboardSubtitle: 'पुणे शहर के प्रमुख चौराहों पर वास्तविक समय का तापमान, आर्द्रता और पुलिसकर्मियों के लिए सुरक्षा स्थिति।',
    totalJunctions: 'कुल निगरानी वाले जंक्शन',
    lowRiskCount: 'कम जोखिम वाले चौराहे',
    modRiskCount: 'मध्यम जोखिम वाले चौराहे',
    highRiskCount: 'उच्च जोखिम वाले चौराहे',
    currentTemp: 'औसत तापमान',
    currentHumidity: 'हवा में नमी',
    avgRiskScoreCard: 'औसत हीट रिस्क स्कोर',
    officersAssignedCard: 'आउटडोर ड्यूटी पर तैनात पुलिसकर्मी',
    coolingAttentionCard: 'शीतलन सुविधा की आवश्यकता',
    alertsPanelTitle: 'उच्च प्राथमिकता हीट अलर्ट और निर्देश',
    junctionTableTitle: 'पुणे ट्रैफिक जंक्शन हीट रडार तालिका',
    tempComparisonTitle: 'जंक्शन तापमान तुलना (°C)',
    riskComparisonTitle: 'हीट रिस्क स्कोर तुलना (0–100)',
    riskDistributionTitle: 'जोखिम श्रेणी वितरण',
    tempTrendTitle: '24 घंटे का तापमान और आर्द्रता पूर्वानुमान',
    quickActionsTitle: 'त्वरित परिचालन कार्य',
    actionViewMap: 'हीट मैप देखें',
    actionPredict: 'जोखिम की गणना करें',
    actionPlanDuty: 'ड्यूटी प्लान बनाएं',
    actionCooling: 'शीतलन सुविधाएं देखें',
    actionAskAi: 'एआई सहायक से पूछें',

    mapTitle: 'इंटरैक्टिव ट्रैफिक जंक्शन हीट रिस्क मैप',
    mapSubtitle: 'पुणे शहर के चौराहों का भौगोलिक हीट मानचित्र और माइक्रोक्लाइमेट जोखिम स्तर।',
    searchJunctionsPlaceholder: 'चौराहे या इलाके का नाम खोजें...',
    mapLegendTitle: 'हीट रिस्क वर्गीकरण संकेतक',
    viewListAlternative: 'तालिका दृश्य देखें',
    viewMapAlternative: 'इंटरैक्टिव मैप देखें',
    junctionDetailsTitle: 'जंक्शन हीट प्रोफाइल और सुरक्षा नियम',
    riskExplanation: 'गर्मी के मुख्य कारण',
    suggestedPrecautions: 'अनिवार्य सुरक्षा सावधानियां',
    hydrationRecommendation: 'पानी और विश्राम का अंतराल',
    facilityNeeds: 'शीतलन सुविधा की आवश्यकता',
    planDutyForJunction: 'इस जंक्शन के लिए ड्यूटी बनाएं',

    predictionTitle: 'हीट रिस्क कैलकुलेटर और अनुमान',
    predictionSubtitle: 'मौसम कारकों (तापमान, आर्द्रता, धूप, ट्रैफिक) को बदलकर सड़क ड्यूटी के लिए हीट रिस्क स्कोर की गणना करें।',
    selectJunctionLabel: 'सिम्युलेशन के लिए जंक्शन चुनें',
    sunExposureLabel: 'धूप और सौर विकिरण की स्थिति',
    sunDirect: 'सीधी तेज धूप (अधिकतम प्रभाव)',
    sunGlaze: 'दोपहर की कड़ी धूप',
    sunPartial: 'आंशिक धूप / छांव',
    sunOvercast: 'बादल / छांव',
    windCalm: 'शांत हवा (< 5 किमी/घंटा)',
    windLight: 'हल्की हवा (5–15 किमी/घंटा)',
    windModerate: 'मध्यम हवा (15–25 किमी/घंटा)',
    windHigh: 'तेज हवा (> 25 किमी/घंटा)',
    calculateButton: 'हीट रिस्क स्कोर की गणना करें',
    calculating: 'मौसम कारकों का विश्लेषण जारी है...',
    predictionResultTitle: 'हीट रिस्क मूल्यांकन परिणाम',
    factorsBreakdownTitle: 'स्कोर को प्रभावित करने वाले कारक',
    recommendationsTitle: 'व्यावहारिक सुरक्षा सिफारिशें',
    previousPredictionsTitle: 'पिछली गणनाओं का इतिहास',
    clearHistory: 'इतिहास मिटाएं',
    modelDisclaimer: 'पारदर्शी प्रदर्शन स्कोरिंग मॉडल: यह मॉडल परिवेशीय तापमान, सापेक्ष आर्द्रता, डामर की गर्मी और छाया छूट का उपयोग करता है। यह एक सिम्युलेटेड प्रदर्शन मॉडल है।',

    dutyPlannerTitle: 'स्मार्ट ड्यूटी रोटेशन और विश्राम प्लानर',
    dutyPlannerSubtitle: 'ट्रैफिक पुलिस पर्यवेक्षकों के लिए हीट-सुरक्षित शिफ्ट रोस्टर और रोटेशन प्रबंधन।',
    autoPlanButton: 'सुरक्षित रोटेशन प्लान स्वतः बनाएं',
    addAssignmentButton: 'नई ड्यूटी शिफ्ट जोड़ें',
    filterByOfficer: 'सभी पुलिसकर्मी',
    filterByJunction: 'सभी जंक्शन',
    filterByShift: 'सभी शिफ्ट',
    shiftMorning: 'सुबह की शिफ्ट (07:00 – 11:00)',
    shiftPeakAfternoon: 'दोपहर भीषण गर्मी शिफ्ट (11:00 – 15:00)',
    shiftLateAfternoon: 'दोपहर बाद की शिफ्ट (15:00 – 19:00)',
    shiftNight: 'शाम / रात्रि शिफ्ट (19:00 – 23:00)',
    dutyDuration: 'ड्यूटी अवधि',
    rotationInterval: 'रोटेशन अंतराल',
    breakSchedule: 'विश्राम ब्रेक अवधि',
    officerName: 'पुलिसकर्मी का नाम',
    badgeNumber: 'बैज नंबर',
    healthProfile: 'स्वास्थ्य संवेदनशीलता',
    healthNormal: 'सामान्य सहनशीलता',
    healthHeatSensitive: 'गर्मी के प्रति संवेदनशील / वरिष्ठ',
    recommendedHydration: 'पानी पीने का लक्ष्य',
    suggestedRest: 'विश्राम प्रोटोकॉल',
    statusApproved: 'स्वीकृत',
    statusPending: 'समीक्षाधीन',
    statusActionRequired: 'कार्रवाई आवश्यक',
    dutyDisclaimer: 'सूचना: यह ड्यूटी प्लान हीट-सुरक्षा दिशानिर्देश प्रदान करता है और आधिकारिक विभागीय नियमों का विकल्प नहीं है।',

    coolingTitle: 'शीतलन सुविधाएं प्राथमिकता और नगर निगम मांग',
    coolingSubtitle: 'छायादार शेड, ठंडा पेयजल और मिस्टिंग पंखों की आवश्यकता वाले उच्च-जोखिम चौराहों की सूची।',
    facilityShade: 'छायादार शेड / धूप शेल्टर',
    facilityWater: 'ठंडा पेयजल कियोस्क / आरओ',
    facilityRest: 'एयर-कूल्ड विश्राम केबिन',
    facilityMisting: 'वाटर मिस्टिंग पंखा / स्प्रे',
    urgencyImmediate: 'अतिशीघ्र (24–48 घंटे)',
    urgencyHigh: 'उच्च प्राथमिकता (3–5 दिन)',
    urgencyScheduled: 'नियोजित (10 दिन)',
    existingFacilities: 'वर्तमान में उपलब्ध सुविधाएं',
    missingFacilities: 'आवश्यक अतिरिक्त सुविधाएं',
    priorityLevel: 'प्राथमिकता स्तर',
    updateStatus: 'सुविधा स्थिति अपडेट करें',
    facilityComparisonTitle: 'सुविधा आवश्यकता बनाम जोखिम संबंध',

    aiTitle: 'एआई सुरक्षा सहायक (न्यूजेन एपीआई संचालित)',
    aiSubtitle: 'ट्रैफिक पुलिसकर्मियों के लिए हीटस्ट्रोक रोकथाम, जलयोजन और आपातकालीन सहायता कोपायलट।',
    nugenActiveBadge: 'न्यूजेन एपीआई सक्रिय',
    nugenSandboxBadge: 'न्यूजेन एपीआई आर्किटेक्चर सैंडबॉक्स',
    askAssistantPlaceholder: 'पानी पीने, हीटस्ट्रोक के लक्षण, ड्यूटी रोटेशन या जंक्शन सुरक्षा के बारे में पूछें...',
    sendQuestion: 'प्रश्न भेजें',
    clearChat: 'बातचीत साफ करें',
    suggestedQuestionsTitle: 'अक्सर पूछे जाने वाले सुरक्षा प्रश्न',
    qHighRisk: 'उच्च हीट रिस्क के दौरान क्या करना चाहिए?',
    qHeatstroke: 'हीटस्ट्रोक (लू) के चेतावनी संकेत क्या हैं?',
    qHydration: 'पानी पीने का ब्रेक कब लेना चाहिए?',
    qPrecautions: 'स्वारगेट जंक्शन पर क्या सावधानियां बरतनी चाहिए?',
    emergencyNotice: 'आपातकालीन चेतावनी: यदि किसी साथी को चक्कर आए, पसीना आना बंद हो या बेहोशी हो, तो तुरंत छाया में ले जाएं, ठंडा पानी डालें और 112 / 108 डायल करें।',
    nugenConfigNotice: 'न्यूजेन एपीआई लेयर सक्रिय है। सीधे एलएलएम उत्तरों के लिए अपने वातावरण में NUGEN_API_KEY सेट करें।',

    analyticsTitle: 'विश्लेषण, रिपोर्ट और हीट डेटा इनसाइट्स',
    analyticsSubtitle: 'दीर्घकालिक हीट रुझान, जोखिम वितरण और पर्यवेक्षकों के लिए डाउनलोड योग्य रिपोर्ट।',
    timeRangeToday: 'आज (लाइव)',
    timeRange3Days: '3 दिन का पूर्वानुमान',
    timeRangeWeek: '7 दिन का सारांश',
    executiveSummaryTitle: 'कार्यकारी हीट सारांश',
    highestRiskHotspotsTitle: 'सर्वाधिक जोखिम वाले ट्रैफिक चौराहे',
    observedTrendsTitle: 'देखे गए माइक्रोक्लाइमेट रुझान',
    suggestedInterventionsTitle: 'पुलिस नेतृत्व के लिए अनुशंसित हस्तक्षेप',
    exportCsvReport: 'सीएसवी रिपोर्ट डाउनलोड करें',
    printPdfReport: 'प्रिंट / पीडीएफ रिपोर्ट',

    guideTitle: 'ट्रैफिक पुलिस हीट सेफ्टी और प्राथमिक उपचार गाइड',
    guideSubtitle: 'कड़ी धूप और गर्मी में तैनात ट्रैफिक पुलिसकर्मियों के लिए व्यावहारिक स्वास्थ्य नियम पुस्तिका।',
    secBeforeDuty: '1. ड्यूटी शुरू करने से पहले (तैयारी और वर्दी)',
    secDuringDuty: '2. तेज धूप में ड्यूटी के दौरान (सड़क पर सावधानियां)',
    secHydrationRest: '3. पानी पीना और छाया में विश्राम अंतराल',
    secWarningSigns: '4. गर्मी से होने वाली बीमारियों के चेतावनी लक्षण',
    secEmergencyResponse: '5. आपातकालीन प्राथमिक उपचार प्रोटोकॉल (112 / 108)',
    secAfterDuty: '6. ड्यूटी पूरी होने के बाद (विश्राम और रिकवरी)',
    emergencyCallBanner: 'चिकित्सा आपातकालीन नंबर: हीटस्ट्रोक की स्थिति में तुरंत 112 या 108 पर कॉल करें।',

    settingsTitle: 'सिस्टम सेटिंग्स और प्राथमिकताएं',
    settingsSubtitle: 'भाषा, थीम (लाइट/डार्क मोड), तापमान इकाई और डेटा स्रोत सेट करें।',
    prefLanguage: 'इंटरफ़ेस भाषा',
    prefTheme: 'थीम मोड (लाइट / डार्क)',
    themeLight: 'लाइट मोड',
    themeDark: 'डार्क मोड',
    themeHighContrast: 'उच्च कंट्रास्ट मोड',
    prefUnit: 'तापमान इकाई',
    unitCelsius: 'सेल्सियस (°C)',
    unitFahrenheit: 'फ़ारेनहाइट (°F)',
    prefAlertThreshold: 'हाई रिस्क अलर्ट सीमा (0–100)',
    prefNotifications: 'ऑडियो और विजुअल अलर्ट',
    prefDataSource: 'मौसम डेटा स्रोत',
    sourceSimulated: 'सिम्युलेटेड बेसलाइन (पुणे प्रोटोटाइप)',
    sourceLive: 'ओपन-मेटियो लाइव एपीआई',
    systemDiagnostics: 'सिस्टम कनेक्टिविटी और स्टोरेज',
    resetDemoData: 'डेमो डेटा रीसेट करें',
    aboutHeatShield: 'हीटशील्ड एआई के बारे में',
    appVersion: 'हीटशील्ड एआई v2.4 (सार्वजनिक सुरक्षा संस्करण)',
  },

  mr: {
    appName: 'हीटशील्ड एआय',
    appSubtitle: 'ट्रॅफिक पोलीस उष्णता जोखीम सनियंत्रण आणि स्मार्ट ड्युटी प्लॅनर',
    departmentTag: 'ट्रॅफिक पोलीस सार्वजनिक सुरक्षा प्रणाली',
    demoDataBadge: 'सिम्युलेटेड डेटा (पुणे ट्रॅफिक)',
    liveDataBadge: 'थेट हवामान डेटा',
    unavailableDataBadge: 'हवामान डेटा अनुपलब्ध',

    tabDashboard: 'डॅशबोर्ड',
    tabMap: 'उष्णतेच्या धोक्याचा नकाशा',
    tabMonitoring: 'चौक मॉनिटरिंग',
    tabPrediction: 'उष्णतेच्या धोक्याचा अंदाज',
    tabDutyPlanner: 'स्मार्ट ड्युटी नियोजक',
    tabCooling: 'थंडावा सुविधा',
    tabAiAssistant: 'एआय सुरक्षा सहाय्यक',
    tabAnalytics: 'विश्लेषण आणि अहवाल',
    tabSafetyGuide: 'उष्णता सुरक्षा मार्गदर्शक',
    tabSettings: 'सेटिंग्ज',
    tabSettingsAbout: 'सेटिंग्ज व माहिती',

    monitoringTitle: 'सिम्युलेटेड चौक मॉनिटरिंग ग्रिड',
    monitoringSubtitle: 'पुण्यातील प्रात्यक्षिक चौकांतील उष्णतेचा ताण, वाहतुकीची घनता, उन्हातील ड्युटी कालावधी आणि थंडावा सुविधांचे रिअल-टाइम निरीक्षण.',
    demoDataNotice: 'डेमो डेटा: पुणे वाहतूक प्रात्यक्षिकासाठी सिम्युलेटेड नोंदी.',
    editReadings: 'सिम्युलेटेड नोंदी संपादित करा',
    compareJunctions: 'चौकांची तुलना करा',
    outdoorDutyDuration: 'उन्हातील ड्युटी कालावधी',

    refresh: 'डेटा रिफ्रेश करा',
    exportCsv: 'CSV डाउनलोड',
    printReport: 'अहवाल प्रिंट / PDF',
    saveChanges: 'बदल जतन करा',
    cancel: 'रद्द करा',
    delete: 'हटवा',
    edit: 'संपादित करा',
    add: 'नवीन जोडा',
    search: 'शोधा...',
    filterAll: 'सर्व ठिकाणे',
    status: 'स्थिती',
    lastUpdated: 'शेवटचे अपडेट',
    actions: 'कृती',
    viewDetails: 'तपशील पहा',
    close: 'बंद करा',
    confirm: 'नक्की करा',

    riskLow: 'कमी धोका',
    riskModerate: 'मध्यम धोका',
    riskHigh: 'उच्च धोका',
    riskScore: 'धोका गुण',
    riskCategory: 'धोका प्रवर्ग',

    temperature: 'तापमान',
    humidity: 'हवेतील आर्द्रता',
    apparentTemp: 'जावणवणारे तापमान',
    windSpeed: 'वाऱ्याचा वेग',
    trafficLevel: 'वाहतूक कोंडी',
    shadeCover: 'सावलीचे प्रमाण',
    officersCount: 'तैनात पोलीस कर्मचारी',
    activeAlerts: 'सक्रिय उष्णता इशारे',

    trafficNormal: 'सामान्य वाहतूक',
    trafficModerate: 'मध्यम वाहतूक',
    trafficHeavy: 'भारी वाहतूक',
    trafficGridlock: 'सक्त कोंडी (वाहनांची प्रचंड उष्णता)',

    dashboardTitle: 'ट्रॅफिक जंक्शन उष्णता सनियंत्रण डॅशबोर्ड',
    dashboardSubtitle: 'पुण्यातील प्रमुख चौकांमधील वास्तविक तापमान, हवेतील दमटपणा आणि कर्मचाऱ्यांसाठी सुरक्षा स्थिती.',
    totalJunctions: 'एकूण निरीक्षण चौक',
    lowRiskCount: 'कमी धोक्याचे चौक',
    modRiskCount: 'मध्यम धोक्याचे चौक',
    highRiskCount: 'उच्च धोक्याचे चौक',
    currentTemp: 'सरासरी तापमान',
    currentHumidity: 'हवेतील आर्द्रता',
    avgRiskScoreCard: 'सरासरी उष्णता धोका गुण',
    officersAssignedCard: 'बाहेर कर्तव्यावर असलेले कर्मचारी',
    coolingAttentionCard: 'कूलिंग सुविधांची गरज',
    alertsPanelTitle: 'अति-महत्त्वाचे उष्णता इशारे व सूचना',
    junctionTableTitle: 'पुणे ट्रॅफिक जंक्शन रिअल-टाइम हीट रडार',
    tempComparisonTitle: 'चौकनिहाय तापमान तुलना (°C)',
    riskComparisonTitle: 'उष्णता धोका गुण तुलना (०–१००)',
    riskDistributionTitle: 'धोका प्रवर्ग वितरण',
    tempTrendTitle: '२४ तासांचे तापमान आणि आर्द्रता अंदाज',
    quickActionsTitle: 'त्वरित कार्ये',
    actionViewMap: 'नकाशा उघडा',
    actionPredict: 'धोका अंदाज करा',
    actionPlanDuty: 'ड्युटी प्लॅन तयार करा',
    actionCooling: 'थंडावा सुविधा पहा',
    actionAskAi: 'एआय सहाय्यकाला विचारा',

    mapTitle: 'परस्परसंवादी ट्रॅफिक जंक्शन उष्णता धोका नकाशा',
    mapSubtitle: 'पुणे शहरातील चौकांचा भौगोलिक उष्णता नकाशा आणि सूक्ष्म-हवामान धोका पातळी.',
    searchJunctionsPlaceholder: 'चौकाचे किंवा परिसराचे नाव शोधा...',
    mapLegendTitle: 'उष्णता धोका वर्गीकरण सूची',
    viewListAlternative: 'तक्ता स्वरूपात पहा',
    viewMapAlternative: 'नकाशा स्वरूपात पहा',
    junctionDetailsTitle: 'चौकाची उष्णता स्थिती व सुरक्षा नियमावली',
    riskExplanation: 'उष्णतेची मुख्य कारणे',
    suggestedPrecautions: 'अनिवार्य ड्युटी खबरदारी',
    hydrationRecommendation: 'पाणी व विश्रांतीचे अंतर',
    facilityNeeds: 'आवश्यक थंडावा सुविधा',
    planDutyForJunction: 'या चौकासाठी ड्युटी रोस्टर बनवा',

    predictionTitle: 'उष्णतेच्या धोक्याचा अंदाज व कॅल्क्युलेटर',
    predictionSubtitle: 'तापमान, आर्द्रता, ऊन आणि वाहतूक बदलून रस्त्यावरील ड्युटीसाठी संभाव्य उष्णता धोक्याचा अंदाज घ्या.',
    selectJunctionLabel: 'चाचणीसाठी चौक निवडा',
    sunExposureLabel: 'सूर्यप्रकाश व उन्हाची तीव्रता',
    sunDirect: 'थेट कडक ऊन (प्रचंड उष्णता)',
    sunGlaze: 'दुपारचे तीव्र ऊन',
    sunPartial: 'अंशतः ऊन / सावली',
    sunOvercast: 'ढगाळ हवामान / सावली',
    windCalm: 'शांत हवा (< ५ किमी/तास)',
    windLight: 'मंद वारा (५–१५ किमी/तास)',
    windModerate: 'मध्यम वारा (१५–२५ किमी/तास)',
    windHigh: 'वेगवान वारा (> २५ किमी/तास)',
    calculateButton: 'उष्णतेच्या धोक्याची गणना करा',
    calculating: 'हवामान घटकांचे विश्लेषण होत आहे...',
    predictionResultTitle: 'उष्णता धोका मूल्यांकन निकाल',
    factorsBreakdownTitle: 'गुण मोजणीचे स्पष्टीकरण',
    recommendationsTitle: 'कामाच्या ठिकाणच्या सुरक्षा शिफारसी',
    previousPredictionsTitle: 'मागील अंदाज मोजणी इतिहास',
    clearHistory: 'इतिहास पुसा',
    modelDisclaimer: 'पारदर्शी प्रात्यक्षिक मॉडेल: हे मॉडेल तापमान, दमटपणा, डांबराची उष्णता आणि सावली या घटकांवर आधारित आहे. हे केवळ प्रात्यक्षिकासाठी आहे.',

    dutyPlannerTitle: 'स्मार्ट ड्युटी रोटेशन व विश्रांती नियोजक',
    dutyPlannerSubtitle: 'ट्रॅफिक पोलीस पर्यवेक्षकांसाठी उन्हापासून रक्षण करणारे सुरक्षित शिफ्ट नियोजन आणि रोटेशन व्यवस्थापन.',
    autoPlanButton: 'सुरक्षित रोटेशन वेळापत्रक तयार करा',
    addAssignmentButton: 'नवीन ड्युटी शिफ्ट जोडा',
    filterByOfficer: 'सर्व पोलीस कर्मचारी',
    filterByJunction: 'सर्व चौक',
    filterByShift: 'सर्व शिफ्ट',
    shiftMorning: 'सकाळची शिफ्ट (०७:०० – ११:००)',
    shiftPeakAfternoon: 'दुपारची कडक उन्हाची शिफ्ट (११:०० – १५:००)',
    shiftLateAfternoon: 'दुपारनंतरची शिफ्ट (१५:०० – १९:००)',
    shiftNight: 'संध्याकाळ / रात्र शिफ्ट (१९:०० – २३:००)',
    dutyDuration: 'ड्युटीचा कालावधी',
    rotationInterval: 'रोटेशन अंतर',
    breakSchedule: 'सावलीतील विश्रांती',
    officerName: 'पोलीस कर्मचाऱ्याचे नाव',
    badgeNumber: 'बॅज क्रमांक',
    healthProfile: 'आरोग्य संवेदनशीलता',
    healthNormal: 'सामान्य सहनक्षमता',
    healthHeatSensitive: 'उष्णतेस संवेदनशील / ज्येष्ठ कर्मचारी',
    recommendedHydration: 'पाणी पिण्याचे उद्दिष्ट',
    suggestedRest: 'विश्रांती नियमावली',
    statusApproved: 'मंजूर',
    statusPending: 'पडताळणी प्रलंबित',
    statusActionRequired: 'तातडीची कृती आवश्यक',
    dutyDisclaimer: 'सूचना: हे ड्युटी नियोजन उष्णतेपासून सुरक्षेसाठी मार्गदर्शक आहे, हे अधिकृत पोलीस नियमावली किंवा पर्यवेक्षक मंजुरीची जागा घेत नाही.',

    coolingTitle: 'थंडावा सुविधा प्राधान्यक्रम व महापालिका गरजा',
    coolingSubtitle: 'सावली शेड, पिण्याचे थंड पाणी आणि मिस्टिंग फॅन्सची तातडीने गरज असणारे उच्च-धोका चौक.',
    facilityShade: 'सावली शेड / सन शेल्टर',
    facilityWater: 'पिण्याच्या पाण्याचे किऑस्क / आरओ',
    facilityRest: 'वातानुकूलित विश्रांती केबिन',
    facilityMisting: 'वॉटर मिस्टिंग फॅन / कुलर',
    urgencyImmediate: 'तातडीने (२४–४८ तास)',
    urgencyHigh: 'उच्च प्राधान्य (३–५ दिवस)',
    urgencyScheduled: 'नियोजित (१० दिवस)',
    existingFacilities: 'सध्या उपलब्ध सुविधा',
    missingFacilities: 'आवश्यक अतिरिक्त सुविधा',
    priorityLevel: 'प्राधान्य पातळी',
    updateStatus: 'सुविधा स्थिती अद्ययावत करा',
    facilityComparisonTitle: 'सुविधा गरज व धोका तुलना',

    aiTitle: 'एआय सुरक्षा सहाय्यक (न्यूजेन एपीआय संचलित)',
    aiSubtitle: 'ट्रॅफिक कर्मचाऱ्यांसाठी उष्माघात प्रतिबंध, पाणी पिण्याचे नियम आणि प्रथमोपचार सल्लागार.',
    nugenActiveBadge: 'न्यूजेन एपीआय कनेक्टेड',
    nugenSandboxBadge: 'न्यूजेन एपीआय सँडबॉक्स मोड',
    askAssistantPlaceholder: 'पाणी पिणे, उष्माघाताची लक्षणे, ड्युटी रोटेशन किंवा चौकातील खबरदारीबद्दल विचारा...',
    sendQuestion: 'प्रश्न विचारा',
    clearChat: 'संभाषण साफ करा',
    suggestedQuestionsTitle: 'वारंवार विचारले जाणारे सुरक्षा प्रश्न',
    qHighRisk: 'जास्त उष्णता धोका असताना काय करावे?',
    qHeatstroke: 'उष्माघाताची (Heatstroke) चेतावणी लक्षणे कोणती?',
    qHydration: 'पाणी पिण्याचा ब्रेक कधी घ्यावा?',
    qPrecautions: 'स्वारगेट चौकात कोणती खबरदारी घ्यावी?',
    emergencyNotice: 'वैद्यकीय आणीबाणी: कर्मचाऱ्याला चक्कर आल्यास किंवा घाम येणे थांबल्यास त्वरित सावलीत न्या, थंड पाणी लावा आणि ११२ / १०८ वर संपर्क करा.',
    nugenConfigNotice: 'न्यूजेन एपीआय इंटिग्रेशन थर सक्रिय आहे. थेट जनरेटिव्ह उत्तरांसाठी पर्यावरण चल (Environment) मध्ये NUGEN_API_KEY सेट करा.',

    analyticsTitle: 'विश्लेषण, अहवाल आणि उष्णता सांख्यिकी',
    analyticsSubtitle: 'उष्णतेचे नमुने, धोका वितरण आणि पोलीस पर्यवेक्षकांसाठी अधिकृत डाऊनलोडयोग्य अहवाल.',
    timeRangeToday: 'आज (थेट)',
    timeRange3Days: '३ दिवसांचा अंदाज',
    timeRangeWeek: '७ दिवसांचा सारांश',
    executiveSummaryTitle: 'उष्णता धोका कार्यकारी सारांश',
    highestRiskHotspotsTitle: 'सर्वाधिक धोका असलेले ट्रॅफिक चौक',
    observedTrendsTitle: 'निरीक्षण केलेले हवामान बदल',
    suggestedInterventionsTitle: 'पोलीस नेतृत्वासाठी शिफारसी',
    exportCsvReport: 'CSV अहवाल डाऊनलोड करा',
    printPdfReport: 'प्रिंट / PDF अहवाल',

    guideTitle: 'ट्रॅफिक पोलीस उष्णता सुरक्षा व प्रथमोपचार पुस्तिका',
    guideSubtitle: 'कडक उन्हात कर्तव्य बजावणाऱ्या ट्रॅफिक पोलिसांसाठी प्रत्यक्ष आरोग्य व सुरक्षा मार्गदर्शक.',
    secBeforeDuty: '१. ड्युटी सुरू करण्यापूर्वी (तयारी आणि गणवेश)',
    secDuringDuty: '२. तीव्र उन्हात ड्युटी करताना (रस्त्यावरील सुरक्षा)',
    secHydrationRest: '३. पाणी पिणे आणि सावलीतील विश्रांतीचे अंतर',
    secWarningSigns: '४. उष्णतेच्या आजारांची चेतावणी लक्षणे',
    secEmergencyResponse: '५. तातडीचे प्रथमोपचार नियम (११२ / १०८ कॉल करा)',
    secAfterDuty: '६. ड्युटी संपल्यानंतर (विश्रांती आणि रिकव्हरी)',
    emergencyCallBanner: 'वैद्यकीय आणीबाणी हेल्पलाईन: उष्माघात झाल्यास तत्काळ ११२ किंवा १०८ वर फोन करा.',

    settingsTitle: 'प्रणाली सेटिंग्ज आणि प्राधान्ये',
    settingsSubtitle: 'भाषा, डिस्प्ले थीम (लाइट/डार्क मोड), तापमान एकक आणि डेटा स्रोत व्यवस्थापित करा.',
    prefLanguage: 'प्रणालीची भाषा (Language)',
    prefTheme: 'डिस्प्ले थीम (लाइट / डार्क)',
    themeLight: 'लाइट थीम',
    themeDark: 'डार्क थीम',
    themeHighContrast: 'हाय कॉन्ट्रास्ट मोड',
    prefUnit: 'तापमान एकक',
    unitCelsius: 'सेल्सिअस (°C)',
    unitFahrenheit: 'फॅरनहाइट (°F)',
    prefAlertThreshold: 'हाय रिस्क अलर्ट मर्यादा (०–१००)',
    prefNotifications: 'ध्वनी व दृश्य सूचना (Alerts)',
    prefDataSource: 'हवामान डेटा स्रोत',
    sourceSimulated: 'सिम्युलेटेड बेसलाइन (पुणे प्रोटोटाइप)',
    sourceLive: 'ओपन-मेटियो थेट API',
    systemDiagnostics: 'प्रणाली जोडणी व स्टोरेज स्थिती',
    resetDemoData: 'डेमो डेटा रीसेट करा',
    aboutHeatShield: 'हीटशील्ड एआय विषयी',
    appVersion: 'हीटशील्ड एआय v२.४ (सार्वजनिक सुरक्षा आवृत्ती)',
  },
};
