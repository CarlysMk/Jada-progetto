"""
Prende la risposta che arriva da JADA 
e la converte nella forma attesa dal front-end
"""

import logging

from app.models.allarme import AllarmeOut, Livello
from app.services.jada_client import jada_client

logger = logging.getLogger(__name__)

Livelli_Validi: set[Livello] = {"Minor", "Warning", "Major"}


def formatta_durata(minuti: float | None) -> str |None:
    if minuti is None:
        return None
    
    ore = int(minuti // 60)
    minuti_residui = int(minuti % 60)

    if ore == 0:
        return f"{minuti_residui}m"
    return f"{ore}h {minuti_residui}m"


def trasforma_allarme(raw: dict) -> AllarmeOut:
    livello = raw.get("levelText")
    if  livello not in Livelli_Validi:
        logger.warning(
            "valore inatteso, passo Warning",
            livello,
            raw.get("id"),
        )
        livello = "Warning"

    return AllarmeOut(
        id=raw["id"],
        stato=(raw["state"] == 0),
        impianto=raw.get("plantName") or "",
        azienda=raw.get("companyName") or "",
        gruppo=raw.get("groupName") or "",
        dispositivo=raw.get("deviceName") or "",
        livello=livello,
        dataInizio=raw["startTime"],
        dataFine=raw.get("endTime"),
        durata=formatta_durata(raw.get("durationInMinutes")),
        descrizione=raw.get("description") or "",
    )


def get_alarms() -> list[AllarmeOut]:
    params = {
        "requireTotalCount": "true",
        "requireGroupCount": "false",
        "isCountQuery": "false",
        "isSummaryQuery": "false",
        "skip": 0,
        "take": 10,
        "sort": "[]",
        "group": "[]",
        "filter": "[]",
        "totalSummary": "[]",
        "groupSummary": "[]",
        "select": "[]",
    }

    response = jada_client.get("/alarms", params=params)
    payload = response.json()

    return [trasforma_allarme(raw) for raw in payload["data"]]