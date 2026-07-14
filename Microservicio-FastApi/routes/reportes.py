from fastapi import APIRouter
from services.reportes_service import (generar_resumen, generar_ventas_mensuales)

router = APIRouter()

@router.post("/reportes/resumen")
def resumen(datos: dict):
    return generar_resumen(datos)

@router.post("/reportes/ventas-mensuales")
def ventas_mensuales(datos: dict):
    return generar_ventas_mensuales(datos)