import { getConnection } from "../config/dbConnection.js"; 

// Obtener todos los proveedores
export const getProveedoresModel = async () => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`
        SELECT 
        p.id_proveedor,
        p.nombre,
        p.telefono,
        p.email,
        p.direccion,
        c.nombre AS ciudad,
        pr.nombre AS provincia
        FROM Proveedores p
        INNER JOIN Ciudades c ON p.id_ciudad = c.id_ciudad
        INNER JOIN Provincias pr ON c.id_provincia = pr.id_provincia
    `);
    return rows;
    } catch (error) {
    console.error("Error al obtener proveedores:", error.message);
    throw new Error("No se pudieron obtener los proveedores");
    } finally {
    await conn.end();
    }
};

// Obtener proveedor por ID
export const getProveedorByIDModel = async (id) => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`SELECT 
        p.id_proveedor,
        p.nombre,
        p.telefono,
        p.email,
        p.direccion,
        c.nombre AS ciudad,
        pr.nombre AS provincia
        FROM Proveedores p
        INNER JOIN Ciudades c ON p.id_ciudad = c.id_ciudad
        INNER JOIN Provincias pr ON c.id_provincia = pr.id_provincia
        WHERE p.id_proveedor = ?`,[id]);
    
    if (rows.length === 0) {
        throw new Error("Proveedor no encontrado");
    }
    return rows[0];
    } catch (error) {
    console.error(`Error al obtener proveedor con ID ${id}:`, error.message);
    throw new Error("No se pudo obtener el proveedor");
    } finally {
    await conn.end();
    }
};

// Buscar proveedores por nombre
export const searchProveedoresModel = async (nombre) => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(
      "SELECT * FROM Proveedores WHERE LOWER(nombre) LIKE LOWER(?)",
        [`%${nombre}%`]
    );
    return rows;
    } catch (error) {
    console.error("Error al buscar proveedores:", error.message);
    throw new Error("No se pudieron buscar los proveedores");
    } finally {
    await conn.end();
    }
};

// Crear un nuevo proveedor
export const crearProveedorModel = async (proveedor) => {
    const { nombre, telefono, email, direccion, id_ciudad } = proveedor;
    const conn = await getConnection();
    try {
    const [result] = await conn.execute(
        "INSERT INTO Proveedores (nombre, telefono, email, direccion, id_ciudad) VALUES (?, ?, ?, ?, ?)",
        [nombre, telefono, email, direccion, id_ciudad]
    );
    return { id: result.insertId, ...proveedor };
    } catch (error) {
    console.error("Error al crear proveedor:", error.message);
    throw new Error("No se pudo crear el proveedor");
    } finally {
    await conn.end();
    }
};

// Actualizar proveedor
export const actualizarProveedorModel = async (id, proveedor) => {
    const { nombre, telefono, email, direccion, id_ciudad } = proveedor;
    const conn = await getConnection();
    try {
    const [result] = await conn.execute(
        "UPDATE Proveedores SET nombre=?, telefono=?, email=?, direccion=?, id_ciudad=? WHERE id_proveedor=?",
        [nombre, telefono, email, direccion, id_ciudad, id]
    );
    if (result.affectedRows === 0) {
        throw new Error("Proveedor no encontrado");
    }
    return { id, ...proveedor };
    } catch (error) {
    console.error("Error al actualizar proveedor:", error.message);
    throw new Error("No se pudo actualizar el proveedor");
    } finally {
    await conn.end();
    }
};

// Eliminar proveedor
export const eliminarProveedorModel = async (id) => {
    const conn = await getConnection();
    try {
    const [result] = await conn.execute(
        "DELETE FROM Proveedores WHERE id_proveedor = ?",
        [id]
    );
    if (result.affectedRows === 0) {
        throw new Error("Proveedor no encontrado");
    }
    return { message: "Proveedor eliminado correctamente" };
    } catch (error) {
    console.error("Error al eliminar proveedor:", error.message);
    throw new Error("No se pudo eliminar el proveedor");
    } finally {
    await conn.end();
    }
};