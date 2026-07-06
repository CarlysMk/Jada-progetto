"""
Router per il grafico di produzione impianto
"""

from datetime import date as date_type

from fastapi import APIRouter, Query

from app.models.produzione import ProduzionePunto
from app.services import production as production_service

router= APIRouter(prefix="/production", tags=["production"])


@router.get("", response_model=list[ProduzionePunto])
def get_production(
    date: date_type = Query(..., description="Giorno di riferimento"),
    resolution: str = Query("day", pattern="^(day|week)"),
):
    return production_service.get_production(date=date, resolution=resolution)