"""
Router per gli allarmi

restituisce i dati nella forma attesa dal front-end
"""

from fastapi import APIRouter

from app.models.allarme import AllarmeOut
from app.services import alarms as alarms_service

router = APIRouter(prefix="/alarms", tags=["alarms"])


@router.get("", response_model=list[AllarmeOut])
def get_alarms():
    return alarms_service.get_alarms()
   