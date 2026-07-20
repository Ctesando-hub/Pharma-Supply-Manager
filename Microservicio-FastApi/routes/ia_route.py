from fastapi import APIRouter #importar la clase Apirouter de FastApi
from services.ia_service import generar_inteligencia #importar la funcion generar_inteligencia

router = APIRouter() #genera el objeto router, es como un contenedor de endpoitns

@router.post("/ia")  # @es un decorador. le dice a FastApi que se va a ejecutar las funciones cuando se haga un post a /ia
def inteligencia(datos: dict): #funcion que tiene datos como parametro que es un diccionario
    return generar_inteligencia(datos) 