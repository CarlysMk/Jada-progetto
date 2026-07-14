import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import alarms, production
from app.services.jada_client import jada_client

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Impianto Fotovoltaico - Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(alarms.router)
app.include_router(production.router)


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
