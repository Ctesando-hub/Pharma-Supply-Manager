import { obtenerDashboardService } from "../services/panel_service.js";
import logger from "../utils/logger.js";


// Obtener datos completos del dashboard
export const obtenerDashboard = async (req, res) => {
    try {
        const dashboard = await obtenerDashboardService();
        return res.status(200).json({
            message: "Dashboard obtenido correctamente",
            data: dashboard
        });


    } catch (error) {
        logger.error(
            `Error en controller dashboard: ${error.message}`
        );
        return res.status(500).json({
            message: "Error al obtener datos del dashboard.",
            error: error.message
        });
    }

};