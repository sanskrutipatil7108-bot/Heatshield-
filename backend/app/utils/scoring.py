"""
Transparent Rule-Based Demonstration Heat-Risk Scoring Module
=============================================================
Assumptions & Weights:
1. Temperature Factor (Base reference 24°C):
   Each degree Celsius above 24°C adds ~3.3 points (clamped to max 55 pts).
2. Relative Humidity Factor (Evaporative sweat inhibition):
   Each percentage point above 30% adds ~0.45 points (clamped to max 30 pts).
3. Traffic Intensity Load (Vehicle exhaust heat & asphalt radiant absorption):
   - Normal: +4 pts
   - Moderate: +8 pts
   - Heavy: +14 pts
   - Gridlock: +18 pts
4. Urban Canopy & Shade Mitigation:
   Canopy shade reduces risk by up to -14 points ((shadePercent / 100) * 14).
5. Facility Mitigations:
   - On-site cold drinking water: -4 pts
   - Active misting cooling: -5 pts

Composite Score Range: 10 to 100.
Categories:
- Low: 0 - 44
- Moderate: 45 - 74
- High: 75 - 100

Disclaimer: This is an occupational rule-based demonstration formula for Pune traffic junction
simulation, not a certified clinical or medical diagnosis index.
"""

from typing import Dict, Any, Tuple

def calculate_heat_risk(
    temperature: float,
    humidity: float,
    traffic: str = "Moderate",
    shade_percent: float = 20.0,
    has_water: bool = True,
    has_misting: bool = False
) -> Dict[str, Any]:
    temp_diff = max(0.0, temperature - 24.0)
    temp_component = min(55.0, temp_diff * 3.3)

    humidity_excess = max(0.0, humidity - 30.0)
    humidity_component = min(30.0, humidity_excess * 0.45)

    traffic_map = {
        "Normal": 4.0,
        "Moderate": 8.0,
        "Heavy": 14.0,
        "Gridlock": 18.0
    }
    traffic_component = traffic_map.get(traffic, 8.0)

    shade_discount = min(15.0, (shade_percent / 100.0) * 14.0)
    facility_discount = (4.0 if has_water else 0.0) + (5.0 if has_misting else 0.0)

    raw_score = temp_component + humidity_component + traffic_component - shade_discount - facility_discount
    score = max(10, min(100, int(round(raw_score))))

    if score >= 75:
        category = "High"
        action = "Mandatory 15-min shaded rest every 45 min; chilled ORS replenishment; rotate staff from exposed tarmac posts; active water misting required."
        rest_interval = 45
        break_duration = 15
        hydration_target = 650
    elif score >= 45:
        category = "Moderate"
        action = "Enforce 350ml hydration every 30 min; swap exposed posts during peak afternoon hours; deploy UV protective neck flaps and caps."
        rest_interval = 60
        break_duration = 15
        hydration_target = 450
    else:
        category = "Low"
        action = "Standard duty hydration; maintain baseline water refills; normal staff monitoring and wellbeing check-ins."
        rest_interval = 90
        break_duration = 10
        hydration_target = 350

    return {
        "score": score,
        "category": category,
        "action": action,
        "rest_interval_min": rest_interval,
        "break_duration_min": break_duration,
        "hydration_target_ml_per_hour": hydration_target,
        "breakdown": {
            "temperature_component": round(temp_component, 1),
            "humidity_component": round(humidity_component, 1),
            "traffic_load": traffic_component,
            "shade_relief": round(shade_discount, 1),
            "facility_relief": facility_discount,
            "raw_total": round(raw_score, 1)
        }
    }


def calculate_cooling_priority(
    risk_score: int,
    traffic: str,
    shade_percent: float,
    has_water: bool,
    has_misting: bool,
    has_shade_shelter: bool
) -> Dict[str, Any]:
    """
    Transparent Cooling Priority Calculation
    Weights:
    - Heat Risk Score: 40%
    - Outdoor Exposure / Traffic: 25%
    - Shade Deficit: 20%
    - Water & Rest Deficit: 15%
    """
    risk_weight = (risk_score / 100.0) * 40.0

    traffic_weights = {"Gridlock": 25.0, "Heavy": 18.0, "Moderate": 10.0, "Normal": 5.0}
    traffic_weight = traffic_weights.get(traffic, 12.0)

    shade_deficit = max(0.0, (100.0 - shade_percent) / 100.0) * 20.0
    water_deficit = (0.0 if has_water else 8.0) + (0.0 if has_shade_shelter else 7.0)

    composite_priority = risk_weight + traffic_weight + shade_deficit + water_deficit
    score_out_of_100 = min(100, int(round(composite_priority)))

    if score_out_of_100 >= 75:
        urgency = "Immediate"
    elif score_out_of_100 >= 50:
        urgency = "High"
    else:
        urgency = "Scheduled"

    return {
        "priority_score": score_out_of_100,
        "urgency": urgency,
        "needs_misting": not has_misting and risk_score >= 70,
        "needs_water": not has_water,
        "needs_shade": shade_percent < 20 or not has_shade_shelter
    }
