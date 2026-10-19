"""
Nugen API Service Adapter
=========================
SOLE PERMITTED AI INTEGRATION FOR HEATSHIELD AI.

Handles:
- Calling Nugen API endpoint with Bearer authentication
- Building prompt with bounded structured context
- Strict safety system instructions
- Multi-language instructions (English, Hindi, Marathi)
- Graceful error handling (401 invalid key, timeouts, rate limits)
- Return clearly labeled static safety resources fallback when Nugen is unavailable
"""

import requests
from typing import Dict, Any, Optional
from ..config import Config

STATIC_HEAT_SAFETY_RESOURCES = {
    "protocol_version": "PUNE-TRAFFIC-HEAT-SAFETY-SOP-2026",
    "emergency_helplines": {
        "police_control": "112",
        "ambulance": "108",
        "pune_traffic_helpline": "020-26122880"
    },
    "critical_first_aid": {
        "heat_exhaustion": {
            "symptoms": ["Heavy sweating", "Cool, pale or clammy skin", "Fast, weak pulse", "Dizziness, nausea, headache"],
            "immediate_action": "Move officer immediately to shade, loosen uniform collar/vest, apply cool wet towels to neck and forehead, provide 350-500ml cool water or ORS. Keep under observation for 30 minutes."
        },
        "heatstroke": {
            "symptoms": ["Core body temperature >40°C", "Hot, red, dry or damp skin", "Confusion, slurred speech, delirium", "Loss of consciousness or seizures"],
            "immediate_action": "LIFE-THREATENING EMERGENCY: Call 108/112 immediately. Move to shaded/AC vehicle. Aggressively cool by wetting skin and placing ice/cold wet cloths under armpits, groin, and neck. DO NOT force fluids if unconscious."
        }
    },
    "hydration_guidelines": [
        "Drink 350ml–500ml water or ORS every 20–30 minutes during outdoor duty. Do not wait until thirsty.",
        "Avoid heavy caffeine, sugary energy drinks, or raw unboiled tap water.",
        "Ensure electrolyte replacement (ORS / Electral sachets) during high heat index (>38°C)."
    ],
    "rotation_rules": [
        "High Risk (>75 score): Maximum 40-45 minutes continuous tarmac standing. Mandatory 15-minute shaded rest.",
        "Moderate Risk (45-74 score): Maximum 60 minutes continuous standing. Mandatory 10-15 minute rest.",
        "Low Risk (<45 score): Standard 90-120 minute rotation with baseline hydration."
    ]
}

def build_system_instruction(language: str = "en") -> str:
    lang_code = language if language in ["hi", "mr"] else "en"
    
    if lang_code == "mr":
        lang_directive = "IMPORTANT: Answer entirely in natural, clear, professional Marathi (मराठी) using Devanagari script. Use appropriate administrative and safety terms for Pune traffic police officers."
    elif lang_code == "hi":
        lang_directive = "IMPORTANT: Answer entirely in natural, clear, professional Hindi (हिन्दी) using Devanagari script. Use clear terminology suitable for traffic police officers."
    else:
        lang_directive = "Answer in clear, concise, professional English suitable for public safety professionals."

    return f"""You are the HeatShield AI Safety Assistant, an occupational climate-safety copilot specifically designed for Pune traffic police officers and supervisors on outdoor junction duty.

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
{lang_directive}
"""

def call_nugen_chat(
    message: str,
    context: Optional[Dict[str, Any]] = None,
    language: str = "en"
) -> Dict[str, Any]:
    if not Config.is_nugen_configured():
        return {
            "success": False,
            "configured": False,
            "isAiPowered": False,
            "error": "NUGEN_API_KEY is not configured in backend environment (.env).",
            "message": "Nugen API key missing. Displaying Pune Traffic Police standard heat safety resources.",
            "staticResources": STATIC_HEAT_SAFETY_RESOURCES
        }

    system_instruction = build_system_instruction(language)
    
    context_str = ""
    if context:
        junc = context.get("selectedJunction")
        if junc:
            context_str += f"\nActive Junction Context: {junc.get('name')} | Temp: {junc.get('temp')}°C | Humidity: {junc.get('humidity')}% | Risk: {junc.get('riskScore')}/100 ({junc.get('riskCategory')}) | Shade: {junc.get('shadePercent')}% | Traffic: {junc.get('traffic')} | Water Nearby: {junc.get('drinkingWaterNearby')}"
        if context.get("weather"):
            w = context.get("weather")
            context_str += f"\nRegional Pune Ambient: {w.get('temperature')}°C, Humidity: {w.get('humidity')}%, Wind: {w.get('windSpeed', 10)} km/h"

    full_prompt = f"{system_instruction}\n\nOPERATIONAL CONTEXT:{context_str}\n\nOFFICER / SUPERVISOR INQUIRY:\n{message}"

    url = f"{Config.NUGEN_API_ENDPOINT}/inference/completions"
    headers = {
        "Authorization": f"Bearer {Config.NUGEN_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": Config.NUGEN_MODEL,
        "prompt": full_prompt,
        "max_tokens": 800,
        "temperature": 0.5,
        "stream": False
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=15)
        
        if response.status_code == 401:
            return {
                "success": False,
                "configured": True,
                "isAiPowered": False,
                "error": "Nugen API returned 401 Unauthorized. The NUGEN_API_KEY in .env was rejected.",
                "message": "Invalid Nugen API credentials. Displaying verified local heat safety SOPs.",
                "staticResources": STATIC_HEAT_SAFETY_RESOURCES
            }
        
        if not response.ok:
            return {
                "success": False,
                "configured": True,
                "isAiPowered": False,
                "error": f"Nugen API request failed with status code {response.status_code}.",
                "details": response.text[:250],
                "staticResources": STATIC_HEAT_SAFETY_RESOURCES
            }

        data = response.json()
        reply_text = (
            data.get("choices", [{}])[0].get("text") or
            data.get("choices", [{}])[0].get("message", {}).get("content") or
            data.get("generated_text") or
            data.get("text") or
            ""
        ).strip()

        if not reply_text:
            return {
                "success": False,
                "configured": True,
                "isAiPowered": False,
                "error": "Nugen returned an empty response.",
                "staticResources": STATIC_HEAT_SAFETY_RESOURCES
            }

        return {
            "success": True,
            "configured": True,
            "isAiPowered": True,
            "reply": reply_text,
            "source": f"Nugen API ({Config.NUGEN_MODEL})",
            "model": Config.NUGEN_MODEL,
            "language": language
        }

    except requests.exceptions.Timeout:
        return {
            "success": False,
            "configured": True,
            "isAiPowered": False,
            "error": "Nugen API request timed out (15s limit).",
            "message": "Network timeout reaching Nugen servers. Displaying offline heat safety SOPs.",
            "staticResources": STATIC_HEAT_SAFETY_RESOURCES
        }
    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "configured": True,
            "isAiPowered": False,
            "error": f"Nugen API network error: {str(e)}",
            "message": "Network connection error contacting Nugen. Displaying offline heat safety SOPs.",
            "staticResources": STATIC_HEAT_SAFETY_RESOURCES
        }
