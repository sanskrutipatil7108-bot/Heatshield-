from flask import Flask, request, jsonify
from datetime import datetime
import json

from .config import Config
from .data.seed_data import store, INITIAL_JUNCTIONS
from .utils.scoring import calculate_heat_risk, calculate_cooling_priority
from .services.nugen_service import call_nugen_chat, STATIC_HEAT_SAFETY_RESOURCES

app = Flask(__name__)

# Native CORS handling for maximum reliability
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

# Handle preflight OPTIONS requests across all routes
@app.route('/', defaults={'path': ''}, methods=['OPTIONS'])
@app.route('/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    return '', 204

# ========================================================
# 1. HEALTH ENDPOINT
# ========================================================
@app.route('/api/health', methods=['GET'])
def get_health():
    return jsonify({
        "status": "healthy",
        "service": "HeatShield AI Backend",
        "version": "2.4.0",
        "aiProvider": "Nugen API (Sole Permitted AI Integration)",
        "nugenConfigured": Config.is_nugen_configured(),
        "nugenModel": Config.NUGEN_MODEL,
        "monitoredCity": "Pune, Maharashtra, India",
        "timestamp": datetime.utcnow().isoformat() + "Z"
    })

# ========================================================
# 2. JUNCTIONS ENDPOINTS
# ========================================================
@app.route('/api/junctions', methods=['GET'])
def list_junctions():
    risk_filter = request.args.get('riskCategory')
    search_query = request.args.get('search', '').lower().strip()

    junctions = store.junctions
    if risk_filter and risk_filter.lower() != 'all':
        junctions = [j for j in junctions if j.get('riskCategory', '').lower() == risk_filter.lower()]
    if search_query:
        junctions = [j for j in junctions if search_query in j.get('name', '').lower() or search_query in j.get('neighborhood', '').lower()]

    return jsonify({
        "success": True,
        "count": len(junctions),
        "data": junctions,
        "dataSource": "Simulated Pune Telemetry - DEMO DATA"
    })

@app.route('/api/junctions/<junction_id>', methods=['GET'])
def get_junction(junction_id):
    junction = next((j for j in store.junctions if j['id'] == junction_id), None)
    if not junction:
        return jsonify({"success": False, "error": f"Junction with ID '{junction_id}' not found"}), 404
    return jsonify({"success": True, "data": junction})

@app.route('/api/junctions/<junction_id>', methods=['PUT'])
def update_junction(junction_id):
    payload = request.get_json() or {}
    junction = next((j for j in store.junctions if j['id'] == junction_id), None)
    if not junction:
        return jsonify({"success": False, "error": f"Junction with ID '{junction_id}' not found"}), 404

    # Allow editing simulated environmental readings and facility availability
    if 'temp' in payload:
        try:
            junction['temp'] = float(payload['temp'])
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid temperature value"}), 400

    if 'humidity' in payload:
        try:
            junction['humidity'] = float(payload['humidity'])
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid humidity value"}), 400

    if 'traffic' in payload and payload['traffic'] in ['Normal', 'Moderate', 'Heavy', 'Gridlock']:
        junction['traffic'] = payload['traffic']

    if 'shadePercent' in payload:
        try:
            junction['shadePercent'] = max(0, min(100, float(payload['shadePercent'])))
        except (ValueError, TypeError):
            pass

    if 'drinkingWaterNearby' in payload:
        junction['drinkingWaterNearby'] = bool(payload['drinkingWaterNearby'])

    if 'hasMistingFan' in payload:
        junction['hasMistingFan'] = bool(payload['hasMistingFan'])

    if 'hasShadeShelter' in payload:
        junction['hasShadeShelter'] = bool(payload['hasShadeShelter'])

    if 'vulnerableStaffCount' in payload:
        try:
            junction['vulnerableStaffCount'] = int(payload['vulnerableStaffCount'])
        except (ValueError, TypeError):
            pass

    # Recalculate score and category using our transparent formula
    recalc = calculate_heat_risk(
        temperature=junction['temp'],
        humidity=junction['humidity'],
        traffic=junction['traffic'],
        shade_percent=junction['shadePercent'],
        has_water=junction['drinkingWaterNearby'],
        has_misting=junction.get('hasMistingFan', False)
    )

    junction['riskScore'] = recalc['score']
    junction['riskCategory'] = recalc['category']
    junction['action'] = recalc['action']
    junction['outdoorDutyDurationMin'] = recalc['rest_interval_min']
    junction['lastUpdated'] = "Just now (Supervisor update)"

    return jsonify({
        "success": True,
        "message": f"Updated {junction['name']} successfully",
        "data": junction
    })

@app.route('/api/junctions/reset', methods=['POST'])
def reset_junctions():
    store.reset()
    return jsonify({
        "success": True,
        "message": "All 5 Pune demonstration junctions reset to default calibrated telemetry",
        "data": store.junctions
    })

# ========================================================
# 3. HEAT RISK CALCULATE ENDPOINT
# ========================================================
@app.route('/api/heat-risk/calculate', methods=['POST'])
def calculate_risk():
    payload = request.get_json() or {}
    try:
        temp = float(payload.get('temperature', 38.0))
        humidity = float(payload.get('humidity', 45.0))
    except (ValueError, TypeError):
        return jsonify({"error": "Temperature and humidity must be numeric values"}), 400

    if temp < 15 or temp > 60:
        return jsonify({"error": "Temperature must be between 15°C and 60°C"}), 400
    if humidity < 5 or humidity > 100:
        return jsonify({"error": "Humidity percentage must be between 5% and 100%"}), 400

    traffic = payload.get('traffic', 'Moderate')
    shade_percent = float(payload.get('shadePercent', 20.0))
    has_water = bool(payload.get('drinkingWaterNearby', True))
    has_misting = bool(payload.get('hasMistingFan', False))

    result = calculate_heat_risk(
        temperature=temp,
        humidity=humidity,
        traffic=traffic,
        shade_percent=shade_percent,
        has_water=has_water,
        has_misting=has_misting
    )

    return jsonify({
        "success": True,
        "inputs": {
            "temperature": temp,
            "humidity": humidity,
            "traffic": traffic,
            "shadePercent": shade_percent,
            "drinkingWaterNearby": has_water,
            "hasMistingFan": has_misting
        },
        "result": result,
        "methodology": "Transparent Rule-Based Demonstration Formula (Pune Traffic Operations S.O.P.)",
        "disclaimer": "Rule-based demonstration score, not a certified clinical or medical diagnosis index."
    })

# ========================================================
# 4. DUTY PLANS ENDPOINTS
# ========================================================
@app.route('/api/duty-plans', methods=['GET'])
def list_duty_plans():
    return jsonify({
        "success": True,
        "count": len(store.duty_plans),
        "data": store.duty_plans
    })

@app.route('/api/duty-plans/generate', methods=['POST'])
def generate_duty_plan():
    payload = request.get_json() or {}
    junction_id = payload.get('junctionId', 'pune-swargate')
    target_junction = next((j for j in store.junctions if j['id'] == junction_id), store.junctions[0])

    max_continuous = int(payload.get('maxContinuousMin', 45 if target_junction['riskCategory'] == 'High' else 60))
    rest_duration = int(payload.get('restDurationMin', 15))
    shift_hours = payload.get('shiftHours', '11:00 – 15:00')

    # Enforce deterministic constraint flags
    exceeds_safe_limit = (target_junction['riskCategory'] == 'High' and max_continuous > 45) or (target_junction['riskCategory'] == 'Moderate' and max_continuous > 60)
    insufficient_rest = (target_junction['riskCategory'] == 'High' and rest_duration < 15)

    flags = []
    if exceeds_safe_limit:
        flags.append(f"Assignment exceeds safe continuous duty limits ({max_continuous}m > recommended max for {target_junction['riskCategory']} risk).")
    if insufficient_rest:
        flags.append(f"Rest duration of {rest_duration}m is insufficient for {target_junction['riskCategory']} thermal stress.")

    new_plan = {
        "id": f"dp-gen-{int(datetime.utcnow().timestamp())}",
        "junctionId": target_junction['id'],
        "junctionName": target_junction['name'],
        "shiftName": payload.get('shiftName', 'Generated Heat-Safe Rotation'),
        "shiftHours": shift_hours,
        "riskCategory": target_junction['riskCategory'],
        "personnelCount": int(payload.get('personnelCount', 5)),
        "hydrationTargetMlPerHour": 700 if target_junction['riskCategory'] == 'High' else 500,
        "restBreakIntervalMin": max_continuous,
        "rotationHours": 1.5,
        "supervisorStatus": "Action Required" if flags else "Approved",
        "supervisorNotes": " | ".join(flags) if flags else f"Validated deterministic rotation: {max_continuous}m post / {rest_duration}m rest.",
        "flags": flags,
        "recommendations": [
            f"Rotate marshals from asphalt signal island every {max_continuous} minutes.",
            f"Mandatory {rest_duration}-minute shaded rest with 350ml water/electrolyte replenishment.",
            "Escalate to divisional supervisor if temperature exceeds 42°C."
        ],
        "tasks": [
            {"id": "t-gen-1", "text": "Inspect cold drinking water kiosk", "completed": True, "category": "hydration"},
            {"id": "t-gen-2", "text": f"Enforce {max_continuous}m alternating rotation with relief marshal", "completed": False, "category": "rotation"}
        ]
    }

    store.duty_plans.append(new_plan)
    return jsonify({
        "success": True,
        "message": "Generated draft duty rotation plan",
        "data": new_plan
    })

@app.route('/api/duty-plans/<plan_id>', methods=['PUT'])
def update_duty_plan(plan_id):
    payload = request.get_json() or {}
    plan = next((p for p in store.duty_plans if p['id'] == plan_id), None)
    if not plan:
        return jsonify({"success": False, "error": f"Plan '{plan_id}' not found"}), 404

    if 'supervisorStatus' in payload:
        plan['supervisorStatus'] = payload['supervisorStatus']
    if 'supervisorNotes' in payload:
        plan['supervisorNotes'] = payload['supervisorNotes']
    if 'tasks' in payload:
        plan['tasks'] = payload['tasks']

    return jsonify({"success": True, "data": plan})

# ========================================================
# 5. COOLING FACILITIES ENDPOINTS
# ========================================================
@app.route('/api/facilities', methods=['GET'])
def list_facilities():
    return jsonify({
        "success": True,
        "count": len(store.cooling_priorities),
        "data": store.cooling_priorities
    })

@app.route('/api/facilities/<facility_id>', methods=['PUT'])
def update_facility(facility_id):
    payload = request.get_json() or {}
    item = next((f for f in store.cooling_priorities if f['id'] == facility_id), None)
    if not item:
        return jsonify({"success": False, "error": f"Facility priority '{facility_id}' not found"}), 404

    if 'status' in payload and payload['status'] in ['Needed', 'In Progress', 'Installed']:
        item['status'] = payload['status']
    if 'proposedAction' in payload:
        item['proposedAction'] = payload['proposedAction']
    item['lastUpdated'] = "Just now (Supervisor update)"

    return jsonify({"success": True, "data": item})

# ========================================================
# 6. NUGEN AI SAFETY ASSISTANT ENDPOINT
# ========================================================
@app.route('/api/assistant/chat', methods=['POST'])
def assistant_chat():
    payload = request.get_json() or {}
    message = payload.get('message', '').strip()
    if not message:
        return jsonify({"error": "Message is required and must not be empty"}), 400

    context = payload.get('context', {})
    language = payload.get('language', 'en')

    # Strict backend proxy to Nugen API
    result = call_nugen_chat(message=message, context=context, language=language)
    status_code = 200 if result.get('success') else (503 if not result.get('configured') else 502)
    return jsonify(result), status_code

@app.route('/api/assistant/status', methods=['GET'])
def assistant_status():
    is_conf = Config.is_nugen_configured()
    return jsonify({
        "configured": is_conf,
        "provider": "Nugen API",
        "model": Config.NUGEN_MODEL,
        "endpoint": Config.NUGEN_API_ENDPOINT,
        "activeEngine": f"Nugen API ({Config.NUGEN_MODEL})" if is_conf else "Awaiting NUGEN_API_KEY in .env",
        "hasKey": is_conf,
        "note": "Nugen API is the sole permitted AI service. No secondary AI services permitted."
    })

@app.route('/api/assistant/test-connection', methods=['GET'])
def assistant_test_connection():
    if not Config.is_nugen_configured():
        return jsonify({
            "success": False,
            "configured": False,
            "model": Config.NUGEN_MODEL,
            "message": "NUGEN_API_KEY is not configured in backend environment (.env).",
            "hint": "Set NUGEN_API_KEY=your_actual_key in .env to connect with Nugen API."
        }), 400

    test_res = call_nugen_chat(
        message="Respond with exactly: 'HeatShield AI Nugen connection verified.'",
        language="en"
    )

    if test_res.get('success'):
        return jsonify({
            "success": True,
            "configured": True,
            "model": Config.NUGEN_MODEL,
            "message": "Successfully authenticated and connected with Nugen API!",
            "sampleResponse": test_res.get('reply')
        })
    else:
        return jsonify({
            "success": False,
            "configured": True,
            "model": Config.NUGEN_MODEL,
            "error": test_res.get('error'),
            "message": test_res.get('message'),
            "details": test_res.get('details')
        }), 502

# ========================================================
# 7. REPORTS & ANALYTICS ENDPOINT
# ========================================================
@app.route('/api/reports/summary', methods=['GET'])
def reports_summary():
    junctions = store.junctions
    total = len(junctions)
    high_count = sum(1 for j in junctions if j.get('riskCategory') == 'High')
    mod_count = sum(1 for j in junctions if j.get('riskCategory') == 'Moderate')
    low_count = sum(1 for j in junctions if j.get('riskCategory') == 'Low')
    avg_score = round(sum(j.get('riskScore', 0) for j in junctions) / max(1, total), 1)
    avg_temp = round(sum(j.get('temp', 0) for j in junctions) / max(1, total), 1)
    total_officers = sum(j.get('vulnerableStaffCount', 0) for j in junctions)

    return jsonify({
        "success": True,
        "summary": {
            "totalJunctions": total,
            "highRiskCount": high_count,
            "moderateRiskCount": mod_count,
            "lowRiskCount": low_count,
            "averageRiskScore": avg_score,
            "averageTemperature": avg_temp,
            "totalAssignedOfficers": total_officers,
            "coolingFacilitiesAttention": sum(1 for f in store.cooling_priorities if f['status'] == 'Needed')
        },
        "junctions": junctions,
        "coolingGaps": [f for f in store.cooling_priorities if f['status'] == 'Needed'],
        "dataSource": "Simulated Pune Telemetry - DEMO DATA",
        "generatedAt": datetime.utcnow().isoformat() + "Z"
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)
