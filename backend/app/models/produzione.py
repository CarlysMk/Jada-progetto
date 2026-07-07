from pydantic import BaseModel


class ProduzionePunto(BaseModel):
    data: str
    produzione: float | None
    produzionestima: float | None
    