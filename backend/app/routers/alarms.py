"""
Router per gli allarmi

restituisce i dati nella forma attesa dal front-end
"""

from datetime import date as date_type

from fastapi import APIRouter, Query

from app.models.allarme import AllarmiPaginati
from app.services import alarms as alarms_service

router = APIRouter(prefix="/alarms", tags=["alarms"])


@router.get("", response_model=AllarmiPaginati)
def get_alarms(
    skip: int = Query(0, ge=0),
    take: int = Query(10, ge=1, le=500),
    stato: str | None = Query(None, pattern="(on|off)$"),
    livello: str | None = Query(None, pattern="^(Minor|Warning|Major)$"),
    impianto: str | None = None,
    azienda: str | None = None,
    gruppo: str | None = None,
    dispositivo: str | None = None,
    descrizione: str |None = None,
    ricerca: str | None = None,
    dataInizio: date_type | None = None,
    dataFine: date_type | None = None,
):
    return alarms_service.get_alarms(
        skip=skip,
        take=take,
        stato=stato,
        livello=livello,
        impianto=impianto,
        azienda=azienda,
        gruppo=gruppo,
        dispositivo=dispositivo,
        descrizione=descrizione,
        ricerca_globale=ricerca,
        data_inizio=dataInizio,
        data_fine=dataFine,
    )
   