from pydantic import BaseModel


class ProduzionePunto(BaseModel):
    timestamp: str
    produzione: float | None
    produzioneStima: float | None
    