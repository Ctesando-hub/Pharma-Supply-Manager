import { getConnection } from "../config/dbConnection.js";

// Obtener todos las ciudades
export const getCiudadesModel = async () => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`
        SELECT 
        ci.id_ciudad,
        ci.nombre,
        pr.nombre AS provincia
        FROM ciudades ci
        INNER JOIN provincias pr ON ci.id_provincia = pr.id_provincia
        WHERE ci.ciudad_eliminada IS NULL
        ORDER BY ci.id_ciudad ASC`);
    return rows;
    } catch (error) {
    console.error("Error al obtener ciudades:", error.message);
    throw new Error("No se pudieron obtener las ciudades");
    } finally {
    await conn.end();
    }
};

// Obtener ciudad por ID
export const getCiudadByIDModel = async (id) => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`
        SELECT 
        ci.id_ciudad,
        ci.nombre,
        pr.nombre AS provincia
        FROM ciudades ci
        INNER JOIN provincias pr ON ci.id_provincia = pr.id_provincia
        WHERE ci.id_ciudad = ? AND ci.ciudad_eliminada IS NULL`, [id]);
    
    if (rows.length === 0) {
        throw new Error("Ciudad no encontrada");
    }
    return rows[0];
    } catch (error) {
    console.error(`Error al obtener ciudad con ID ${id}:`, error.message);
    throw new Error("No se pudo obtener la ciudad");
    } finally {
    await conn.end();
    }
};

// Buscar ciudad por nombre
export const searchCiudadModel = async (nombre) => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`
        SELECT 
        ci.id_ciudad,
        ci.nombre,
        pr.nombre AS provincia
        FROM ciudades ci
        INNER JOIN provincias pr ON ci.id_provincia = pr.id_provincia
        WHERE ci.ciudad_eliminada IS NULL`,[`%${nombre}%`]);
        
    return rows;
    } catch (error) {
    console.error("Error al buscar ciudades:", error.message);
    throw new Error("No se pudieron buscar las ciudades");
    } finally {
    await conn.end();
    }
};

//Buscar ciudad con filtros/ combinados
export const getCiudadesFiltrosModel = async ({ nombre, provincia}) => {

    const conn = await getConnection();

    try {

        let query = `
        SELECT 
        ci.id_ciudad,
        ci.nombre,
        pr.nombre AS provincia
        FROM ciudades ci
        INNER JOIN provincias pr ON ci.id_provincia = pr.id_provincia
        WHERE ci.ciudad_eliminada IS NULL`

        const params = [];

        if (nombre) {
            query += ` AND (ci.nombre LIKE ?)`;
            params.push(`%${nombre}%`);
        }


        if(provincia) {
            query += " AND pr.id_provincia = ?";
            params.push(provincia);
        }

        const [rows] = await conn.execute(query, params);

        return rows;

    } catch (error) {

        console.error("Error filtros ciudades:", error.message);
        throw new Error("No se pudieron filtrar las ciudades");

    } finally {

        await conn.end();
    }
};
// Crear un nueva ciudad
export const crearCiudadModel = async (ciudad) => {
    const { nombre, id_provincia} = ciudad;
    const conn = await getConnection();

    try {
    const [result] = await conn.execute(
        "INSERT INTO ciudades (nombre, id_provincia) VALUES (?, ?)",
        [nombre, id_provincia]);

    return { id: result.insertId, ...ciudad };
    } catch (error) {

    console.error("Error al crear una nueva ciudad:", error.message);
    throw new Error("No se pudo crear ciudad");
    } finally {
    await conn.end();
    }
};

// Actualizar ciudad
export const actualizarCiudadModel = async (id, ciudad) => {
    const { nombre, id_provincia } = ciudad;
    const conn = await getConnection();

    try {
    const [result] = await conn.execute(
        "UPDATE ciudades SET nombre=?,  id_provincia=? WHERE id_ciudad=?",
        [nombre, id_provincia, id]
    );
    if (result.affectedRows === 0) {
        throw new Error("Ciudad no encontrada");
    }
    return { id, ...ciudad };
        
    } catch (error) {
    console.error("Error al actualizar ciudad:", error.message);
    throw new Error("No se pudo actualizar ciudad");
    } finally {
    await conn.end();
    }
};

// Eliminar ciudad
export const eliminarCiudadModel = async (id) => {
    const conn = await getConnection();

    try {
    const [result] = await conn.execute(
            `UPDATE ciudades 
            SET ciudad_eliminada = NOW() 
            WHERE id_ciudad = ?
            AND ciudad_eliminada IS NULL`,
        [id]
    );
    if (result.affectedRows === 0) {
        throw new Error("Ciudad no encontrada");
    }
    return { message: "Ciudad eliminada correctamente" };
    } catch (error) {
    console.error("Error al eliminar ciudad:", error.message);
    throw new Error("No se pudo eliminar ciudad");
    } finally {
    await conn.end();
    }
};