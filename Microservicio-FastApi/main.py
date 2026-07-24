from fastapi import FastAPI #Importa la clase FASTAPI de la Libreria FASTAPI.
#la clase FastApi permite crear ApiWeb

from routes.reportes import router as reportes_router
from routes.ia_route import router as ia

app = FastAPI() #instancia de la app FastApi
app.include_router(reportes_router) #fastApi incluye ademas las rutas del reporte
app.include_router(ia)

@app.get("/") #endpoint decorador. Le dice que cuando se haga una peticion a la ruta / , se ejecutela funcion de abajo
def inicio(): #funcion inicio que se ejecuta cuando visite el localhost
    return{
        "microservicio": "Pharma Supply Manager IA",
        "estado": "activo"
    }
    

@app.get("/status")
def status():
    return{ "status": "ok"}