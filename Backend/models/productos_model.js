import { getConnection } from "../config/dbConnection.js";

// Obtener todos los productos
export const getAllProductos = async () => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute("SELECT * FROM Productos");
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
    const [rows] = await conn.execute(
      "SELECT * FROM Productos WHERE id_producto = ?",
        [id]
    );
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
    const [rows] = await conn.execute(
      "SELECT * FROM Productos WHERE LOWER(nombre) LIKE LOWER(?)",
        [`%${nombre}%`]
    );
    return rows;
    } catch (error) {
    console.error("Error al buscar productos:", error.message);
    throw new Error("No se pudieron buscar los productos");
    } finally {
    await conn.end();
    }
};

// Crear un nuevo producto
export const crearProductoModel = async (producto) => {
    const { nombre, descripcion, precio, id_proveedor } = producto;
    const conn = await getConnection();
    try {
    const [result] = await conn.execute(
        "INSERT INTO Productos (nombre, descripcion, precio, id_proveedor) VALUES (?, ?, ?, ?)",
        [nombre, descripcion, precio, id_proveedor]
    );
    return { id: result.insertId, ...producto };
    } catch (error) {
    console.error("Error al crear producto:", error.message);
    throw new Error("No se pudo crear el producto");
    } finally {
    await conn.end();
    }
};

// Actualizar producto
export const actualizarProductoModel = async (id, producto) => {
    const { nombre,descripcion, precio, id_proveedor } = producto;
    const conn = await getConnection();
    try {
    const [result] = await conn.execute(
        "UPDATE Productos SET nombre=?, descripcion=?, precio=?, id_proveedor=? WHERE id_producto=?",
        [nombre, descripcion, precio, id_proveedor, id]
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
        "DELETE FROM Productos WHERE id_producto = ?",
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