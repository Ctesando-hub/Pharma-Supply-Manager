import { getConnection } from "../config/dbConnection.js";
import logger from "../utils/logger.js";


// Estadísticas de las tarjetas superiores
export const obtenerEstadisticasModel = async () => {
    const conn = await getConnection();
    try {

        // Stock total
        const [[stock]] = await conn.execute(`
            SELECT SUM(cantidad_disponible) AS stock_total
            FROM stock
        `);

        // Usuarios activos
        const [[usuarios]] = await conn.execute(`
            SELECT
                COUNT(*) AS usuarios_totales,
                SUM(CASE WHEN activo = 1 THEN 1 ELSE 0 END) AS usuarios_activos
            FROM usuarios
            WHERE eliminado IS NULL`);

        // Pedidos pendientes
        const [[pedidos]] = await conn.execute(`
            SELECT
            COUNT(*) AS pedidos_totales,
            SUM(CASE WHEN id_estado IN (1,2) THEN 1 ELSE 0 END) AS pedidos_pendientes
            FROM pedidos`);

        // Clientes registrados
        const [[clientes]] = await conn.execute(`
            SELECT COUNT(*) AS clientes_registrados
            FROM clientes
            WHERE cliente_eliminado IS NULL;`);  

        return {
            stock_total: Number(stock.stock_total) || 0,
            usuarios_activos: usuarios.usuarios_activos,
            usuarios_totales: usuarios.usuarios_totales,
            pedidos_pendientes: pedidos.pedidos_pendientes,
            clientes_registrados: clientes.clientes_registrados
        };

    } catch (error) {
        logger.error(`Error al obtener las estadísticas del panel: ${error.message}`);
        throw new Error("No se pudieron obtener las estadísticas del panel.");

    } finally {
        await conn.end();
    }

};


// Model para los datos Monitor
export const obtenerMonitorModel = async () => {
    const conn = await getConnection();
    try {
        const [[productos]] = await conn.execute(`
            SELECT COUNT(*) AS total_productos
            FROM productos
            WHERE prod_eliminado IS NULL`);

        const [[pedidos]] = await conn.execute(`
            SELECT COUNT(*) AS pedidos_espera
            FROM pedidos
            WHERE id_estado IN (1,2)`);

        return {
            total_productos: productos.total_productos,
            pedidos_espera: pedidos.pedidos_espera
        };

    } catch (error) {
        logger.error(`Error al obtener el monitor del panel: ${error.message}`);
        throw new Error("No se pudieron obtener los datos del monitor.");

    } finally {
        await conn.end();
    }

};



// Actividad reciente
export const obtenerActividadRecienteModel = async () => {
    const conn = await getConnection();

    try {

        const [actividad] = await conn.execute(`
            SELECT
                p.fecha,
                'pedido' AS tipo,
                'Pedido realizado' AS titulo,
                c.nombre AS detalle
            FROM pedidos p
            INNER JOIN clientes c
                ON p.id_cliente = c.id_cliente

            UNION ALL

            SELECT
                co.fecha,
                'compra' AS tipo,
                'Compra registrada' AS titulo,
                pr.nombre AS detalle
            FROM compras co
            INNER JOIN proveedores pr
                ON co.id_proveedor = pr.id_proveedor

            ORDER BY fecha DESC
            LIMIT 5`);

        return actividad;

    } catch (error) {
        logger.error(`Error al obtener la actividad reciente: ${error.message}`);
        throw new Error("No se pudo obtener la actividad reciente.");

    } finally {
        await conn.end();

    }
};