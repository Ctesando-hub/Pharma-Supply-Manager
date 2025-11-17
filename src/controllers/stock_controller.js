import { getAllStockService, getStockByIDService, searchStockService, crearStockService, actualizarStockService,
    eliminarStockService} from "../services/stock_service.js";
import logger from "../utils/logger.js";

// Controlador GET Traer todo el stock
export const getStock = async (req, res) => {
    try{
        logger.info("GET /stock - Solicitando lista completa de stock");
        const stock = await getAllStockService();

        logger.info(`Stock obtenido correctamente - Cantidad: ${stock.length}`);
        res.status(200).json({ message: "Controlador funcionando: obteniendo toda la lista de Stock", data: stock});

    }catch (error) {
        logger.error(`Error al obtener Stock: ${error.message}`);
        res.status(500).json({ message: "Error al obtener lista de Stock", error: error.message});
    }
};


//Controlador GET ID -Obtener un pedido especifico
export const getStockByID = async (req,res) => {
    try{
        const {id} = req.params;
        logger.info(`GET /stock/${id} - Buscando stock por ID`);

        const stock = await getStockByIDService(id);
    
          //validamos los datos
            if(!stock) {
                logger.warn(`Stock con ID ${id} no encontrado`);
                return res.status(404).json({ message: "Stock no encontrado"});
            }
                logger.info(`Stock con ID ${id} encontrado`);
                return res.status(200).json({ message: "Stock encontrado", data: stock});

        } catch (error) {
            logger.error(`Error al buscar Stock por ID: ${error.message}`);
            return res.status(500).json({ message: "Error al encontrar Stock", error: error.message});
    }   
};

// Controlador GET SEARCH - Buscar stock por producto
export const searchStock = async (req, res) => {
    try {
    const {nombre } = req.query;
    logger.info(`GET /stock/search?nombre=${nombre}`);

        if (!nombre) {
            logger.warn("Búsqueda sin parámetro 'nombre'");
            return res.status(400).json({ message: "Debe proporcionar un parámetro de búsqueda (?nombre=...)" });
        }
    const stockBuscado = await searchStockService(nombre);

    if (stockBuscado.length === 0) {
        logger.warn(`No se encontraron resultados para: ${nombre}`);
        return res.status(404).json({ message: "No se encontraron stocks con esos criterios" });
    }

    logger.info(`Stock encontrado para búsqueda: ${nombre}`);
    return res.status(200).json({ message: "Stocks encontrados",data: stockBuscado});

    } catch (error) {
        logger.error(`Error al buscar Stock: ${error.message}`);
        return res.status(500).json({message: "Error al buscar Stock", error: error.message,});
    }
};

//Controlador para crear un nuevo stock
export const crearStock = async (req, res) =>{
    try{
        const {id_producto, cantidad_disponible, punto_reposicion, ultima_actualizacion} = req.body; //extraer los datos del body
        logger.info("POST /stock - Creando nuevo stock", { body: req.body });

        // Validamos que sean campos obligatorios
        if(!id_producto || !cantidad_disponible ||!punto_reposicion ||!ultima_actualizacion){
            logger.warn("Intento de creación con datos incompletos");
            return res.status(400).json({ message: "Faltan datos obligatorios"});
        }

        const nuevoStock =  await crearStockService({ id_producto, cantidad_disponible, punto_reposicion, ultima_actualizacion});

        logger.info("Stock creado correctamente", nuevoStock);
        res.status(201).json({ message: "Stock creado correctamente", data: nuevoStock});       

    } catch (error){
        logger.error(`Error al crear Stock: ${error.message}`);
        res.status(500).json({ message: "Error al crear el Stock", error: error.message});
    }
};

//Controlador para actualizar Stock
export const actualizarStock =  async (req, res) => {
    try{
        const {id} =  req.params;
        const stock =  req.body;
        logger.info(`PUT /stock/${id} - Actualizando stock`, { body: stock });

        const stockActualizado  = await actualizarStockService(id, stock);

        //validamos los datos
        if (!stockActualizado){
            logger.warn(`Intento de actualizar stock inexistente ID ${id}`);
            return res.status(400).json({message: "Faltan datos obligatorios"});
        }
            logger.info(`Stock ID ${id} actualizado correctamente`);
            res.status(200).json({ message: "Stock actualizado correctamente", data: stockActualizado});

    }catch(error){
        logger.error(`Error al actualizar Stock: ${error.message}`);
        res.status(500).json({ message: "Error al actualizar Stock", error: error.message});
    }

};

//Controlador para eliminar un cliente
export const eliminarStock =  async (req, res) =>{
    try{
        const {id} = req.params;
        logger.info(`DELETE /stock/${id} - Eliminando stock`);
    
        const stockEliminado  = await eliminarStockService(id);
        
        if(!stockEliminado){
            logger.warn(`Stock con ID ${id} no encontrado para eliminar`);
            res.status(404).json({message: "Stock no encontrado"});
        }
        logger.info(`Stock ID ${id} eliminado correctamente`);
        res.status(200).json({ message: `Stock con el ID: ${id} eliminado correctamente`, data: stockEliminado});

    } catch (error){
        logger.error(`Error al eliminar Stock: ${error.message}`);
        res.status(500).json({ message: "Error al eliminar el Stock", error: error.message});
    }
};