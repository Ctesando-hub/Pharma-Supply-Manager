import pandas as pd #importa la libreria python

def generar_resumen(datos): #datos es el parametro y  será el JSON que le envía el backend Node.js.
    
    detalles_pedidos = datos.get("detalles_pedidos", []) #get pide los pedidos y si no hay que traiga una lista vacia []
    
    if len(detalles_pedidos) == 0: #Si la lista esta vacia entra al if
        return{
            "mensaje": "No se recibieron pedidos de los clientes" #muestra un mensaje
        }
        
    df = pd.DataFrame(detalles_pedidos)    #Convierte la lista de pedidos en una tabla de Pandas.(tipo excel)

        # Convertir subtotal a número
    df["subtotal"] = pd.to_numeric(
        df["subtotal"],
        errors="coerce")

    return {
            "cantidad_detalles_pedidos": len(df),
            "cantidad_pedidos": int(df["id_pedido"].nunique()),
            "ventas_totales": float(df["subtotal"].sum()), #Con float() nos aseguramos de devolver un número estándar de Python.
            "cantidad_productos": int(df["id_producto"].nunique()) #significa number of unique values (cantidad de valores únicos).

}
        
        
    #Endpoint para ventas mensuales
def generar_ventas_mensuales(datos):
        ventas_mensuales = datos.get("ventas_mensuales", []) #Busca la clave "ventas_mensuales" dentro del JSON.

        if len(ventas_mensuales) == 0:
            return { #Si no llegaron datos, devuelve un mensaje.
                "mensaje": "No se recibieron datos de ventas mensuales"
            }

        df = pd.DataFrame(ventas_mensuales) #Convierte la lista de diccionarios en un DataFrame.

        return {
            "meses": df["mes"].tolist(), #Selecciona la columna mes y la convierte en una lista de Python.
            "ventas": df["ventas"].tolist()
        }