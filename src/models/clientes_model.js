import { getConnection } from "../config/dbConnection.js";

// Obtener todos los clientes
export const getClientesModel = async () => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`
        SELECT 
        cl.id_cliente,
        cl.nombre,
        cl.cuit,
        cl.telefono,
        cl.direccion,
        cl.email,
        t.nombre_tipo AS tipo,
        c.nombre AS ciudad,
        pr.nombre AS provincia
        FROM clientes cl
        INNER JOIN ciudades c ON cl.id_ciudad = c.id_ciudad
        INNER JOIN provincias pr ON c.id_provincia = pr.id_provincia
        INNER JOIN tiposcliente t ON cl.id_tipo = t.id_tipo
        ORDER BY cl.id_cliente ASC`);
    return rows;
    } catch (error) {
    console.error("Error al obtener clientes:", error.message);
    throw new Error("No se pudieron obtener los clientes");
    } finally {
    await conn.end();
    }
};

// Obtener proveedor por ID
export const getClienteByIDModel = async (id) => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`SELECT 
        cl.id_cliente,
        cl.nombre,
        cl.cuit,
        cl.telefono,
        cl.direccion,
        cl.email,
        t.nombre_tipo AS tipo,
        c.nombre AS ciudad,
        pr.nombre AS provincia
        FROM clientes cl
        INNER JOIN ciudades c ON cl.id_ciudad = c.id_ciudad
        INNER JOIN provincias pr ON c.id_provincia = pr.id_provincia
        INNER JOIN tiposcliente t ON cl.id_tipo = t.id_tipo
        WHERE cl.id_cliente = ?`,[id]);
    
    if (rows.length === 0) {
        throw new Error("Cliente no encontrado");
    }
    return rows[0];
    } catch (error) {
    console.error(`Error al obtener cliente con ID ${id}:`, error.message);
    throw new Error("No se pudo obtener el cliente");
    } finally {
    await conn.end();
    }
};

// Buscar clientes por nombre
export const searchClienteModel = async (nombre) => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`SELECT 
        cl.id_cliente,
        cl.nombre,
        cl.cuit,
        cl.telefono,
        cl.direccion,
        cl.email,
        t.nombre_tipo AS tipo,
        c.nombre AS ciudad,
        pr.nombre AS provincia
        FROM clientes cl
        INNER JOIN ciudades c ON cl.id_ciudad = c.id_ciudad
        INNER JOIN provincias pr ON c.id_provincia = pr.id_provincia
        INNER JOIN tiposcliente t ON cl.id_tipo = t.id_tipo
        WHERE LOWER(cl.nombre) LIKE LOWER(?)`, [`%${nombre}%`]);
    return rows;
    } catch (error) {
    console.error("Error al buscar clientes:", error.message);
    throw new Error("No se pudieron buscar los clientes");
    } finally {
    await conn.end();
    }
};
// Crear un nuevo cliente
export const crearClienteModel = async (cliente) => {
    const { nombre,cuit, telefono, direccion, email, id_ciudad, id_tipo } = cliente;
    const conn = await getConnection();
    try {
    const [result] = await conn.execute(
        "INSERT INTO clientes (nombre, cuit, telefono, direccion, email, id_ciudad, id_tipo) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [nombre, cuit, telefono, direccion, email, id_ciudad, id_tipo]);

    return { id: result.insertId, ...cliente };
    } catch (error) {

    console.error("Error al crear cliente:", error.message);
    throw new Error("No se pudo crear el cliente");
    } finally {
    await conn.end();
    }
};

// Actualizar cliente
export const actualizarClienteModel = async (id, cliente) => {
    const { nombre, cuit, telefono, direccion, email, id_ciudad, id_tipo } = cliente;
    const conn = await getConnection();
    try {
    const [result] = await conn.execute(
        "UPDATE clientes SET nombre=?, cuit=?, direccion=?, telefono=?, email=?, id_ciudad=?, id_tipo=? WHERE id_cliente=?",
        [nombre, cuit, telefono, direccion, email, id_ciudad, id_tipo, id]
    );
    if (result.affectedRows === 0) {
        throw new Error("Cliente no encontrado");
    }
    return { id, ...cliente };
        
    } catch (error) {
    console.error("Error al actualizar cliente:", error.message);
    throw new Error("No se pudo actualizar el cliente");
    } finally {
    await conn.end();
    }
};

// Eliminar cliente
export const eliminarClienteModel = async (id) => {
    const conn = await getConnection();
    try {
    const [result] = await conn.execute(
        "DELETE FROM clientes WHERE id_cliente = ?",
        [id]
    );
    if (result.affectedRows === 0) {
        throw new Error("Cliente no encontrado");
    }
    return { message: "Cliente eliminado correctamente" };
    } catch (error) {
    console.error("Error al eliminar cliente:", error.message);
    throw new Error("No se pudo eliminar el cliente");
    } finally {
    await conn.end();
    }
};