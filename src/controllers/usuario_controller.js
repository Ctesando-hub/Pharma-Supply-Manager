import { getUsuarioService, getuUsuarioByIDService, searchUsuarioService, getUsuarioByRolService, getUsuariosByEstadoService, getUsuariosFiltrosService, crearUsuarioService, actualizarUsuarioService, eliminarUsuarioService } from "../services/usuarios_service.js";
import logger from "../utils/logger.js";

// Controlador GET Traer todos los usuarios
export const getUsuario = async (req, res) => {
    try{
        logger.info("GET /usuarios → solicitando lista completa");
        const usuarios = await getUsuarioService();
        logger.info(`Usuarios recuperados: ${usuarios.length}`);
        res.status(200).json({ message: "Controlador funcionando: obteniendo toda la lista de Usuarios", data: usuarios});

    }catch (error) {
        logger.error("Error en getUsuario:", error);
        res.status(500).json({ message: "Error al obtener lista de Usuarios", error: error.message});
    }
};


//Controlador GET ID -Obtener un usuario especifico
export const getUsuarioByID = async (req,res) => {
    try{

        const {id} = req.params;
        logger.info(`GET /usuarios/${id} → buscando usuario`);

        const usuarios = await getuUsuarioByIDService(id);
        

            //validamos los datos
            if(!usuarios) {
                logger.warn(`Usuario con ID ${id} no encontrado`);
                return res.status(404).json({ message: "Usuario no encontrado"});
            }
                logger.info(`Usuario encontrado → ID: ${id}`);
                return res.status(200).json({ message: "Usuario encontrado", data: usuarios});

        } catch (error) {
            logger.error("Error en getUsuarioByID:", error);
            return res.status(500).json({ message: "Error al encontrar Usuario", error: error.message});
    }   
};

// Controlador GET SEARCH - Buscar Usuario por nombre
export const searchUsuario = async (req, res) => {
    try {
       const {nombre} = req.query; // viene de ?nombre=
        logger.info(`SEARCH /usuarios?nombre=${nombre}`);

        if (!nombre) {
            logger.warn("Búsqueda sin parámetro nombre");
            return res.status(400).json({ message: "Debe proporcionar ?nombre=" });
        }

        const usuariosBuscados =  await searchUsuarioService(nombre);
        
        
        if (usuariosBuscados.length === 0) {
            logger.warn(`GET /usuarios/search - No se encontraron usuarios para nombre="${nombre}"`);
            return res.status(404).json({ message: "No se encontraron usuarios con ese nombre" });
        }
        logger.info(`Resultados encontrados: ${usuariosBuscados.length}`);
        return res.status(200).json({ message: "Resultados de búsqueda", data: usuariosBuscados });

    } catch(error){
        logger.error("Error en searchUsuario:", error);
        return res.status(500).json({ message: "Error al buscar usuario", error: error.message});
    }
};

// Controlador GET - Buscar usuarios por rol
export const getUsuariosByRol = async (req, res) => {

    try {

        const { rol } = req.params;

        logger.info(`GET /usuarios/rol/${rol}`);

        const usuariosBuscadosRol =
            await getUsuarioByRolService(rol);

        if (usuariosBuscadosRol.length === 0) {

            logger.warn(
                `No se encontraron usuarios para rol="${rol}"`
            );

            return res.status(404).json({
                message: "No se encontraron usuarios con ese rol"
            });
        }

        logger.info(
            `Resultados encontrados: ${usuariosBuscadosRol.length}`
        );

        return res.status(200).json({
            message: "Usuarios encontrados",
            data: usuariosBuscadosRol
        });

    } catch (error) {

        logger.error("Error en getUsuariosByRol:", error);

        return res.status(500).json({
            message: "Error al buscar usuarios por rol",
            error: error.message
        });
    }
};

//controlador para buscar usuario por estado
export const getUsuariosByEstado = async (req, res) =>{
    try {

        const { estado } = req.params;
        logger.info(`GET /usuarios/estado/${estado}`);

        const usuariosBuscadosEstados = await getUsuariosByEstadoService(estado);

        if (usuariosBuscadosEstados.length === 0) {
            logger.warn(`No se encontraron usuarios para el estado "${estado}"`);

            return res.status(404).json({
                message: "No se encontraron usuarios con ese estado"
            });
        }
        logger.info( `Resultados encontrados: ${usuariosBuscadosEstados.length}`)
        return res.status(200).json({
            message: "Usuarios encontrados",
            data: usuariosBuscadosEstados
        });

    } catch (error) {
        logger.error(`Error en getUsuariosByEstado: ${error.message}`);
        return res.status(500).json({
            message: "Error al buscar usuarios por estado",
            error: error.message
        });
    }
}
// FILTROS COMBINADOS
export const getUsuariosFiltros = async (req, res) => {

    try {

        const { nombre, apellido, rol, estado } = req.query;

        const usuarios = await getUsuariosFiltrosService({
            nombre,
            apellido,
            rol,
            estado
        });
        logger.info( `Resultados encontrados: ${usuarios.length}`)
        return res.status(200).json({
            message: "Filtros aplicados correctamente",
            data: usuarios
        });

    } catch (error) {

        console.error("Error filtros:", error);
        logger.error(`Error en getUsuariosFiltro: ${error.message}`);
        return res.status(500).json({
            message: "Error al filtrar usuarios",
            error: error.message
        });
    }
};


//Controlador para crear un nuevo usuario
export const crearUsuario = async (req, res) =>{
    try{
        logger.info("POST /usuarios → creando nuevo usuario");
        const {nombre, apellido, email, password, id_rol, id_sucursal, activo} = req.body; //extraer los datos del body

        // Validamos que sean campos obligatorios
        if(!nombre ||!apellido ||!email ||!password ||!id_rol ||!id_sucursal ||activo === undefined){
            logger.warn("Faltan datos obligatorios en crearUsuario");
            return res.status(400).json({ message: "Faltan datos obligatorios"});
        }

            const nuevoUsuario = await crearUsuarioService({ nombre, apellido, email, password, id_rol, id_sucursal, activo});
            logger.info(`Usuario creado correctamente`);
            res.status(201).json({ message: "Usuario creado correctamente", data: nuevoUsuario});       

    } catch (error){
        logger.error("Error en crearUsuario:", error);
        res.status(500).json({ message: "Error al crear el Usuario", error: error.message});
    }
};

//Controlador para actualizar Usuario
export const actualizarUsuario =  async (req, res) => {
    try{
        const {id} =  req.params;
        const usuario =  req.body;
        logger.info(`PUT /usuarios/${id} → intentando actualizar`);

        //validamos los datos
        if (!usuario){
            logger.warn(`Faltan datos para la actualizacion`);
            return res.status(400).json({message: "Faltan datos obligatorios"});
        }

        const usuarioActualizado =  await actualizarUsuarioService(id, usuario);

        logger.info(`Usuario actualizado correctamente: ID ${id}`);   
        res.status(200).json({ message: "Usuario  actualizado correctamente", data: usuarioActualizado});

    }catch(error){
        logger.error("Error en actualizarUsuario:", error);
        res.status(500).json({ message: "Error al actualizar usuario", error: error.message});
    }

};

//Controlador para eliminar un usuario

export const eliminarUsuario =  async (req, res) =>{
    try{
        const {id} = req.params;
        logger.info(`DELETE /usuarios/${id} → intento de eliminación`);

        const usuario_eliminado = await eliminarUsuarioService(id);
        
        if(!usuario_eliminado){
            logger.warn(`Usuario no encontrado: ID ${id}`);
            return res.status(404).json({ message:"Usuario no encontrado"});
        }
        logger.info(`Usuario eliminado correctamente: ID ${id}`);
        res.status(200).json({ message: `Usuario con el ID: ${id} eliminado correctamente`});

    } catch (error){
        logger.error("Error en eliminarUsuario:", error);
        res.status(500).json({ message: "Error al eliminar el usuario", error: error.message});
    }
};