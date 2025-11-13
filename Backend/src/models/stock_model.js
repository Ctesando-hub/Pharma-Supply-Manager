import { getConnection } from "../config/dbConnection.js";

// Obtener lista del stock de productos
export const getAllStockModel = async () => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`
        SELECT 
        s.id_stock,
        p.nombre AS nombre,
        s.cantidad_disponible,
        s.punto_reposicion,
        s.ultima_actualizacion
        FROM Stock s
        INNER JOIN Productos p ON s.id_producto = p.id_producto
        ORDER BY s.id_stock ASC`);
    return rows;
    } catch (error) {
    console.error("Error al obtener stock:", error.message);
    throw new Error("No se pudo obtener la lista de stock");
    } finally {
    await conn.end();
    }
};

// Obtener stock por ID
export const getStockByIDModel = async (id) => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`SELECT  
        s.id_stock,
        p.nombre AS nombre,
        s.cantidad_disponible,
        s.punto_reposicion,
        s.ultima_actualizacion
        FROM Stock s
        INNER JOIN Productos p ON s.id_producto = p.id_producto
        WHERE s.id_stock = ?`,[id]);
    
    if (rows.length === 0) {
        throw new Error("Stock del producto no encontrado");
    }
    return rows[0];
    } catch (error) {
    console.error(`Error al obtener Stock con ID ${id}:`, error.message);
    throw new Error("No se pudo obtener Stock del producto");
    } finally {
    await conn.end();
    }
};

// Buscar Stock por nombre del producto
export const searchStockModel = async (nombre) => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`SELECT  
        s.id_stock,
        p.nombre AS nombre,
        s.cantidad_disponible,
        s.punto_reposicion,
        s.ultima_actualizacion
        FROM Stock s
        INNER JOIN Productos p ON s.id_producto = p.id_producto
        WHERE LOWER(p.nombre) LIKE LOWER(?)`, [`%${nombre}%`]);
    return rows;
    } catch (error) {
    console.error("Error al buscar stock por nombre del producto:", error.message);
    throw new Error("No se pudieron buscar stock del producto");
    } finally {
    await conn.end();
    }
};

// Crear nuevo stock del producto
export const crearStockModel = async (stock) => {

    const { id_producto, cantidad_disponible, punto_reposicion, ultima_actualizacion} = stock;
    const conn = await getConnection();
    try {
    const [resultado] = await conn.execute(
        "INSERT INTO Stock (id_producto, cantidad_disponible, punto_reposicion, ultima_actualizacion) VALUES (?, ?, ?, ?)",
        [id_producto, cantidad_disponible, punto_reposicion, ultima_actualizacion]);

    return { id: resultado.insertId, ...stock };
    } catch (error) {

    console.error("Error al crear stock:", error.message);
    throw new Error("No se pudo crear Stock");
    } finally {
    await conn.end();
    }
};

// Actualizar Stock
export const actualizarStockModel = async (id, stock) => {

    const { id_producto, cantidad_disponible, punto_reposicion, ultima_actualizacion } = stock;

    const conn = await getConnection();

    try {
    const [resultado] = await conn.execute(
        "UPDATE Stock SET id_producto=?, cantidad_disponible=?, punto_reposicion=?, ultima_actualizacion=? WHERE id_stock=?",
        [id_producto, cantidad_disponible, punto_reposicion, ultima_actualizacion, id]);
    
        if (resultado.affectedRows === 0) {
        throw new Error("Stock no encontrado");
    }
    return { id, ...stock };
        
    } catch (error) {
    console.error("Error al actualizar stock:", error.message);
    throw new Error("No se pudo actualizar Stock");

    } finally {
    await conn.end();
    }
};

// Eliminar stock
export const eliminarStockModel = async (id) => {
    const conn = await getConnection();
    try {
    const [result] = await conn.execute(
        "DELETE FROM Stock WHERE id_stock = ?",[id]);

    if (result.affectedRows === 0) {
        throw new Error("Stock no encontrado");
    }
    return { message: "Stock eliminado correctamente" };
    } catch (error) {
    console.error("Error al eliminar Stock:", error.message);
    throw new Error("No se pudo eliminar el stock");
    } finally {
    await conn.end();
    }
};