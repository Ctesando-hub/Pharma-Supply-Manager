import { getUsuarioService, getuUsuarioByIDService, searchUsuarioService, crearUsuarioService, actualizarUsuarioService, eliminarUsuarioService } from "../services/usuarios_service.js";
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


//Controlador para crear un nuevo usuario
export const crearUsuario = async (req, res) =>{
    try{
        logger.info("POST /usuarios → creando nuevo usuario");
        const {nombre, apellido, email, password, id_rol, id_sucursal, activo, fecha_creacion} = req.body; //extraer los datos del body

        // Validamos que sean campos obligatorios
        if(!nombre ||!apellido ||!email ||!password ||!id_rol ||!id_sucursal ||activo === undefined ||fecha_creacion === undefined ){
            logger.warn("Faltan datos obligatorios en crearUsuario");
            return res.status(400).json({ message: "Faltan datos obligatorios"});
        }

            const nuevoUsuario = await crearUsuarioService({ nombre, apellido, email, password, id_rol, id_sucursal, activo, fecha_creacion});
            logger.info(`Usuario creado correctamente`);
            res.status(201).json({ message: "Usuario creado correctamente", data: nuevoUsuario});       

    } catch (error){
        logger.error("Error en crearUsuario:", error);
        res.status(500).json({ message: "Error al crear el Usuario", error: error.message});
    }
};

//Controlador para actualizar Stock
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

//Controlador para eliminar un cliente

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