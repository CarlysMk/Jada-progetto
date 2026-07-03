import logging

from fastapi import FastAPI

from app.routers import alarms
from app.services.jada_client import jada_client

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Impianto Fotovoltaico - Backend")

app.include_router(alarms.router)


@app.on_event("startup")
def startup() -> None:
    """Effettua subito il login su JADA all'avvio del server."""
    jada_client.login()


@app.on_event("shutdown")
def shutdown() -> None:
    jada_client.close()


@app.get("/health")
def health():
    return {"status": "ok"}
