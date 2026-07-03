from typing import Literal

from pydantic import BaseModel

Livello = Literal["Minor", "Warning", "Major"]


class AllarmeOut(BaseModel):
    id: int
    stato: bool
    impianto: str
    azienda: str
    gruppo: str
    dispositivo: str
    livello: Livello
    dataInizio: str
    dataFine: str | None
    durata: str | None
    descrizione: str