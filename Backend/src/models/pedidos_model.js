import { getConnection } from "../config/dbConnection.js";


// Obtener todos los productos
export const getAllPedidosModel = async () => {
    const conn = await getConnection();
    try {
        const [rows] = await conn.execute(`
            SELECT 
            pe.id_pedido,
            pe.fecha,
            pe.total,
            cl.nombre AS nombre_cliente,
            u.nombre AS usuario_tomoPedido,
            su.nombre AS sucursal,
            e.nombre_estado AS estado
            FROM pedidos pe
            LEFT JOIN clientes cl ON pe.id_cliente = cl.id_cliente
            LEFT JOIN usuarios u ON pe.id_usuario = u.id_usuario
            LEFT JOIN sucursales su ON pe.id_sucursal = su.id_sucursal
            LEFT JOIN estados_pedido e ON pe.id_estado = e.id_estado

        `);
        
        return rows;
    } catch (error) {
        console.error("Error al obtener Pedidos:", error.message);
        throw new Error("No se pudieron obtener los pedidos");
    } finally {
        await conn.end();
    }
};


// Obtener pedido por ID
export const getPedidoByIDModel = async (id) => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`
        SELECT
            pe.id_pedido,
            pe.fecha,
            pe.total,
            cl.nombre AS nombre_cliente,
            u.nombre AS usuario_tomoPedido,
            su.nombre AS sucursal,
            e.nombre_estado AS estado
            FROM pedidos pe
            LEFT JOIN clientes cl ON pe.id_cliente = cl.id_cliente
            LEFT JOIN usuarios u ON pe.id_usuario = u.id_usuario
            LEFT JOIN sucursales su ON pe.id_sucursal = su.id_sucursal
            LEFT JOIN estados_pedido e ON pe.id_estado = e.id_estado
            WHERE pe.id_pedido = ?`, [id]);

    if (rows.length === 0) {
        throw new Error("Pedido no encontrado");
    }
    return rows[0];
    } catch (error) {
    console.error(`Error al obtener pedido con ID ${id}:`, error.message);
    throw new Error("No se pudo obtener el pedido");
    } finally {
    await conn.end();
    }
};

// Buscar pedido por nombre de cliente
export const searchPedidoModel = async (nombre) => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`SELECT  
            pe.id_pedido,
            pe.fecha,
            pe.total,
            cl.nombre AS nombre_cliente,
            u.nombre AS usuario_tomoPedido,
            su.nombre AS sucursal,
            e.nombre_estado AS estado
            FROM pedidos pe
            LEFT JOIN clientes cl ON pe.id_cliente = cl.id_cliente
            LEFT JOIN usuarios u ON pe.id_usuario = u.id_usuario
            LEFT JOIN sucursales su ON pe.id_sucursal = su.id_sucursal
            LEFT JOIN estados_pedido e ON pe.id_estado = e.id_estado
            WHERE LOWER(cl.nombre) LIKE LOWER(?)`, [`%${nombre}%`]);
    return rows;
    } catch (error) {
    console.error("Error al buscar Pedido por nombre del cliente:", error.message);
    throw new Error("No se pudieron buscar pedido del cliente");
    } finally {
    await conn.end();
    }
};

// Crear un nuevo Pedido
export const crearPedidoModel = async (pedido) => {
    const { fecha, total, id_cliente, id_usuario, id_sucursal, id_estado } = pedido;
    const conn = await getConnection();
    try {
    const [result] = await conn.execute(
        "INSERT INTO Pedidos (fecha, total, id_cliente, id_usuario, id_sucursal, id_estado) VALUES (?, ?, ?, ?, ?, ?)",
        [fecha, total, id_cliente, id_usuario, id_sucursal, id_estado]
    );
    return { id: result.insertId, ...pedido};

    } catch (error) {
    console.error("Error al crear pedido:", error.message);
    throw new Error("No se pudo crear el pedido");

    } finally {
    await conn.end();
    }
};

// Actualizar producto
export const actualizarPedidoModel = async (id, pedido) => {
    const { fecha, total, id_cliente, id_usuario, id_sucursal, id_estado } = pedido;
    const conn = await getConnection();

    try {
    const [result] = await conn.execute(
        "UPDATE Pedidos SET fecha=?, total=?, id_cliente=?, id_usuario=?, id_sucursal=?, id_estado=? WHERE id_pedido=?",
        [fecha, total, id_cliente, id_usuario, id_sucursal, id_estado, id]
    );
    if (result.affectedRows === 0) {
        throw new Error("Pedido no encontrado");
    }
    return { id, ...pedido };

    } catch (error) {
    console.error("Error al actualizar pedido:", error.message);
    throw new Error("No se pudo actualizar el pedido");

    } finally {
    await conn.end();
    }
};

// Eliminar un pedido
export const eliminarPedidoModel = async (id) => {
    const conn = await getConnection();
    try {
    const [result] = await conn.execute(
        "DELETE FROM Pedidos WHERE id_pedido = ?",[id]);

            if (result.affectedRows === 0) {
        throw new Error("Producto no encontrado");
        }
    return { message: "Pedido eliminado correctamente" };

    } catch (error) {
    console.error("Error al eliminar pedido:", error.message);
    throw new Error("No se pudo eliminar el pedido");
    } finally {
    await conn.end();
    }
};