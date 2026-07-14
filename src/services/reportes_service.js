import axios from "axios"; //es el mensajero entre Node y FastApi
import { obtenerDatosReportesModel } from "../models/reportes_model.js";

// Servicio para generar el resumen gerencial
export const obtenerResumenReportesService = async () => {
    try {
        const datos = await obtenerDatosReportesModel();

        //  Enviar los datos al microservicio FastAPI
        const respuesta = await axios.post(
            `${process.env.FASTAPI_URL}/reportes/resumen`,
            {
                detalles_pedidos: datos
            }
        );

        //  Devolver la respuesta del microservicio
        return respuesta.data;

    } catch (error) {
        console.error("Error al generar el reporte:", error.message);
        throw new Error("No se pudo generar el reporte gerencial.");

    }

};