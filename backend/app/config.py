import os
from pathlib import Path
from dotenv import load_dotenv

# Load from backend directory .env if present, otherwise root .env
root_dir = Path(__file__).resolve().parent.parent.parent
backend_dir = Path(__file__).resolve().parent.parent

if (backend_dir / '.env').exists():
    load_dotenv(backend_dir / '.env')
elif (root_dir / '.env').exists():
    load_dotenv(root_dir / '.env')
else:
    load_dotenv()

class Config:
    PORT = int(os.getenv('PORT', 5000))
    ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = ENV == 'development'

    # NUGEN API CONFIGURATION (SOLE PERMITTED AI SERVICE)
    NUGEN_API_KEY = os.getenv('NUGEN_API_KEY', '').strip()
    NUGEN_API_ENDPOINT = os.getenv('NUGEN_API_ENDPOINT', 'https://api.nugen.in/api/v3').rstrip('/')
    NUGEN_MODEL = os.getenv('NUGEN_MODEL', 'nugen-flash-instruct')

    @classmethod
    def is_nugen_configured(cls) -> bool:
        return bool(cls.NUGEN_API_KEY and len(cls.NUGEN_API_KEY) > 5)
