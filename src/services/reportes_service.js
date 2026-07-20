import axios from "axios"; //es el mensajero entre Node y FastApi
import { obtenerResumenModel, obtenerVentasMensualesModel, obtenerProductosMasVendidosModel, obtenerStockModel, obtenerClientesTopModel } from "../models/reportes_model.js";

// Servicio para generar el resumen gerencial
export const obtenerResumenReportesService = async () => {
    try {
        const datos = await obtenerResumenModel();

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
 //service para ventas mensuales
export const obtenerVentasMensualesService = async () => {

    const datos = await obtenerVentasMensualesModel();

    const respuesta = await axios.post(
        `${process.env.FASTAPI_URL}/reportes/ventas-mensuales`,
        {
            ventas_mensuales: datos
        }
    );
    return respuesta.data;

}
// service para obtener los productos mas vendidos
export const obtenerProductosMasVendidosService = async () => {

    const datos = await obtenerProductosMasVendidosModel();

    const respuesta = await axios.post(
        `${process.env.FASTAPI_URL}/reportes/productos-mas-vendidos`,
        {
            productos: datos
        }
    );
    return respuesta.data;

}

//Service para obtener stock mas critico
export const obtenerStockCriticoService = async () => {

    const datos = await obtenerStockModel();
    const respuesta = await axios.post(
        `${process.env.FASTAPI_URL}/reportes/stock-critico`,
        {
            stock: datos
        }
    );
    return respuesta.data;

}

// Service para obtener los mejores clientes
export const obtenerClientesTopService = async () => {
    const datos = await obtenerClientesTopModel();
    const respuesta = await axios.post(
        `${process.env.FASTAPI_URL}/reportes/clientes-top`,
        {
            clientes: datos
        }
    );
    return respuesta.data;

}

