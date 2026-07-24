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
        errors="coerce").fillna(0)
    
        # Ventas reales (pedidos completados)
    df_completados = df[
        df["id_estado"] == 3
    ]

    ventas_totales = df_completados["subtotal"].sum()
    
        # Clientes activos (pedidos pendientes o en proceso)
    df_activos = df[
        df["id_estado"].isin([1, 2])
    ]

    cantidad_clientes = df_activos["id_cliente"].nunique()

    return {
            "cantidad_detalles_pedidos": len(df),
            "cantidad_pedidos": int(df["id_pedido"].nunique()),
            "ventas_totales": float(ventas_totales), #Con float() nos aseguramos de devolver un número estándar de Python.
            "cantidad_productos": int(df["id_producto"].nunique()), #significa number of unique values (cantidad de valores únicos).
            "cantidad_clientes": int(cantidad_clientes)
}
        
        
    #Endpoint para ventas mensuales
def generar_ventas_mensuales(datos):
    ventas_mensuales = datos.get("ventas_mensuales", [])

    if len(ventas_mensuales) == 0:
        return {
            "mensaje": "No se recibieron datos de ventas mensuales"
        }

    df = pd.DataFrame(ventas_mensuales)

    df["ventas"] = pd.to_numeric(
        df["ventas"],
        errors="coerce"
    ).fillna(0)

    return {
        "meses": df["mes"].tolist(),
        "ventas": df["ventas"].tolist()
    }
    
# Endpoint para productos más vendidos
def generar_productos_mas_vendidos(datos):
    productos = datos.get("productos", [])
    if len(productos) == 0:
        return {
            "mensaje": "No hay productos vendidos."
        }
    df = pd.DataFrame(productos)

    # Convertir cantidad a número
    df["cantidad"] = pd.to_numeric(df["cantidad"],errors="coerce")

    # Ordenar de mayor a menor
    df = df.sort_values(by="cantidad", ascending=False)
    print(df)
    return {
        "productos": df.to_dict(orient="records")
    }

#Endpoint para stock
def generar_stock_critico(datos):
    stock = datos.get("stock", [])

    if len(stock) == 0:
        return {
            "mensaje":"No hay datos."
        }

    df = pd.DataFrame(stock)

    criticos = df[(df["cantidad_disponible"] > 0) &(df["cantidad_disponible"] <= df["punto_reposicion"])]

    return {
        "productos": criticos.to_dict(orient="records")
    } 
    
#Endpoint mejores clientes  
def generar_clientes_top(datos):

    clientes = datos.get("clientes", [])

    if len(clientes) == 0:
        return {
            "mensaje":"No hay datos."
        }

    df = pd.DataFrame(clientes)
    df["total"] = pd.to_numeric(df["total"], errors="coerce")

    df = df.sort_values(by="total", ascending=False)

    return {
        "clientes": df.to_dict(orient="records")
    }
    