import { getConnection } from "../config/dbConnection.js";

// Obtener todos los productos
export const getAllProductos = async () => {
    const conn = await getConnection();
    try {
        const [rows] = await conn.execute(`
            SELECT 
                p.id_producto,
                p.nombre,
                p.descripcion,
                p.precio,
                p.id_proveedor,
                pr.nombre AS proveedor,
                p.imagen_url,
                p.prospecto_url
            FROM productos p
            LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
            WHERE p.prod_eliminado IS NULL
        `);
        
        return rows;
    } catch (error) {
        console.error("Error al obtener productos:", error.message);
        throw new Error("No se pudieron obtener los productos");
    } finally {
        await conn.end();
    }
};


// Obtener producto por ID
export const getProductoByIDModel = async (id) => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`
        SELECT 
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.precio,
        pr.nombre AS proveedor,
        p.imagen_url,
        p.prospecto_url
        FROM productos p
        LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
        WHERE p.id_producto = ? AND p.prod_eliminado IS NULL`, [id]);

    if (rows.length === 0) {
        throw new Error("Producto no encontrado");
    }
    return rows[0];
    } catch (error) {
    console.error(`Error al obtener producto con ID ${id}:`, error.message);
    throw new Error("No se pudo obtener el producto");
    } finally {
    await conn.end();
    }
};

// Buscar producto por nombre
export const searchProductosModel = async (nombre) => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`SELECT 
        p.id_producto,
        p.nombre,
        p.descripcion,
        p.precio,
        pr.nombre AS proveedor,
        p.imagen_url,
        p.prospecto_url
        FROM productos p
        LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
        WHERE LOWER(p.nombre) LIKE LOWER(?) AND p.prod_eliminado IS NULL`, [`%${nombre}%`]);
    return rows;
    } catch (error) {
    console.error("Error al buscar productos:", error.message);
    throw new Error("No se pudieron buscar los productos");
    } finally {
    await conn.end();
    }
};

//Buscar productos con filtros/ combinados
export const getProductosFiltrosModel = async ({ nombre, proveedor }) => {

    const conn = await getConnection();

    try {

        let query = `
            SELECT 
                p.id_producto,
                p.nombre,
                p.descripcion,
                p.precio,
                p.id_proveedor,
                pr.nombre AS proveedor,
                p.imagen_url,
                p.prospecto_url
            FROM productos p
            LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
            WHERE p.prod_eliminado IS NULL`;

        const params = [];

        if (nombre) {
            query += ` AND (p.nombre LIKE ?)`;
            params.push(`%${nombre}%`);
}

        if (proveedor) {
            query += " AND pr.id_proveedor = ?";
            params.push(proveedor);
        }

        const [rows] = await conn.execute(query, params);

        return rows;

    } catch (error) {

        console.error("Error filtros productos:", error.message);
        throw new Error("No se pudieron filtrar los productos");

    } finally {

        await conn.end();
    }
};

// Crear un nuevo producto
export const crearProductoModel = async (producto) => {
    const { nombre, descripcion, precio, id_proveedor, imagen_url, prospecto_url } = producto;
    const conn = await getConnection();
    try {
    const [result] = await conn.execute(
        "INSERT INTO productos (nombre, descripcion, precio, id_proveedor, imagen_url, prospecto_url) VALUES (?, ?, ?, ?, ?, ?)",
        [nombre, descripcion, precio, id_proveedor, imagen_url, prospecto_url]
    );
    return { id: result.insertId, ...producto };
    } catch (error) {
    console.error("Error al crear producto:", error.message);
    throw new Error("No se pudo crear el producto");
    } finally {
    await conn.end();
    }
};

export const actualizarProductoModel = async (id, producto) => {

    const {
        nombre,
        descripcion,
        precio,
        id_proveedor,
        imagen_url,
        prospecto_url
    } = producto;

    const conn = await getConnection();

    try {
        const [result] = await conn.execute(
            `UPDATE productos 
                SET nombre=?, descripcion=?, precio=?, id_proveedor=?, imagen_url=?, prospecto_url=? 
                WHERE id_producto=?`,
            [
                nombre,
                descripcion,
                precio,
                id_proveedor,
                imagen_url,
                prospecto_url,
                id
            ]
        );

        if (result.affectedRows === 0) {
            throw new Error("Producto no encontrado");
        }

        return { id, ...producto };

    } catch (error) {
        console.error("Error al actualizar producto:", error.message);
        throw new Error("No se pudo actualizar el producto");
    } finally {
        await conn.end();
    }
};

// Eliminar producto
export const eliminarProductoModel = async (id) => {
    const conn = await getConnection();
    try {
    const [result] = await conn.execute(
        `UPDATE productos
            SET prod_eliminado = NOW() 
            WHERE id_producto = ?
            AND prod_eliminado IS NULL`,
        [id]
    );
    if (result.affectedRows === 0) {
        throw new Error("Producto no encontrado");
    }
    return { message: "Producto eliminado correctamente" };
    } catch (error) {
    console.error("Error al eliminar producto:", error.message);
    throw new Error("No se pudo eliminar el producto");
    } finally {
    await conn.end();
    }
};