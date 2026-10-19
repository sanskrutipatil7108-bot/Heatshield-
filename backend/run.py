import os
import sys

# Ensure backend package is in python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.main import app
from app.config import Config

if __name__ == '__main__':
    print(f"[HeatShield AI] Python Flask Backend starting on http://0.0.0.0:{Config.PORT}")
    print(f"[HeatShield AI] Nugen API Endpoint: {Config.NUGEN_API_ENDPOINT}")
    print(f"[HeatShield AI] Nugen Model: {Config.NUGEN_MODEL}")
    print(f"[HeatShield AI] Nugen Configured: {Config.is_nugen_configured()}")
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)
