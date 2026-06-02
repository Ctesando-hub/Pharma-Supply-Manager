import { getConnection } from "../config/dbConnection.js"; 

// Obtener todos los usuarios
export const getUsuariosModel = async () => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`
        SELECT 
        u.id_usuario,
        u.nombre,
        u.apellido,
        u.email,
        r.nombre AS rol,
        s.nombre AS sucursal,
        u.activo,
        u.fecha_creacion
        FROM usuarios u
        INNER JOIN roles r ON r.id_rol = u.id_rol
        INNER JOIN sucursales s ON s.id_sucursal = u.id_sucursal
        WHERE u.eliminado IS NULL
        ORDER BY u.id_usuario ASC`);
    return rows;
    } catch (error) {
    console.error("Error al obtener usuarios:", error.message);
    throw new Error("No se pudieron obtener los usuarios");
    } finally {
    await conn.end();
    }
};

// Obtener proveedor por ID
export const getUsuarioByIDModel = async (id) => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`SELECT 
        u.id_usuario,
        u.nombre,
        u.apellido,
        u.email,
        r.nombre AS rol,
        s.nombre AS sucursal,
        u.activo,
        u.fecha_creacion
        FROM usuarios u
        INNER JOIN roles r ON r.id_rol = u.id_rol
        INNER JOIN sucursales s ON s.id_sucursal = u.id_sucursal
        WHERE u.id_usuario = ? AND u.eliminado IS NULL`,[id]);
        
    
    if (rows.length === 0) {
        throw new Error("Usuario no encontrado");
    }
    return rows[0];
    } catch (error) {
    console.error(`Error al obtener usuario con ID ${id}:`, error.message);
    throw new Error("No se pudo obtener el usuario");
    } finally {
    await conn.end();
    }
};

// Buscar usuarios por nombre
export const searchUsuarioModel = async (nombre) => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(
        `SELECT u.id_usuario,
                u.nombre,
                u.apellido,
                u.email,
                r.nombre AS rol,
                s.nombre AS sucursal,
                u.activo,
                u.fecha_creacion
                FROM usuarios u 
                INNER JOIN roles r ON r.id_rol = u.id_rol 
                INNER JOIN sucursales s ON s.id_sucursal = u.id_sucursal  WHERE LOWER(u.nombre) LIKE LOWER(?)
                AND u.eliminado IS NULL`,
                [`%${nombre}%`]
            
    );
    return rows;
    } catch (error) {
    console.error("Error al buscar usuario con ese nombre:", error.message);
    throw new Error("No se pudieron buscar los usuarios con ese nombre");
    } finally {
    await conn.end();
    }
};

 // Obtener usuarios por rol
export const getUsuariosByRolModel = async (rol) => {

    const conn = await getConnection();

    try {

        const [rows] = await conn.execute(`
            SELECT 
                u.id_usuario,
                u.nombre,
                u.apellido,
                u.email,
                r.nombre AS rol,
                s.nombre AS sucursal,
                u.activo,
                u.fecha_creacion
            FROM usuarios u
            INNER JOIN roles r ON r.id_rol = u.id_rol
            INNER JOIN sucursales s ON s.id_sucursal = u.id_sucursal
            WHERE u.id_rol = ?
            AND u.eliminado IS NULL
            ORDER BY u.id_usuario ASC
        `, [rol]);

        return rows;

    } catch (error) {

        console.error(
            "Error al obtener usuarios por rol:",
            error.message
        );

        throw new Error(
            "No se pudieron obtener los usuarios por rol"
        );

    } finally {

        await conn.end();
    }
};

//Buscar usuarios por estado
export const getUsuariosByEstadoModel = async (estado) => {

    const conn = await getConnection();

    try {

        const [rows] = await conn.execute(`
            SELECT 
                u.id_usuario,
                u.nombre,
                u.apellido,
                u.email,
                r.nombre AS rol,
                s.nombre AS sucursal,
                u.activo,
                u.fecha_creacion
            FROM usuarios u
            INNER JOIN roles r ON r.id_rol = u.id_rol
            INNER JOIN sucursales s ON s.id_sucursal = u.id_sucursal
            WHERE u.activo = ?
            AND u.eliminado IS NULL
            ORDER BY u.id_usuario ASC
        `, [estado]);

        return rows;

    } catch (error) {

        console.error(
            "Error al obtener usuarios por estado:",
            error.message
        );

        throw new Error(
            "No se pudieron obtener los usuarios por estado"
        );

    } finally {

        await conn.end();
    }
};

//Buscar usuario con filtros/ combinados
export const getUsuariosFiltrosModel = async ({ nombre, apellido, rol, estado }) => {

    const conn = await getConnection();

    try {

        let query = `
            SELECT 
                u.id_usuario,
                u.nombre,
                u.apellido,
                u.email,
                r.nombre AS rol,
                s.nombre AS sucursal,
                u.activo,
                u.fecha_creacion
            FROM usuarios u
            INNER JOIN roles r ON r.id_rol = u.id_rol
            INNER JOIN sucursales s ON s.id_sucursal = u.id_sucursal
            WHERE u.eliminado IS NULL
        `;

        const params = [];

        if (nombre) {
            query += `AND (u.nombre LIKE ? OR u.apellido LIKE ?)`;
            params.push(`%${nombre}%`, `%${nombre}%`);
}

        if (rol) {
            query += " AND u.id_rol = ?";
            params.push(rol);
        }

        if (estado !== undefined && estado !== "") {
            query += " AND u.activo = ?";
            params.push(estado);
        }

        const [rows] = await conn.execute(query, params);

        return rows;

    } catch (error) {

        console.error("Error filtros usuarios:", error.message);
        throw new Error("No se pudieron filtrar los usuarios");

    } finally {

        await conn.end();
    }
};

// Crear un nuevo Usuario
export const crearUsuarioModel = async (usuario) => {
    const { nombre, apellido, email, password, id_rol, id_sucursal, activo} = usuario;

    const conn = await getConnection();
    try {
    const [result] = await conn.execute(
        "INSERT INTO usuarios ( nombre, apellido, email, password, id_rol, id_sucursal, activo) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [ nombre, apellido, email, password, id_rol, id_sucursal, 1]
    );
    return { id: result.insertId, ...usuario };

    } catch (error) {
    console.error("Error al crear Usuario:", error.message);
    throw new Error("No se pudo crear el usuario");

    } finally {
    await conn.end();
    }
};

// Actualizar Usuario
export const actualizarUsuarioModel = async (id, usuario) => {
    const { nombre, apellido, email, id_rol, id_sucursal, activo} = usuario;
    const conn = await getConnection();
    try {
    const [result] = await conn.execute(
        "UPDATE usuarios SET nombre=?, apellido=?, email=?, id_rol=?, id_sucursal=?, activo=? WHERE id_usuario=?",
        [ nombre, apellido, email, id_rol, id_sucursal, activo, id]
    );
    if (result.affectedRows === 0) {
        throw new Error("Usuario no encontrado");
    }
    return { id, ...usuario };
    } catch (error) {
    console.error("Error al actualizar usuario:", error.message);
    throw new Error("No se pudo actualizar el usuario");
    } finally {
    await conn.end();
    }
};

// Eliminar Usuario
export const eliminarUsuarioModel = async (id) => {
    const conn = await getConnection();
    try {
    const [result] = await conn.execute(
        `UPDATE usuarios 
            SET eliminado = NOW() 
            WHERE id_usuario = ?
            AND eliminado IS NULL`,
        [id]
    );
    if (result.affectedRows === 0) {
        throw new Error("Usuario no encontrado o ya eliminado");
    }
    return { message: "Usuario eliminado correctamente" };
    } catch (error) {
    console.error("Error al eliminar Usuario:", error.message);
    throw new Error("No se pudo eliminar el Usuario");
    } finally {
    await conn.end();
    }
};