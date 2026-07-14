import { getConnection } from "../config/dbConnection.js";

// Obtener todos las provincias
export const getProvinciasModel = async () => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`
        SELECT 
        prov.id_provincia,
        prov.nombre
        FROM provincias prov
        WHERE prov.provincia_eliminada IS NULL
        ORDER BY prov.id_provincia ASC`);
    return rows;
    } catch (error) {
    console.error("Error al obtener provincias:", error.message);
    throw new Error("No se pudieron obtener las provincias");
    } finally {
    await conn.end();
    }
};

// Obtener provincia por ID
export const getProvinciaByIDModel = async (id) => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`
        SELECT 
        prov.id_provincia,
        prov.nombre
        FROM provincias prov
        WHERE prov.id_provincia = ? AND prov.provincia_eliminada IS NULL`, [id]);
    
    if (rows.length === 0) {
        throw new Error("Provincia no encontrada");
    }
    return rows[0];
    } catch (error) {
    console.error(`Error al obtener provincia con ID ${id}:`, error.message);
    throw new Error("No se pudo obtener la provincia");
    } finally {
    await conn.end();
    }
};

// Buscar provincia por nombre
export const searchProvinciaModel = async (nombre) => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`
        SELECT 
        prov.id_provincia,
        prov.nombre
        FROM provincias prov
        WHERE prov.provincia_eliminada IS NULL`,[`%${nombre}%`]);
        
    return rows;
    } catch (error) {
    console.error("Error al buscar provincias:", error.message);
    throw new Error("No se pudieron buscar las provincias");
    } finally {
    await conn.end();
    }
};

//Buscar ciudad con filtros/ combinados
export const getProvinciasFiltrosModel = async ({ nombre}) => {

    const conn = await getConnection();

    try {

        let query = `
        SELECT 
        prov.id_provincia,
        prov.nombre
        FROM provincias prov
        WHERE prov.provincia_eliminada IS NULL`

        const params = [];

        if (nombre) {
            query += ` AND (prov.nombre LIKE ?)`;
            params.push(`%${nombre}%`);
        }


        const [rows] = await conn.execute(query, params);

        return rows;

    } catch (error) {

        console.error("Error filtros provincias:", error.message);
        throw new Error("No se pudieron filtrar las provincias");

    } finally {

        await conn.end();
    }
};
// Crear un nueva provincia
export const crearProvinciaModel = async (nombre) => {
    const conn = await getConnection();

    try {
    const [result] = await conn.execute(
        "INSERT INTO provincias (nombre) VALUES (?)",
        [nombre]);

        return { id: result.insertId, nombre};
    } catch (error) {

    console.error("Error al crear una nueva provincia:", error.message);
    throw new Error("No se pudo crear provincia");
    } finally {
    await conn.end();
    }
};

// Actualizar provincia
export const actualizarProvinciaModel = async (id, provincia) => {
    const { nombre } = provincia;
    const conn = await getConnection();

    try {
    const [result] = await conn.execute(
        "UPDATE provincias SET nombre=? WHERE id_provincia=?",
        [nombre, id]
    );
    console.log(result);
    if (result.affectedRows === 0) {
        throw new Error("Provincia no encontrada");
    }
    return { id, ...provincia};
        
    } catch (error) {
    console.error("Error al actualizar provincia:", error.message);
    throw new Error("No se pudo actualizar provincia");
    } finally {
    await conn.end();
    }
};

// Eliminar ciudad
export const eliminarProvinciaModel = async (id) => {
    const conn = await getConnection();

    try {
    const [result] = await conn.execute(
            `UPDATE provincias 
            SET provincia_eliminada = NOW() 
            WHERE id_provincia = ?
            AND provincia_eliminada IS NULL`,
        [id]
    );
    if (result.affectedRows === 0) {
        throw new Error("Provincia no encontrada");
    }
    return { message: "Provincia eliminada correctamente" };
    } catch (error) {
    console.error("Error al eliminar provincia:", error.message);
    throw new Error("No se pudo eliminar provincia");
    } finally {
    await conn.end();
    }
};