import pandas as pd #importamos la libreria pandas
#Pandas nos permite trabajar con datos como si fueran tablas de Excel.

def generar_inteligencia(datos): #Funcion tiene datos como parametro. será el JSON que llega desde Node.js mediante Axios.
    print("PRODUCTOS RECIBIDOS POR IA")
    print(pd.DataFrame(productos))
    print("CLIENTES RECIBIDOS")
    print(pd.DataFrame(clientes))
    ventas = datos.get("ventas_mensuales", []) #dentro del json buscamos la clave ventas_mensuales, sino un [] por defecto
    productos = datos.get("productos", [])
    stock = datos.get("stock", [])
    clientes = datos.get("clientes", [])

    resultado = { "resumen": {}, "recomendaciones": [], "alertas": [] #creamos la estructura de la repuesta
    }

    # Análisis de ventas
    if len(ventas) > 0: #verificamos si hay ventas

        df_ventas = pd.DataFrame(ventas) #convertimos la lista en un dataframe listo para analisis

        df_ventas["ventas"] = pd.to_numeric( #convertir ventas a numeros
            df_ventas["ventas"],
            errors="coerce"# si encuentra algo invalido lo convierte a NaN
        )


        total_ventas = df_ventas["ventas"].sum() #suma las ventas

        mejor_mes = df_ventas.loc[
            df_ventas["ventas"].idxmax() #busca el mes con mas ventas, idmax busca el indice del valor mas grande
        ]

        resultado["resumen"]["ventas_totales"] = float(total_ventas) #se guarda los resultados
        resultado["resumen"]["mejor_mes"] = mejor_mes["mes"]
        
        resultado["recomendaciones"].append(
            f"Reforzar las estrategias comerciales implementadas durante el mes de {mejor_mes['mes']}, ya que registró el mayor volumen de ventas."
        )

    # Productos más vendidos
    if len(productos) > 0:  #si hay productos lo convierte en dataframe
        df_productos = pd.DataFrame(productos)

        print(df_productos)
        print(df_productos.dtypes)

        df_productos["cantidad"] = pd.to_numeric(
            df_productos["cantidad"],
            errors="coerce"
        )

        print(df_productos["cantidad"])
        print(df_productos["cantidad"].dtype)

        print("IDXMAX:", df_productos["cantidad"].idxmax())

        producto_top = df_productos.loc[
            df_productos["cantidad"].idxmax()
        ]

        print(producto_top)
            
        

        resultado["recomendaciones"].append(
            f"El producto '{producto_top['nombre']}' registra la mayor rotación de ventas. Se recomienda mantener un seguimiento de su disponibilidad para evitar faltantes.") #lo agrega a la lista con append

    # Análisis de stock
    if len(stock) > 0:

        df_stock = pd.DataFrame(stock)
        
        criticos = df_stock[(df_stock["cantidad_disponible"] > 0) & (df_stock["cantidad_disponible"] <= df_stock["punto_reposicion"])] #busca productos cuyo stock actual sea menor o igual al mínimo permitido

        sin_stock = df_stock[(df_stock["cantidad_disponible"] == 0) &(df_stock["punto_reposicion"] > 0)]

        sin_configurar = df_stock[(df_stock["cantidad_disponible"] == 0) & (df_stock["punto_reposicion"] == 0)]
        
        if len(criticos) > 0:
            resultado["alertas"].append(
                f"Hay {len(criticos)} productos con stock crítico.")

        if len(sin_stock) > 0:
            resultado["alertas"].append(
                f"Hay {len(sin_stock)} productos sin stock.")

        if len(sin_configurar) > 0:
            resultado["alertas"].append(
                f"Hay {len(sin_configurar)} productos sin configurar.")
                    
        resultado["recomendaciones"].append(
                "Programar una reposición de los productos con stock crítico para evitar faltantes.")


    # Clientes
    if len(clientes) > 0:

        df_clientes = pd.DataFrame(clientes)

        print(df_clientes)
        print(df_clientes.dtypes)

        df_clientes["total"] = pd.to_numeric(
            df_clientes["total"],
            errors="coerce"
        )

        print(df_clientes["total"])
        print(df_clientes["total"].dtype)

        print("IDXMAX CLIENTE:", df_clientes["total"].idxmax())

        cliente_top = df_clientes.loc[
            df_clientes["total"].idxmax()
        ]

        print(cliente_top)

        resultado["recomendaciones"].append(
            f"'{cliente_top['nombre']}' concentra el mayor volumen de compras. Mantener una estrategia de fidelización puede contribuir a sostener este nivel de facturación.")# f nos permite meter variables en el texto

    return resultado