import { getConnection } from "../config/dbConnection.js";

// Obtener datos para reportes gerenciales
export const obtenerDatosReportesModel = async () => {
    const conn = await getConnection();
    try {
        const [rows] = await conn.execute(`
            SELECT
                p.fecha,
                p.id_pedido,
                dp.id_producto,
                pr.nombre AS producto,
                cl.nombre AS cliente,
                s.nombre AS sucursal,
                dp.cantidad,
                dp.precio_unitario,
                dp.subtotal
            FROM pedidos p
            INNER JOIN detalles_pedidos dp ON p.id_pedido = dp.id_pedido
            INNER JOIN productos pr ON dp.id_producto = pr.id_producto 
            INNER JOIN clientes cl ON p.id_cliente = cl.id_cliente
            INNER JOIN sucursales s ON p.id_sucursal = s.id_sucursal  
            WHERE p.id_estado = 3
            ORDER BY p.fecha ASC
        `);

        return rows;
    } catch (error) {
        console.error("Error al obtener datos para reportes:", error.message);
        throw new Error("No se pudieron obtener los datos para los reportes.");
    } finally {
        await conn.end();
    }

};