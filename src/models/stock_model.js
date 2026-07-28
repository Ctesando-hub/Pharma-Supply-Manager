import { getConnection } from "../config/dbConnection.js";

// Obtener lista del stock de productos
export const getAllStockModel = async () => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`
        SELECT 
        s.id_stock,
        s.id_producto,
        p.nombre,
        p.imagen_url,
        s.cantidad_disponible,
        s.punto_reposicion,
        s.cantidad_reservada,
        s.ultima_actualizacion
        FROM stock s
        INNER JOIN productos p ON s.id_producto = p.id_producto
        WHERE p.prod_eliminado IS NULL
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
        FROM stock s
        INNER JOIN productos p ON s.id_producto = p.id_producto
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

//Buscar cantidad disponible y reservada 
export const getStockProductoModel = async (idProducto) => {
    const conn = await getConnection();
    try {
        const [rows] = await conn.execute(`
            SELECT
                cantidad_disponible,
                cantidad_reservada
            FROM stock
            WHERE id_producto = ?
        `, [idProducto]);

        if (rows.length === 0) {
            return null;
        }
        return rows[0];

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
        FROM stock s
        INNER JOIN productos p ON s.id_producto = p.id_producto
        WHERE LOWER(p.nombre) LIKE LOWER(?)`, [`%${nombre}%`]);
    return rows;
    } catch (error) {
    console.error("Error al buscar stock por nombre del producto:", error.message);
    throw new Error("No se pudieron buscar stock del producto");
    } finally {
    await conn.end();
    }
};

export const getStockFiltrosModel = async ({ nombre }) => {

    const conn = await getConnection();

    try {

        let query = `
            SELECT
                s.id_stock,
                s.id_producto,
                p.nombre,
                p.imagen_url,
                s.cantidad_disponible,
                s.punto_reposicion,
                s.cantidad_reservada,
                s.ultima_actualizacion
            FROM stock s
            INNER JOIN productos p
                ON s.id_producto = p.id_producto
            WHERE 1=1`;

        const params = [];

        if (nombre) {
            query += `AND p.nombre LIKE ?`;
            params.push(`%${nombre}%`);

        }
        const [rows] = await conn.execute(query, params);
        return rows;

    } catch (error) {

        console.error("Error filtros stock:", error.message);
        throw new Error(
            "No se pudieron filtrar los productos"
        );

    } finally {
        await conn.end();
    }

};

// Crear nuevo stock del producto
export const crearStockModel = async (id_producto) => {

    const conn = await getConnection();

    try {

        const [resultado] = await conn.execute(
            `INSERT INTO stock
            (
                id_producto,
                cantidad_disponible,
                punto_reposicion,
                cantidad_reservada
            )
            VALUES (?, ?, ?, ?)`,
            [
                id_producto, 0,0,0
            ]
        );

        return {
            id: resultado.insertId,
            id_producto,
            cantidad_disponible: 0,
            punto_reposicion: 0,
            cantidad_reservada: 0
        };

    } catch (error) {

        console.error("Error al crear stock:", error.message);
        throw new Error("No se pudo crear Stock");

    } finally {

        await conn.end();

    }
};

// Actualizar Stock
export const actualizarStockModel = async (id, stock) => {

    const { cantidad_disponible, punto_reposicion} = stock;

    const conn = await getConnection();

    try {
        const [resultado] = await conn.execute(
            `
            UPDATE stock
            SET
                cantidad_disponible = ?,
                punto_reposicion = ?
            WHERE id_stock = ? `,
            [
                cantidad_disponible, punto_reposicion, id
            ]
        );

        if (resultado.affectedRows === 0) {
            throw new Error("Stock no encontrado");
        }

        return {
            id_stock: id,
            cantidad_disponible,
            punto_reposicion
        };

    } catch (error) {
        console.error("Error al actualizar stock:",error.message);
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
        "DELETE FROM stock WHERE id_stock = ?",[id]);

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