import { getClientesService, getClienteByIDService, searchClienteService, crearClienteService, actualizarClienteService,
    eliminarClienteService } from "../services/clientes_service.js";
import logger from "../utils/logger.js";

// Controlador GET Traer todos los clientes
export const getClientes = async (req, res) => {
    try{
        logger.info("GET /clientes - Solicitando lista de clientes");
        const clientes =  await getClientesService();
        logger.info(`GET /clientes - ${clientes.length} clientes encontrados`);
        res.status(200).json({ message: "Controlador funcionando: obteniendo toda la lista de Clientes", data: clientes});

    }catch (error) {
        logger.error(`GET /clientes - Error: ${error.message}`);
        res.status(500).json({ message: "Error al obtener lista de Clientes", error: error.message});
    }
};


//Controlador GET ID -Obtener un cliente especifico
export const getClientesByID = async (req,res) => {
    try{
        const {id} = req.params;
        logger.info(`GET /clientes/${id} - Buscando cliente`);
        const clientes = await getClienteByIDService(id);
        
          //validamos los datos
            if(!clientes) {
                return res.status(404).json({ message: "Cliente no encontrado"});
            }
                logger.info(`GET /clientes/${id} - Cliente encontrado`);
                return res.status(200).json({ message: "Cliente encontrado", data: clientes});

        } catch (error) {
            logger.error(`GET /clientes/${id} - Error: ${error.message}`);
            return res.status(500).json({ message: "Error al encontrar Cliente", error: error.message});
    }   
};

//Controller GET SEARCH 
export const searchClientes = async (req, res) =>{
    try{
        const {nombre} = req.query; // viene de ?nombre=
        logger.info(`GET /clientes/search?nombre=${nombre} - Buscando clientes`);

        if (!nombre) {
            logger.warn("GET /clientes/search - Falta parámetro nombre");
            return res.status(400).json({ message: "Debe proporcionar un parámetro de búsqueda (?nombre=...)" });
        }

        const clienteBuscado = await searchClienteService(nombre);

        const resultados = clienteBuscado.filter(p =>
            p.nombre.toLowerCase().includes(nombre.toLowerCase())
        );
        
        logger.info(`GET /clientes/search - ${resultados.length} resultados`);
        if (resultados.length === 0) {
            logger.warn("GET /clientes/search - No se encontraron clientes");
            return res.status(404).json({ message: "No se encontraron clientes con ese nombre" });
        }

        return res.status(200).json({ message: "Resultados de búsqueda", data: resultados });

    } catch(error){
        logger.error(`GET /clientes/search - Error: ${error.message}`);
        return res.status(500).json({ message: "Error al buscar cliente", error: error.message});
    }
};

//Controlador para crear un nuevo cliente
export const crearCliente = async (req, res) =>{
    try{
        logger.info("POST /clientes - Datos recibidos", req.body);
        const { nombre, cuit, telefono, direccion, email, id_ciudad, id_tipo} = req.body; //extraer los datos del body

        // Validamos que sean campos obligatorios
        if(!nombre ||!cuit ||!telefono ||!email || !direccion || !id_ciudad ||!id_tipo){
            logger.warn("POST /clientes - Faltan datos obligatorios");
            return res.status(400).json({ message: "Faltan datos obligatorios"});
        }

        const nuevoCliente = await crearClienteService({nombre,cuit, telefono, direccion, email, id_ciudad, id_tipo});

        logger.info(`POST /clientes - Cliente creado ID: ${nuevoCliente.id}`);
        res.status(201).json({ message: "Cliente  creado correctamente", data: nuevoCliente});       

    } catch (error){
        logger.error(`POST /clientes - Error: ${error.message}`);
        res.status(500).json({ message: "Error al crear el cliente", error: error.message});
    }
};

//Controlador para actualizar un cliente
export const actualizarCliente =  async (req, res) => {
    try{
        const {id} =  req.params;
        const cliente =  req.body;
        logger.info(`PUT /clientes/${id} - Datos:`, req.body);

        const ClienteActualizado = await actualizarClienteService(id, cliente);

        logger.info(`PUT /clientes/${id} - Cliente actualizado`);
        res.status(200).json({ message: "Cliente actualizado correctamente", data: ClienteActualizado});

    }catch(error){
        logger.error(`PUT /clientes/${id} - Error: ${error.message}`);
        res.status(500).json({ message: "Error al actualizar Cliente", error: error.message});
    }

};

//Controlador para eliminar un cliente
export const eliminarCliente =  async (req, res) =>{
    try{
        const {id} = req.params;
        logger.info(`DELETE /clientes/${id} - Eliminando cliente`);
        const clienteEliminado = await eliminarClienteService(id);
    
        if (!clienteEliminado){
            logger.warn(`DELETE /clientes/${id} - Cliente no encontrado`);
            return res.status(404).json({ message:"Cliente no encontrado"});
        }
        logger.info(`DELETE /clientes/${id} - Cliente eliminado`);
        res.status(200).json({ message: `Cliente con el ID: ${id} eliminado correctamente`});

    } catch (error){
        logger.error(`DELETE /clientes/${id} - Error: ${error.message}`);
        res.status(500).json({ message: "Error al eliminar el cliente", error: error.message});
    }
};
