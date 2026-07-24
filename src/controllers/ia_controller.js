import { obtenerInteligenciaService } from "../services/ia_service.js";

// Controller para Inteligencia Artificial
export const obtenerInteligencia = async (req, res) => {
    try {
        const analisis = await obtenerInteligenciaService();

        return res.status(200).json({
            message: "Análisis de IA generado correctamente",
            data: analisis
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al generar el análisis de IA",
            error: error.message
        });

    }
};