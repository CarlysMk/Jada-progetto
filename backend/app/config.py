"""
Configurazione centralizzata dell'applicazione

le variabili vengono lette dal file .env
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # --- JADA API ---
    jada_base_url: str = "https://jada-api.staging.nyox.it"
    jada_email: str
    jada_password: str

    # --- Impianto ---
    plant_id: int
    plant_unique_code: str

    # --- App ---
    app_env: str = "development"


# Istanza singola, importata ovunque serva la configurazione
settings = Settings()
