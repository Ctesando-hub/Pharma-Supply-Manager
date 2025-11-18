import { getAllPedidosService, getPedidoByIDService, searchPedidoService, crearPedidosService, actualizarPedidoService, eliminarPedidosService } from "../services/pedidos_service.js";
import logger from "../utils/logger.js";

// Controlador GET Traer todos los pedidos

export const getPedidos = async (req, res) => {
    try{
        logger.info("GET /pedidos → Solicitando todos los pedidos");
        const pedidos =  await getAllPedidosService();
        logger.info(`GET /pedidos → Cantidad de pedidos: ${pedidos.length}`);
        res.status(200).json({ message: "Controlador funcionando: obteniendo toda la lista de Pedidos", data: pedidos});

    }catch (error) {
        logger.error("Error en GET /pedidos:", error);
        res.status(500).json({ message: "Error al obtener lista de Pedidos", error: error.message});
    }
};


//Controlador GET ID -Obtener un pedido especifico
export const getPedidosByID = async (req,res) => {
    try{
        const {id} = req.params;
        logger.info(`GET /pedidos/${id} → Solicitando pedido por ID`);

        const pedidos = await getPedidoByIDService(id);

         //validamos los datos
            if(!pedidos) {
                logger.warn(`GET /pedidos/${id} → Pedido no encontrado`);
                return res.status(404).json({ message: "Pedido no encontrado"});
            }
                logger.info(`GET /pedidos/${id} → Pedido encontrado`);
                return res.status(200).json({ message: "Pedido encontrado", data: pedidos});

        } catch (error) {
            logger.error(`Error en GET /pedidos/${req.params.id}:`, error);
            return res.status(500).json({ message: "Error al encontrar Pedido", error: error.message});
    }   
};

// Controlador GET SEARCH - Buscar pedidos por cliente
export const searchPedidos = async (req, res) => {
    try {
    const { nombre } = req.query;
    logger.info(`GET /pedidos/search?nombre=${nombre}`);

        if (!nombre) {
            logger.warn("searchPedidos → Falta parámetro ?nombre");
            return res.status(400).json({ message: "Debe proporcionar un parámetro de búsqueda (?nombre=...)" });
        }

    const pedidosBuscados = await searchPedidoService(nombre);

        if (pedidosBuscados.length === 0) {
            logger.warn(`searchPedidos → No se encontraron pedidos para: ${nombre}`);
            return res.status(404).json({ message: "No se encontraron pedidos con esos criterios" });
    }
        logger.info(`searchPedidos → Resultados encontrados: ${pedidosBuscados.length}`);
        return res.status(200).json({ message: "Pedidos encontrados",data: pedidosBuscados});

    } catch (error) {
        logger.error("Error en searchPedidos:", error);
        return res.status(500).json({
        message: "Error al buscar Pedido", error: error.message,});
    }
};


//Controlador para crear un nuevo pedido
export const crearPedidos = async (req, res) =>{
    try{
        logger.info("POST /pedidos → Datos recibidos:", req.body);

        const { fecha, total, id_cliente, id_usuario, id_sucursal, id_estado } = req.body; //extraer los datos del body

        // Validamos que sean campos obligatorios
        if( !fecha ||!total ||!id_cliente || !id_usuario ||!id_sucursal || !id_estado ){
            logger.warn("POST /pedidos → Faltan datos obligatorios");
            return res.status(400).json({ message: "Faltan datos obligatorios"});
        }

        const nuevoPedido = await crearPedidosService({fecha, total, id_cliente, id_usuario, id_sucursal, id_estado});
    
        logger.info("POST /pedidos → Pedido creado exitosamente", nuevoPedido);
        res.status(201).json({ message: "Pedido creado correctamente", data: nuevoPedido});       

    } catch (error){
        logger.error("Error en POST /pedidos:", error);
        res.status(500).json({ message: "Error al crear el Pedido", error: error.message});
    }
};

//Controlador para actualizar un pedido
export const actualizarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const pedido = req.body; 
        logger.info(`PUT /pedidos/${id} → Datos recibidos para actualizar`, req.body);

        // Validamos campos obligatorios
        const { fecha, total, id_cliente, id_usuario, id_sucursal, id_estado } = pedido;

        if (!fecha || !total || !id_cliente || !id_usuario || !id_sucursal || !id_estado) {
            logger.warn(`PUT /pedidos/${id} → Faltan datos obligatorios`);
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        const pedidoActualizado = await actualizarPedidoService(id, pedido);

        logger.info(`PUT /pedidos/${id} → Pedido actualizado con éxito`);
        res.status(200).json({ 
            message: "Pedido actualizado correctamente", data: pedidoActualizado });

    } catch (error) {
        logger.error(`Error en PUT /pedidos/${req.params.id}:`, error);
        res.status(500).json({ 
            message: "Error al actualizar Pedido", 
            error: error.message 
        });
    }
};

//Controlador para eliminar un pedido

export const eliminarPedido =  async (req, res) =>{
    try{
        const {id} = req.params;
        logger.info(`DELETE /pedidos/${id} → Eliminando pedido`);

        const pedido_eliminado = await eliminarPedidosService(id);

        logger.info(`DELETE /pedidos/${id} → Pedido eliminado correctamente`);
        res.status(200).json({ message: `Pedido con el ID: ${id} eliminado correctamente`, data: pedido_eliminado});

    } catch (error){
        logger.error(`Error en DELETE /pedidos/${req.params.id}:`, error);
        res.status(500).json({ message: "Error al eliminar el pedido", error: error.message});
    }
};
