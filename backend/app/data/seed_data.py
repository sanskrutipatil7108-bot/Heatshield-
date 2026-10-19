"""
Centralized Seed Data for Demonstration
======================================
Contains:
1. 5 Explicitly Simulated Pune Traffic Junctions:
   - JM Road Junction (Low Risk, 42)
   - Deccan Gymkhana Junction (Moderate Risk, 62)
   - Shivajinagar Junction (Moderate Risk, 68)
   - Swargate Junction (High Risk, 86)
   - Hadapsar Junction (High Risk, 89)
2. Seed Duty Plans with deterministic rotation rules.
3. Seed Cooling Infrastructure Priorities.
"""

import copy
from datetime import datetime

INITIAL_JUNCTIONS = [
    {
        "id": "pune-jm-road",
        "name": "JM Road Junction",
        "neighborhood": "Jungli Maharaj Road & Shivajinagar Commercial Axis",
        "lat": 18.5246,
        "lon": 73.8478,
        "temp": 36.2,
        "humidity": 40,
        "traffic": "Moderate",
        "shadePercent": 35,
        "riskScore": 42,
        "riskCategory": "Low",
        "action": "Standard duty hydration; maintain baseline water refills; normal staff monitoring and wellbeing check-ins.",
        "vulnerableStaffCount": 8,
        "outdoorDutyDurationMin": 90,
        "drinkingWaterNearby": True,
        "hasMistingFan": False,
        "hasShadeShelter": True,
        "dataSource": "Simulated Pune Telemetry - DEMO DATA",
        "lastUpdated": "5 mins ago (Simulated)",
        "notes": "Decent tree canopy cover along western pedestrian avenue. Moderate vehicle density."
    },
    {
        "id": "pune-deccan",
        "name": "Deccan Gymkhana Junction",
        "neighborhood": "FC Road & Karve Road Nexus",
        "lat": 18.5173,
        "lon": 73.8415,
        "temp": 38.0,
        "humidity": 46,
        "traffic": "Moderate",
        "shadePercent": 25,
        "riskScore": 60,
        "riskCategory": "Moderate",
        "action": "Enforce 350ml hydration every 30 min; rotate traffic marshals from asphalt at 14:00.",
        "vulnerableStaffCount": 10,
        "outdoorDutyDurationMin": 60,
        "drinkingWaterNearby": True,
        "hasMistingFan": False,
        "hasShadeShelter": True,
        "dataSource": "Simulated Pune Telemetry - DEMO DATA",
        "lastUpdated": "8 mins ago (Simulated)",
        "notes": "FC Road approach has intermittent tree shadows. Heavy pedestrian crossings."
    },
    {
        "id": "pune-shivajinagar",
        "name": "Shivajinagar Junction",
        "neighborhood": "Shivajinagar Metro Interchange & Court Road",
        "lat": 18.5314,
        "lon": 73.8446,
        "temp": 38.8,
        "humidity": 48,
        "traffic": "Heavy",
        "shadePercent": 18,
        "riskScore": 68,
        "riskCategory": "Moderate",
        "action": "Rotate officers every 60 min; deploy UV caps with neck shades; provide 500ml cold water.",
        "vulnerableStaffCount": 12,
        "outdoorDutyDurationMin": 60,
        "drinkingWaterNearby": True,
        "hasMistingFan": True,
        "hasShadeShelter": True,
        "dataSource": "Simulated Pune Telemetry - DEMO DATA",
        "lastUpdated": "10 mins ago (Simulated)",
        "notes": "Concrete flyover structure traps heat between bridge pillars with limited natural breeze."
    },
    {
        "id": "pune-swargate",
        "name": "Swargate Junction",
        "neighborhood": "Swargate Multimodal Transit & Bus Terminal",
        "lat": 18.5018,
        "lon": 73.8586,
        "temp": 41.2,
        "humidity": 54,
        "traffic": "Gridlock",
        "shadePercent": 8,
        "riskScore": 86,
        "riskCategory": "High",
        "action": "Mandatory 15-min shaded rest every 45 min; chilled ORS electrolytes; active water misting canopy.",
        "vulnerableStaffCount": 14,
        "outdoorDutyDurationMin": 45,
        "drinkingWaterNearby": False,
        "hasMistingFan": False,
        "hasShadeShelter": False,
        "dataSource": "Simulated Pune Telemetry - DEMO DATA",
        "lastUpdated": "3 mins ago (Simulated)",
        "notes": "Massive asphalt footprint reradiates intense solar thermal load. High diesel bus exhaust concentration."
    },
    {
        "id": "pune-hadapsar",
        "name": "Hadapsar Junction",
        "neighborhood": "Solapur Road Industrial Freight Gateway",
        "lat": 18.5029,
        "lon": 73.9272,
        "temp": 42.0,
        "humidity": 50,
        "traffic": "Heavy",
        "shadePercent": 10,
        "riskScore": 89,
        "riskCategory": "High",
        "action": "CRITICAL HEAT ADVISORY: Limit unshaded post to 40 min; supply cold ORS; misting fan required.",
        "vulnerableStaffCount": 12,
        "outdoorDutyDurationMin": 40,
        "drinkingWaterNearby": False,
        "hasMistingFan": False,
        "hasShadeShelter": False,
        "dataSource": "Simulated Pune Telemetry - DEMO DATA",
        "lastUpdated": "2 mins ago (Simulated)",
        "notes": "Wide 6-lane asphalt highway corridor with heavy freight diesel exhaust and zero natural canopy."
    }
]

INITIAL_DUTY_PLANS = [
    {
        "id": "dp-1",
        "junctionId": "pune-swargate",
        "junctionName": "Swargate Junction",
        "shiftName": "Peak Heat Afternoon Shift",
        "shiftHours": "11:00 – 15:00",
        "riskCategory": "High",
        "personnelCount": 6,
        "hydrationTargetMlPerHour": 650,
        "restBreakIntervalMin": 45,
        "rotationHours": 1.5,
        "supervisorStatus": "Action Required",
        "supervisorNotes": "High solar radiant load on south flyover approach. Extra relief marshal assigned for 15-minute rest rotations.",
        "recommendations": [
            "Prohibit solo officer standing on exposed tarmac island without overhead canopy.",
            "Provide chilled electrolytes (ORS sachets) at the traffic control booth.",
            "Mandatory wellness check-in at 13:00 and 14:30."
        ],
        "tasks": [
            {"id": "t-1", "text": "Distribute insulated 2-liter hydration flasks with ORS", "completed": True, "category": "hydration"},
            {"id": "t-2", "text": "Confirm shaded cooling awning erected at southern signal island", "completed": False, "category": "ppe"},
            {"id": "t-3", "text": "Schedule 45-minute alternating rotation with relief marshal", "completed": False, "category": "rotation"},
            {"id": "t-4", "text": "Verify nearest primary health center emergency standby contacts", "completed": True, "category": "checkin"}
        ]
    },
    {
        "id": "dp-2",
        "junctionId": "pune-hadapsar",
        "junctionName": "Hadapsar Junction",
        "shiftName": "Peak Heat Afternoon Shift",
        "shiftHours": "11:00 – 15:00",
        "riskCategory": "High",
        "personnelCount": 5,
        "hydrationTargetMlPerHour": 600,
        "restBreakIntervalMin": 40,
        "rotationHours": 1.5,
        "supervisorStatus": "Approved",
        "supervisorNotes": "Industrial freight heat load. Team provided with UV reflective caps and wet cooling neck wraps.",
        "recommendations": [
            "Relieve officers at 40-minute intervals to air-cooled patrol vehicle or booth.",
            "Ensure on-site cold water dispenser is refilled before 11:30."
        ],
        "tasks": [
            {"id": "t-5", "text": "Pre-shift hydration briefing and core temperature check", "completed": True, "category": "checkin"},
            {"id": "t-6", "text": "Equip officers with wide-brim UV hats and cooling neck towels", "completed": True, "category": "ppe"},
            {"id": "t-7", "text": "Coordinate with municipal tanker for road wetting mist", "completed": True, "category": "rotation"}
        ]
    },
    {
        "id": "dp-3",
        "junctionId": "pune-shivajinagar",
        "junctionName": "Shivajinagar Junction",
        "shiftName": "Morning Peak Traffic Shift",
        "shiftHours": "07:00 – 11:00",
        "riskCategory": "Moderate",
        "personnelCount": 4,
        "hydrationTargetMlPerHour": 400,
        "restBreakIntervalMin": 60,
        "rotationHours": 2.0,
        "supervisorStatus": "Approved",
        "supervisorNotes": "Moderate heat stress; temperature rises rapidly after 09:30. Hydration checkpoint established.",
        "recommendations": [
            "Ensure 350ml water consumed every 30 minutes.",
            "Transition to covered umbrella signal posts at 10:00."
        ],
        "tasks": [
            {"id": "t-8", "text": "Inspect chilled drinking water dispenser at bus stop", "completed": True, "category": "hydration"},
            {"id": "t-9", "text": "Confirm emergency first-aid kit in control booth", "completed": True, "category": "checkin"}
        ]
    }
]

INITIAL_COOLING_PRIORITIES = [
    {
        "id": "cp-1",
        "rank": 1,
        "junctionId": "pune-hadapsar",
        "junctionName": "Hadapsar Junction",
        "riskScore": 89,
        "riskCategory": "High",
        "facilityType": "Misting Shade Awning",
        "urgency": "Immediate",
        "status": "Needed",
        "reason": "Wide open 6-lane asphalt highway corridor with extreme solar radiance (42.0°C) and heavy diesel truck emissions.",
        "proposedAction": "Install heavy-duty UV reflective shade canopy and high-pressure water misting nozzles at central traffic island.",
        "targetCompletionDays": 2,
        "lastUpdated": "Today"
    },
    {
        "id": "cp-2",
        "rank": 2,
        "junctionId": "pune-swargate",
        "junctionName": "Swargate Junction",
        "riskScore": 86,
        "riskCategory": "High",
        "facilityType": "Drinking Water Kiosk",
        "urgency": "Immediate",
        "status": "In Progress",
        "reason": "Severe asphalt heat reradiation, 14 outdoor officers assigned without on-site cold drinking water dispensary.",
        "proposedAction": "Connect chilled RO drinking water dispenser with ORS sachet replenishment station at police chowki.",
        "targetCompletionDays": 3,
        "lastUpdated": "Yesterday"
    },
    {
        "id": "cp-3",
        "rank": 3,
        "junctionId": "pune-shivajinagar",
        "junctionName": "Shivajinagar Junction",
        "riskScore": 68,
        "riskCategory": "Moderate",
        "facilityType": "Air-Cooled Transit Shelter",
        "urgency": "High",
        "status": "Installed",
        "reason": "High pedestrian and commuter volume; elevated flyover traps heat between concrete pillars.",
        "proposedAction": "Maintain and inspect existing air-cooler unit in traffic police cabin and refill water reservoir daily.",
        "targetCompletionDays": 5,
        "lastUpdated": "2 days ago"
    },
    {
        "id": "cp-4",
        "rank": 4,
        "junctionId": "pune-deccan",
        "junctionName": "Deccan Gymkhana Junction",
        "riskScore": 60,
        "riskCategory": "Moderate",
        "facilityType": "Drinking Water Kiosk",
        "urgency": "Scheduled",
        "status": "Installed",
        "reason": "Commercial hub with good tree canopy, but high footfall increases demand on roadside water supply.",
        "proposedAction": "Regular maintenance of municipal water filtration kiosk near Sambhaji Park crossing.",
        "targetCompletionDays": 8,
        "lastUpdated": "3 days ago"
    },
    {
        "id": "cp-5",
        "rank": 5,
        "junctionId": "pune-jm-road",
        "junctionName": "JM Road Junction",
        "riskScore": 42,
        "riskCategory": "Low",
        "facilityType": "ORS & First-Aid Standby",
        "urgency": "Scheduled",
        "status": "Installed",
        "reason": "Good avenue tree canopy; officers need quick access to emergency heat exhaustion packs during afternoon shifts.",
        "proposedAction": "Stock dedicated heatwave first-aid kit with instant cold packs, ORS sachets, and digital thermometer.",
        "targetCompletionDays": 10,
        "lastUpdated": "4 days ago"
    }
]

class InMemoryStore:
    def __init__(self):
        self.reset()

    def reset(self):
        self.junctions = copy.deepcopy(INITIAL_JUNCTIONS)
        self.duty_plans = copy.deepcopy(INITIAL_DUTY_PLANS)
        self.cooling_priorities = copy.deepcopy(INITIAL_COOLING_PRIORITIES)

store = InMemoryStore()
