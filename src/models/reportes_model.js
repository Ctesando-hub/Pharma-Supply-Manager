import { getConnection } from "../config/dbConnection.js";

// Obtener datos para reportes gerenciales
export const obtenerResumenModel = async () => {
    const conn = await getConnection();
    try {
        const [rows] = await conn.execute(`
            SELECT
                p.fecha,
                p.id_pedido,
                p.id_cliente,
                p.id_estado,
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
            WHERE p.id_estado IN (1,2,3)
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

export const obtenerVentasMensualesModel = async () => {
    const conn = await getConnection();

    try {
        const [rows] = await conn.execute(`
            SELECT
                DATE_FORMAT(p.fecha,'%M') AS mes,
                SUM(dp.subtotal) AS ventas
            FROM pedidos p
            INNER JOIN detalles_pedidos dp 
                ON p.id_pedido = dp.id_pedido
            WHERE p.id_estado = 3
            GROUP BY DATE_FORMAT(p.fecha,'%M'), MONTH(p.fecha)
            ORDER BY MONTH(p.fecha);`);

        return rows;

    } catch (error) {
        console.error("Error al obtener datos para obtener ventas mensuales:", error.message);
        throw new Error("No se pudieron obtener los datos para el reporte de ventas mensuales.");

    } finally {
        await conn.end();
    }
}

export const obtenerProductosMasVendidosModel = async () => {
const conn = await getConnection();
    try {
        const [rows] = await conn.execute(`
        SELECT
        pr.nombre,
        SUM(dp.cantidad) AS cantidad
        FROM detalles_pedidos dp
        INNER JOIN productos pr ON dp.id_producto=pr.id_producto
        INNER JOIN pedidos p ON p.id_pedido=dp.id_pedido
        WHERE p.id_estado=3
        GROUP BY pr.id_producto
        ORDER BY cantidad DESC;
        `);

        return rows;
    } catch (error) {
        console.error("Error al obtener datos para obtener productos mas vendidos:", error.message);
        throw new Error("No se pudieron obtener los datos para el reporte de productos mas vendidos.");
    } finally {
        await conn.end();
    }    
}

export const obtenerStockModel = async () => {
    const conn = await getConnection();
    try {
        const [rows] = await conn.execute(`
        SELECT
        nombre,
        cantidad_disponible,
        punto_reposicion
        FROM stock
        INNER JOIN productos ON stock.id_producto=productos.id_producto;
        `);

        return rows;
    } catch (error) {
    logger.error(`Error al obtener datos de stock: ${error.message}`);
    throw new Error( "No se pudieron obtener los datos de stock.");

    } finally {
        await conn.end();
    }    
}

export const obtenerClientesTopModel = async () => {
    const conn = await getConnection();
    try {
        const [rows] = await conn.execute(`
        SELECT
        cl.nombre,
        SUM(dp.subtotal) total
        FROM pedidos p
        INNER JOIN clientes cl
        ON p.id_cliente=cl.id_cliente
        INNER JOIN detalles_pedidos dp
        ON p.id_pedido=dp.id_pedido
        WHERE p.id_estado=3 AND cl.cliente_eliminado IS NULL
        GROUP BY cl.id_cliente
        ORDER BY total DESC;
        `);

        return rows;
    } catch (error) {
        console.error("Error al obtener datos para obtener los mejores clientes:", error.message);
        throw new Error("No se pudieron obtener los datos para el reporte de clientes TOP.");
        
    } finally {
        await conn.end();
    }    
}