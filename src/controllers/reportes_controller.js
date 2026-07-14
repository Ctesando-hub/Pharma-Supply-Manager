import { obtenerResumenReportesService } from "../services/reportes_service.js";

export const obtenerResumenReporte = async (req, res) => {
    try {

        const reporte = await obtenerResumenReportesService();
        return res.status(200).json({
            message: "Reporte generado correctamente",
            data: reporte
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al generar el reporte",
            error: error.message
        });

    }

};