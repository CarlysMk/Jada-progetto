"""
Prende la risposta che arriva da JADA 
e la converte per il front-end
"""

import logging
from datetime import date as date_type
from typing import Literal

from app.config import settings
from app.models.produzione import ProduzionePunto
from app.services.jada_client import jada_client

logger = logging.getLogger(__name__)

Risoluzione = Literal["day", "week"]

resolution_map: dict[Risoluzione, int] = {
    "day": 1,
    "week": 2,
}


def get_production(date: date_type, resolution: Risoluzione) -> list[ProduzionePunto]:
    params = {
        "plantId": settings.plant_id,
        "date": f"{date.isoformat()}T12:00:00Z",
        "resolution": resolution_map[resolution],
    }

    response = jada_client.get("/charts/plant/real-expected", params=params)
    payload = response.json()

    data_source = payload["dataSource"]
    series = {s["name"]: s for s in payload["series"]}

    campo_argomento = series["Reale"]["argumentField"]
    campo_reale = series["Reale"]["valueField"]
    campo_stima = series["Stima"]["valueField"]

    return [
        ProduzionePunto(
            data=punto[campo_argomento],
            produzione=punto.get(campo_reale),
            produzionestima=punto.get(campo_stima),
        )
        for punto in data_source
    ]
