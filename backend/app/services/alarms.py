"""
Prende la risposta che arriva da JADA 
e la converte nella forma attesa dal front-end
"""

import json
import logging
from datetime import date as date_type
from datetime import datetime, time, timedelta
from zoneinfo import ZoneInfo

from app.config import settings
from app.models.allarme import AllarmeOut, AllarmiPaginati, Livello
from app.services.jada_client import jada_client

logger = logging.getLogger(__name__)

fusOrario = ZoneInfo("Europe/Rome")

Livelli_Validi: set[Livello] = {"Minor", "Warning", "Major"}

Campi_Ricerca_Globale = [
    "plantName", "companyName", "groupName", "deviceName", "levelText", "description",
]


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


def range_giorno_utc(giorno: date_type) -> tuple[str, str]:
    inizio_locale = datetime.combine(giorno, time.min, tzinfo=fusOrario)
    fine_locale = datetime.combine(giorno + timedelta(days=1), time.min, tzinfo=fusOrario)

    inizio_utc = inizio_locale.astimezone(ZoneInfo("UTC"))
    fine_utc = fine_locale.astimezone(ZoneInfo("UTC"))

    formato = "%Y-%m-%dT%H:%M:%SZ"
    return inizio_utc.strftime(formato), fine_utc.strftime(formato) 

def condizione_semplice(campo: str, operatore: str, valore) -> list:
    return [campo, operatore, valore]


def gruppo_or(condizioni: list[list]) -> list:
    risultato: list = []
    for i, cond in enumerate(condizioni):
        if i > 0:
            risultato.append("or")
        risultato.append(cond)
    return risultato


def combina_and(condizioni: list) -> list | None:
    if not condizioni:
        return None
    if len(condizioni) == 1:
        return condizioni[0]
    
    risultato: list = [condizioni[0]]
    for cond in condizioni[1:]:
        risultato.append("and")
        risultato.append(cond)
    return risultato


def costruisci_filtro(
    stato: str | None,
    livello: str | None,
    impianto: str | None,
    azienda: str | None,
    gruppo: str | None,
    dispositivo: str | None,
    descrizione: str| None,
    Ricerca_globale: str | None,
    data_inizio: date_type | None,
    data_fine: date_type | None,
) -> list | None:
    condizioni: list  = []

    if stato == "on":
        condizioni.append(condizione_semplice("state", "=", 0))
    elif stato == "off":
        condizioni.append(condizione_semplice("state", "=", 1))

    if livello:
        condizioni.append(condizione_semplice("levelText", "=", livello))

    if impianto:
        condizioni.append(condizione_semplice("plantName", "contains", impianto))
    if azienda:
        condizioni.append(condizione_semplice("companyName", "contains", azienda))
    if gruppo:
        condizioni.append(condizione_semplice("grouppName", "contains", gruppo))
    if dispositivo :
        condizioni.append(condizione_semplice("deviceName", "contains", dispositivo))
    if descrizione:
        condizioni.append(condizione_semplice("description", "contains", descrizione))

    if data_inizio:
        inizio_utc, fine_utc = range_giorno_utc(data_inizio)
        condizioni.append(condizione_semplice("startTime",">=", inizio_utc))
        condizioni.append(condizione_semplice("startTime", "<", fine_utc))

    if data_fine:
        inizio_utc, fine_utc = range_giorno_utc(data_fine)
        condizioni.append(condizione_semplice("endTime", ">=", inizio_utc))
        condizioni.append(condizione_semplice("endTime", "<", fine_utc))


    if Ricerca_globale:
        gruppo_campi = [
            condizione_semplice(campo, "contains", Ricerca_globale)
            for campo in Campi_Ricerca_Globale
        ]
        condizioni.append(gruppo_or(gruppo_campi))

    return combina_and(condizioni)


def get_alarms(
        skip: int,
        take: int,
        stato: str | None = None,
        livello: str | None = None,
        impianto: str | None = None,
        azienda: str | None = None,
        gruppo: str | None = None,
        dispositivo: str | None = None,
        descrizione: str | None = None,
        ricerca_globale: str | None = None,
        data_inizio: date_type | None = None,
        data_fine: date_type | None = None,
) -> AllarmiPaginati:
    filtro = costruisci_filtro(
        stato, livello, impianto, azienda, gruppo, dispositivo, descrizione, 
        ricerca_globale, data_inizio, data_fine,
    )

    params = {
        "requireTotalCount": "true",
        "requireGroupCount": "false",
        "isCountQuery": "false",
        "isSummaryQuery": "false",
        "skip": skip,
        "take": take,
        "sort": "[]",
        "group": "[]",
        "filter": json.dumps(filtro) if filtro is not None else"[]",
        "totalSummary": "[]",
        "groupSummary": "[]",
        "select": "[]",
    }

    response = jada_client.get("/alarms", params=params)
    payload = response.json()

    items = [trasforma_allarme(raw) for raw in payload["data"]]
    total = payload.get("totalCount", len(items))

    return AllarmiPaginati(items=items, total=total)