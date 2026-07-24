import axios from "axios"; //libreria para hacer peticiones HTTP
import { obtenerDatosIAModel } from "../models/ia_model.js";

// Servicio para generar el análisis de IA
export const obtenerInteligenciaService = async () => {
    try {

        const datos = await obtenerDatosIAModel();

        const respuesta = await axios.post(
            `${process.env.FASTAPI_URL}/ia`,
            datos
        );

        return respuesta.data;

    } catch (error) {
        console.error("Error al generar el análisis de IA:", error.message);
        throw new Error("No se pudo generar el análisis inteligente.");
    }

}