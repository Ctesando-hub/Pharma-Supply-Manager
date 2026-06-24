import { getConnection } from "../config/dbConnection.js"; 

// Obtener todos los proveedores
export const getProveedoresModel = async () => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`
        SELECT 
        pr.id_proveedor,
        pr.nombre,
        pr.telefono,
        pr.email,
        pr.direccion,
        c.nombre AS ciudad,
        prv.nombre AS provincia
        FROM proveedores pr
        INNER JOIN ciudades c ON pr.id_ciudad = c.id_ciudad
        INNER JOIN provincias prv ON c.id_provincia = prv.id_provincia
        WHERE pr.proveedor_eliminado IS NULL
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
        pr.id_proveedor,
        pr.nombre,
        pr.telefono,
        pr.email,
        pr.direccion,
        c.nombre AS ciudad,
        pr.nombre AS provincia
        FROM proveedores pr
        INNER JOIN ciudades c ON pr.id_ciudad = c.id_ciudad
        INNER JOIN provincias prv ON c.id_provincia = prv.id_provincia
        WHERE pr.id_proveedor = ? AND pr.proveedor_eliminado IS NULL`,[id]);
    
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
    const [rows] = await conn.execute(`SELECT 
        pr.id_proveedor,
        pr.nombre,
        pr.telefono,
        pr.email,
        pr.direccion,
        c.nombre AS ciudad,
        prv.nombre AS provincia
        FROM proveedores pr
        INNER JOIN ciudades c ON pr.id_ciudad = c.id_ciudad
        INNER JOIN provincias prv ON c.id_provincia = prv.id_provincia
        WHERE LOWER(pr.nombre) LIKE LOWER(?)
        AND pr.proveedor_eliminado IS NULL`,[`%${nombre}%`]);
        
    return rows;
    } catch (error) {
    console.error("Error al buscar proveedores:", error.message);
    throw new Error("No se pudieron buscar los proveedores");
    } finally {
    await conn.end();
    }
};

//Buscar proveedores con filtros/ combinados
export const getProveedoresFiltrosModel = async ({ nombre, ciudad, provincia }) => {

    const conn = await getConnection();

    try {

        let query = `
            SELECT 
                pr.id_proveedor,
                pr.nombre,
                pr.telefono,
                pr.email,
                pr.direccion,
                c.nombre AS ciudad,
                p.nombre AS provincia
                
            FROM proveedores pr
            INNER JOIN ciudades c ON pr.id_ciudad = c.id_ciudad
            INNER JOIN provincias p ON c.id_provincia = p.id_provincia
            WHERE pr.proveedor_eliminado IS NULL`;

        const params = [];

        if (nombre) {
            query += ` AND (pr.nombre LIKE ?)`;
            params.push(`%${nombre}%`);
}

        if (ciudad) {
            query += " AND pr.id_ciudad = ?";
            params.push(ciudad);
        }

        if(provincia) {
            query += " AND p.id_provincia = ?";
            params.push(provincia);
        }


        const [rows] = await conn.execute(query, params);

        return rows;

    } catch (error) {

        console.error("Error filtros proveedores:", error.message);
        throw new Error("No se pudieron filtrar los proveedores");

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
        "INSERT INTO proveedores (nombre, telefono, email, direccion, id_ciudad) VALUES (?, ?, ?, ?, ?)",
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
        "UPDATE proveedores SET nombre=?, telefono=?, email=?, direccion=?, id_ciudad=? WHERE id_proveedor=?",
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
        `UPDATE proveedores 
            SET proveedor_eliminado = NOW() 
            WHERE id_proveedor = ?
            AND proveedor_eliminado IS NULL`,
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