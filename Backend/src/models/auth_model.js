import { getConnection } from "../config/dbConnection.js"; 

export const buscarUsuarioEmail = async (email) => {
    const conn = await getConnection();

    try{
        const [rows] = await conn.execute(
            `SELECT 
            u.id_usuario,
            u.email,
            u.password,
            u.id_rol,
        CASE 
            WHEN r.nombre = 'Administrador' THEN 'admin'
            WHEN r.nombre = 'Gerente' THEN 'gerente'
            WHEN r.nombre = 'Empleado' THEN 'empleado'
        END AS rol
            FROM Usuarios u
            INNER JOIN Roles r ON u.id_rol = r.id_rol
            WHERE u.email = ?
            LIMIT 1`, [email]);

            return rows[0];
    }catch (error){
        console.error("Error en buscarUsuarioEmail:", error.message);
    throw new Error("Error:No se pudo buscar el usuario por email");

    }finally{
        await conn.end();
    }
}