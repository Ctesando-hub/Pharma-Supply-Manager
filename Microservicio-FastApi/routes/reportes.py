from fastapi import APIRouter
from services.reportes_service import (
    generar_resumen,
    generar_ventas_mensuales,
    generar_productos_mas_vendidos,
    generar_stock_critico,
    generar_clientes_top
    
)

router = APIRouter()


# ==========================
# Resumen Ejecutivo
# ==========================
@router.post("/reportes/resumen")
def resumen(datos: dict):
    return generar_resumen(datos)


# ==========================
# Ventas Mensuales
# ==========================
@router.post("/reportes/ventas-mensuales")
def ventas_mensuales(datos: dict):
    return generar_ventas_mensuales(datos)


# ==========================
# Productos más vendidos
# ==========================
@router.post("/reportes/productos-mas-vendidos")
def productos_mas_vendidos(datos: dict):
    return generar_productos_mas_vendidos(datos)


# ==========================
# Stock crítico
# ==========================
@router.post("/reportes/stock-critico")
def stock_critico(datos: dict):
    return generar_stock_critico(datos)


# ==========================
# Clientes Top
# ==========================
@router.post("/reportes/clientes-top")
def clientes_top(datos: dict):
    return generar_clientes_top(datos)

