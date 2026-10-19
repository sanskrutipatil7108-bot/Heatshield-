export type RiskCategory = 'Low' | 'Moderate' | 'High';

export type TrafficIntensity = 'Normal' | 'Moderate' | 'Heavy' | 'Gridlock';

export type UserRole = 'Traffic Police' | 'Supervisor' | 'Municipal Officer' | 'Outdoor Worker';

export type NavTab = 
  | 'dashboard'
  | 'map'
  | 'monitoring'
  | 'prediction'
  | 'duty-planner'
  | 'cooling-facilities'
  | 'ai-assistant'
  | 'analytics'
  | 'settings';

export interface Junction {
  id: string;
  name: string;
  neighborhood: string;
  lat: number;
  lon: number;
  temp: number; // in °C
  humidity: number; // percentage
  traffic: TrafficIntensity;
  shadePercent: number; // 0-100%
  riskScore: number; // 0-100
  riskCategory: RiskCategory;
  action: string;
  vulnerableStaffCount: number;
  outdoorDutyDurationMin?: number;
  drinkingWaterNearby: boolean;
  hasMistingFan?: boolean;
  hasShadeShelter?: boolean;
  dataSource?: string;
  lastUpdated: string;
  notes?: string;
}

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'hydration' | 'rotation' | 'ppe' | 'checkin';
}

export interface DutyPlan {
  id: string;
  junctionId: string;
  junctionName: string;
  shiftName: string;
  shiftHours: string;
  riskCategory: RiskCategory;
  personnelCount: number;
  hydrationTargetMlPerHour: number;
  restBreakIntervalMin: number;
  rotationHours: number;
  supervisorStatus: 'Approved' | 'Pending Review' | 'Action Required';
  supervisorNotes: string;
  recommendations: string[];
  tasks: TaskItem[];
  flags?: string[];
}

export interface OfficerAssignment {
  id: string;
  officerName: string;
  badgeNumber: string;
  junctionId: string;
  junctionName: string;
  shiftName: string;
  shiftHours: string;
  riskCategory: RiskCategory;
  healthSensitivity: 'Standard' | 'Heat-Sensitive';
  durationHours: number;
  rotationIntervalMin: number;
  breakDurationMin: number;
  hydrationTargetMl: number;
  status: 'Active' | 'Scheduled' | 'Completed' | 'Resting';
  assignedDate: string;
  notes?: string;
  flags?: string[];
}

export interface CoolingPriority {
  id: string;
  rank: number;
  junctionId: string;
  junctionName: string;
  riskScore: number;
  riskCategory: RiskCategory;
  facilityType: 'Drinking Water Kiosk' | 'Misting Shade Awning' | 'Air-Cooled Transit Shelter' | 'ORS & First-Aid Standby';
  urgency: 'Immediate' | 'High' | 'Scheduled';
  status: 'Needed' | 'In Progress' | 'Installed';
  reason: string;
  proposedAction: string;
  targetCompletionDays: number;
  lastUpdated: string;
}

export interface PredictionRecord {
  id: string;
  timestamp: string;
  junctionName: string;
  temperature: number;
  humidity: number;
  traffic: TrafficIntensity;
  shadePercent: number;
  sunExposure: string;
  windSpeed: string;
  riskScore: number;
  riskCategory: RiskCategory;
  explanation: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  badgeNumber?: string;
  stationName?: string;
  isLoggedIn: boolean;
}

export interface LocationInfo {
  name: string;
  city: string;
  state: string;
  country: string;
  address?: string;
  lat: number;
  lon: number;
  isLive: boolean;
  source: string;
  lastRefreshed: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
  isAiPowered?: boolean;
  error?: string;
  staticResources?: any;
}

export interface WeatherCondition {
  temperature: number;
  humidity: number;
  apparentTemp: number;
  windSpeed: number;
  uvIndex: number;
  conditionDescription: string;
  isLive: boolean;
  source: string;
  lastUpdated: string;
}
