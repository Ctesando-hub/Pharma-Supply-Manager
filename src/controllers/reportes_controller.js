import { obtenerResumenReportesService, obtenerVentasMensualesService, obtenerProductosMasVendidosService, obtenerStockCriticoService, obtenerClientesTopService } from "../services/reportes_service.js";

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

// Ventas Mensuales
export const obtenerVentasMensualesReporte = async (req, res) => {
    try {
        const reporte = await obtenerVentasMensualesService();
        return res.status(200).json({
            message: "Reporte de ventas mensuales generado correctamente",
            data: reporte
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al generar el reporte de ventas mensuales",
            error: error.message
        });

    }
};



// Productos más vendidos
export const obtenerProductosMasVendidosReporte = async (req, res) => {
    try {
        const reporte = await obtenerProductosMasVendidosService();
        return res.status(200).json({
            message: "Reporte de productos más vendidos generado correctamente",
            data: reporte
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al generar el reporte de productos más vendidos",
            error: error.message
        });

    }
};

// Stock Crítico
export const obtenerStockCriticoReporte = async (req, res) => {
    try {
        const reporte = await obtenerStockCriticoService();
        return res.status(200).json({
            message: "Reporte de stock crítico generado correctamente",
            data: reporte
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al generar el reporte de stock crítico",
            error: error.message
        });

    }
};



// Clientes Top
export const obtenerClientesTopReporte = async (req, res) => {
    try {

        const reporte = await obtenerClientesTopService();

        return res.status(200).json({
            message: "Reporte de clientes top generado correctamente",
            data: reporte
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Error al generar el reporte de clientes top",
            error: error.message
        });

    }
};