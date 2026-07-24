// reutilizar modelos ya hechos para no duplicar codigo:
import {obtenerVentasMensualesModel, obtenerProductosMasVendidosModel, obtenerStockModel, obtenerClientesTopModel} from "./reportes_model.js";

export const obtenerDatosIAModel = async () => {
    try {
        const [
            ventas_mensuales,
            productos,
            stock,
            clientes
        ] = await Promise.all([

            obtenerVentasMensualesModel(),
            obtenerProductosMasVendidosModel(),
            obtenerStockModel(),
            obtenerClientesTopModel()
        ]);

        return {
            ventas_mensuales,
            productos,
            stock,
            clientes
        };

    } catch (error) {
        console.error("Error al obtener datos para IA:", error.message);
        throw new Error("No se pudieron obtener los datos para la IA.");
    }

};