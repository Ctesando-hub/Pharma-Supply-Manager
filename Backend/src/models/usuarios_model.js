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
        FROM Usuarios u
        INNER JOIN Roles r ON r.id_rol = u.id_rol
        INNER JOIN Sucursales s ON s.id_sucursal = u.id_sucursal
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
        FROM Usuarios u
        INNER JOIN Roles r ON r.id_rol = u.id_rol
        INNER JOIN Sucursales s ON s.id_sucursal = u.id_sucursal
        WHERE u.id_usuario = ?`,[id]);
    
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
      "SELECT * FROM Usuarios WHERE LOWER(nombre) LIKE LOWER(?)",
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

// Crear un nuevo Usuario
export const crearUsuarioModel = async (usuario) => {
    const { nombre, apellido, email, password, id_rol, id_sucursal, activo, fecha_creacion} = usuario;

    const conn = await getConnection();
    try {
    const [result] = await conn.execute(
        "INSERT INTO Usuarios ( nombre, apellido, email, password, id_rol, id_sucursal, activo, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [ nombre, apellido, email, password, id_rol, id_sucursal, activo, fecha_creacion]
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
    const {  nombre, apellido, email, password, id_rol, id_sucursal, activo, fecha_creacion } = usuario;
    const conn = await getConnection();
    try {
    const [result] = await conn.execute(
        "UPDATE Usuarios SET nombre=?, apellido=?, email=?, password=?, id_rol=?, id_sucursal=?, activo=?, fecha_creacion=? WHERE id_usuario=?",
        [ nombre, apellido, email, password, id_rol, id_sucursal, activo, fecha_creacion, id]
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
        "DELETE FROM Usuarios WHERE id_usuario = ?",
        [id]
    );
    if (result.affectedRows === 0) {
        throw new Error("Usuario no encontrado");
    }
    return { message: "Usuario eliminado correctamente" };
    } catch (error) {
    console.error("Error al eliminar Usuario:", error.message);
    throw new Error("No se pudo eliminar el Usuario");
    } finally {
    await conn.end();
    }
};