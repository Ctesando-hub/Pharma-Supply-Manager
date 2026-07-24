import {obtenerEstadisticasModel, obtenerMonitorModel, obtenerActividadRecienteModel} from "../models/panel_model.js";
import { obtenerStockModel } from "../models/reportes_model.js";
import logger from "../utils/logger.js";

// Obtener todos los datos del dashboard
export const obtenerDashboardService = async () => {
    try {
        const [
            estadisticas,
            monitor,
            actividad,
            stock
        ] = await Promise.all([ //estamos ejecutando 4 funciones independientes al mismo tiempo
            obtenerEstadisticasModel(),
            obtenerMonitorModel(),
            obtenerActividadRecienteModel(),
            obtenerStockModel()
        ]);


        // Calcular stock crítico reutilizando lógica existente
        const stockCritico = stock.filter(producto =>
            producto.cantidad_disponible > 0 &&
            producto.cantidad_disponible <= producto.punto_reposicion
        );


        return {
            estadisticas,
            monitor: {
                ...monitor,
                stock_critico: stockCritico.length
            },
            actividad
        };


    } catch (error) {
        logger.error(
            `Error al obtener datos del dashboard: ${error.message}`
        );
        throw new Error(
            "No se pudieron obtener los datos del dashboard."
        );

    }

};