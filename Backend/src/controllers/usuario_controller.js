import { getUsuarioService, getuUsuarioByIDService, searchUsuarioService, crearUsuarioService, actualizarUsuarioService, eliminarUsuarioService } from "../services/usuarios_service.js";

// Controlador GET Traer todos los usuarios

export const getUsuario = async (req, res) => {
    try{
        const usuarios = await getUsuarioService();
        res.status(200).json({ message: "Controlador funcionando: obteniendo toda la lista de Usuarios", data: usuarios});

    }catch (error) {
        res.status(500).json({ message: "Error al obtener lista de Usuarios", error: error.message});
    }
};


//Controlador GET ID -Obtener un usuario especifico
export const getUsuarioByID = async (req,res) => {
    try{
        const {id} = req.params;

        const usuarios = await getuUsuarioByIDService(id);
            //validamos los datos
            if(!usuarios) {
                return res.status(404).json({ message: "Usuario no encontrado"});
            }
                return res.status(200).json({ message: "Usuario encontrado", data: usuarios});

        } catch (error) {
            return res.status(500).json({ message: "Error al encontrar Usuario", error: error.message});
    }   
};

// Controlador GET SEARCH - Buscar Usuario por nombre
export const searchUsuario = async (req, res) => {
    try {
       const {nombre} = req.query; // viene de ?nombre=

        if (!nombre) {
            return res.status(400).json({ message: "Debe proporcionar ?nombre=" });
        }

        const usuariosBuscados =  await searchUsuarioService(nombre);
        
        if (usuariosBuscados.length === 0) {
            return res.status(404).json({ message: "No se encontraron usuarios con ese nombre" });
        }

        return res.status(200).json({ message: "Resultados de búsqueda", data: usuariosBuscados });

    } catch(error){
        return res.status(500).json({ message: "Error al buscar usuario", error: error.message});
    }
};


//Controlador para crear un nuevo usuario
export const crearUsuario = async (req, res) =>{
    try{
        const {nombre, apellido, email, password, id_rol, id_sucursal, activo, fecha_creacion} = req.body; //extraer los datos del body

        // Validamos que sean campos obligatorios
        if(!nombre ||!apellido ||!email ||!password ||!id_rol ||!id_sucursal ||activo === undefined ||fecha_creacion === undefined ){
            return res.status(400).json({ message: "Faltan datos obligatorios"});
        }

            const nuevoUsuario = await crearUsuarioService({ nombre, apellido, email, password, id_rol, id_sucursal, activo, fecha_creacion});
            res.status(201).json({ message: "Usuario creado correctamente", data: nuevoUsuario});       

    } catch (error){
        res.status(500).json({ message: "Error al crear el Usuario", error: error.message});
    }
};

//Controlador para actualizar Stock
export const actualizarUsuario =  async (req, res) => {
    try{
        const {id} =  req.params;
        const usuario =  req.body;

        //validamos los datos
        if (!usuario){
            return res.status(400).json({message: "Faltan datos obligatorios"});
        }

        const usuarioActualizado =  await actualizarUsuarioService(id, usuario);
            
        res.status(200).json({ message: "Usuario  actualizado correctamente", data: usuarioActualizado});

    }catch(error){
        res.status(500).json({ message: "Error al actualizar usuario", error: error.message});
    }

};

//Controlador para eliminar un cliente

export const eliminarUsuario =  async (req, res) =>{
    try{
        const {id} = req.params;
        const usuario_eliminado = await eliminarUsuarioService(id);
        if(!usuario_eliminado){
                return res.status(404).json({ message:"Usuario no encontrado"});
        }
        res.status(200).json({ message: `Usuario con el ID: ${id} eliminado correctamente`});
    } catch (error){
        res.status(500).json({ message: "Error al eliminar el usuario", error: error.message});
    }
};