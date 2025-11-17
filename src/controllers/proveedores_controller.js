import { getProveedoresService, getProveedorByIDService, searchProveedorService, crearProveedorService,
    actualizarProveedorService, eliminarProveedorService} from "../services/proveedores_service.js"; 
import logger from "../utils/logger.js";


// Controlador GET Traer todos los proveedores
export const getProveedores = async (req, res) => {
    try{
        const proveedores = await getProveedoresService();
        logger.info("GET /proveedores - Lista de proveedores enviada correctamente");
        res.status(200).json({ message: "Controlador funcionando: obteniendo toda la lista de Proveedores", data: proveedores});

    }catch (error) {
        logger.error(`Error GET /proveedores: ${error.message}`);
        res.status(500).json({ message: "Error al obtener lista de Proveedores", error: error.message});
    }
};


//Controlador GET ID -Obtener un cliente especifico
export const getProveedorByID = async (req,res) => {
    try{
        const {id} = req.params;
        logger.info(`GET /proveedores/${id} - Buscando proveedor`);

        //validamos los datos
            if(!proveedores) {
                logger.warn(`Proveedor con ID ${id} no encontrado`);
                return res.status(404).json({ message: "Proveedor no encontrado"});
            }
    
        const proveedores = await getProveedorByIDService(id);
        logger.info(`Proveedor con ID ${id} encontrado`);    
        return res.status(200).json({ message: "Proveedor encontrado", data: proveedores});

        } catch (error) {
            logger.error(`Error GET /proveedores/${req.params.id}: ${error.message}`);
            return res.status(500).json({ message: "Error al encontrar Proveedor", error: error.message});
    }   
};

//Controller GET SEARCH 
export const searchProveedor = async (req, res) =>{
    try{
        const {nombre} = req.query; // viene de ?nombre=
        logger.info(`GET /proveedores/search?nombre=${nombre}`);

        if (!nombre) {
            logger.warn("Búsqueda sin parámetro ?nombre");
            return res.status(400).json({ message: "Debe proporcionar un parámetro de búsqueda (?nombre=...)" });
        }

        const ProveedoresBuscados = await searchProveedorService(nombre);

        if (ProveedoresBuscados.length === 0) {
            logger.warn(`No se encontraron proveedores con nombre: ${nombre}`);
            return res.status(404).json({ message: "No se encontraron proveedores con ese nombre" });
        }
        logger.info(`Proveedores encontrados: ${ProveedoresBuscados.length}`);
        return res.status(200).json({ message: "Resultados de búsqueda", data: ProveedoresBuscados });

    } catch(error){
        logger.error(`Error SEARCH /proveedores: ${error.message}`);
        return res.status(500).json({ message: "Error al buscar proveedor", error: error.message});
    }
};

//Controlador para crear un nuevo proveedor
export const crearProveedor = async (req, res) =>{
    try{
        const { nombre, cuit, direccion, telefono, email, id_ciudad} = req.body; //extraer los datos del body
        logger.info("POST /proveedores - Creando proveedor");

        // Validamos que sean campos obligatorios
        if(!nombre  ||!cuit ||!telefono ||!email  ||!direccion ||!id_ciudad){
            logger.warn("POST proveedor falló: faltan datos obligatorios");
            return res.status(400).json({ message: "Faltan datos obligatorios"});
        }

        const nuevoProveedor = await crearProveedorService({nombre,cuit, direccion, telefono, email, id_ciudad});
            logger.info(`Proveedor creado con ID: ${nuevoProveedor.id}`);
            return res.status(201).json({ message: "Proveedor creado correctamente", data: nuevoProveedor});       

    } catch (error){
        logger.error(`Error POST /proveedores: ${error.message}`);
        res.status(500).json({ message: "Error al crear el proveedor", error: error.message});
    }
};

//Controlador para actualizar un proveedor
export const actualizarProveedor =  async (req, res) => {
    try{
        const {id} =  req.params;
        const proveedor =  req.body;
        logger.info(`PUT /proveedores/${id} - Actualizando proveedor`);

        const proveedorActualizado =  await actualizarProveedorService(id, proveedor);

        //validamos los datos
        if (!proveedorActualizado){
            logger.warn(`Proveedor con ID ${id} no encontrado para actualizar`);
            return res.status(400).json({message: "Faltan datos obligatorios"});
        }
        logger.info(`Proveedor con ID ${id} actualizado correctamente`);
        res.status(200).json({ message: "Proveedor actualizado correctamente", data: proveedorActualizado});

    }catch(error){
        logger.error(`Error PUT /proveedores/${req.params.id}: ${error.message}`);
        res.status(500).json({ message: "Error al actualizar Proveedor", error: error.message});
    }

};

//Controlador para eliminar un proveedor
export const eliminarProveedor =  async (req, res) =>{
    try{
        const {id} = req.params;
        logger.info(`DELETE /proveedores/${id}`);

        const proveedorElim = await eliminarProveedorService(id);

        if (!proveedorElim){
            logger.warn(`Proveedor con ID ${id} no encontrado para eliminar`);
            return res.status(404).json({ message:"Proveedor no encontrado"});
        }
            logger.info(`Proveedor con ID ${id} eliminado`);
            res.status(200).json({ message: `Proveedor eliminado correctamente`, data: proveedorElim});

    } catch (error){
        logger.error(`Error DELETE /proveedores/${req.params.id}: ${error.message}`);
        res.status(500).json({ message: "Error al eliminar el proveedor", error: error.message});
    }
};
