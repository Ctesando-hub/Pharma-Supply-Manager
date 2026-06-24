import { getAllComprasService, getDetalleCompraService, getComprasFiltrosService, getCompraByIDService, searchCompraService, crearComprasService, actualizarCompraService, eliminarCompraService } from "../services/compras_service.js";
import logger from "../utils/logger.js";

// Controlador GET Traer todos las Compras

export const getCompras = async (req, res) => {
    try{
        logger.info("GET /compras → Solicitando lista de Compras");
        const compra =  await getAllComprasService();
        logger.info(`GET /compras → Cantidad de compras: ${compra.length}`);
        res.status(200).json({ message: "Controlador funcionando: obteniendo toda la lista de Compras", data: compra});

    }catch (error) {
        logger.error("Error en GET /compras:", error);
        res.status(500).json({ message: "Error al obtener lista de Compras", error: error.message});
    }
};
// GET /compras/:id/detalle
export const getDetalleCompra = async (req, res) => {

    try {
        const { id } = req.params;

        logger.info(`GET /compras/${id}/detalle → Solicitando detalle de compra`);

        const detalle = await getDetalleCompraService(id);

        if (detalle.length === 0) {

            logger.warn(`GET /compras/${id}/detalle → No se encontró detalle`);
            return res.status(404).json({
                message: "No se encontraron productos para esta compra"
            });
        }

        logger.info(
            `GET /compras/${id}/detalle → Productos encontrados: ${detalle.length}`
        );

        return res.status(200).json({message: "Detalle de compra encontrado", data: detalle
        });

    } catch (error) {
        logger.error(
            `Error en GET /compras/${req.params.id}/detalle: ${error.message}`);

        return res.status(500).json({
            message: "Error al obtener detalle de compra",
            error: error.message});
    }
};


//Controlador GET ID -Obtener una compra especifica
export const getCompraByID = async (req,res) => {
    try{
        const {id} = req.params;
        logger.info(`GET /compras/${id} → Solicitando una compra por ID`);

        const compra = await getCompraByIDService(id);

         //validamos los datos
            if(!compra) {
                logger.warn(`GET /compras/${id} → Compra no encontrada`);
                return res.status(404).json({ message: "Compra no encontrada"});
            }
                logger.info(`GET /compras/${id} → Compra encontrada`);
                return res.status(200).json({ message: "Compra encontrada", data: compra});

        } catch (error) {
            logger.error(`Error en GET /compras/${req.params.id}:`, error);
            return res.status(500).json({ message: "Error al encontrar Compra", error: error.message});
    }   
};

// Controlador GET SEARCH - Buscar Compras por nombre de proveedor
export const searchCompras = async (req, res) => {
    try {
    const { nombre } = req.query;
    logger.info(`GET /compras/search?nombre=${nombre}`);

        if (!nombre) {
            logger.warn("searchCompras → Falta parámetro ?nombre");
            return res.status(400).json({ message: "Debe proporcionar un parámetro de búsqueda (?nombre=...)" });
        }

    const comprasBuscadas = await searchCompraService(nombre);

        if (comprasBuscadas.length === 0) {
            logger.warn(`searchCompras → No se encontraron compras para: ${nombre}`);
            return res.status(404).json({ message: "No se encontraron compras con esos criterios" });
    }
        logger.info(`searchCompras → Resultados encontrados: ${comprasBuscadas.length}`);
        return res.status(200).json({ message: "Compras encontradas: ",data: comprasBuscadas});

    } catch (error) {
        logger.error("Error en searchCompras:", error);
        return res.status(500).json({
        message: "Error al buscar Compra", error: error.message,});
    }
};

// FILTROS COMBINADOS
export const getFiltroCompra = async (req, res) => {
    try {

        const { id_compra, proveedor, estado } = req.query;

        const compras = await getComprasFiltrosService({
            id_compra: id_compra || null,
            proveedor: proveedor || null,
            estado: estado || null
        });

        logger.info(`Filtros compras → ${compras.length} resultados`);

        return res.status(200).json({
            message: "Filtros aplicados correctamente",
            data: compras
        });

    } catch (error) {
        console.error("Error filtros:", error);
        return res.status(500).json({
            message: "Error al filtrar compras",
            error: error.message
        });
    }
};


//Controlador para crear una nueva Compra
export const crearCompras = async (req, res) =>{
    try{
       // logger.info("POST /compras → Datos recibidos:", req.body);
    console.log("BODY RECIBIDO:", req.body);

        const {total, id_proveedor, id_usuario, id_sucursal, id_estado, productos } = req.body; //extraer los datos del body

        // Validamos que sean campos obligatorios
        if(!total ||!id_proveedor || !id_usuario ||!id_sucursal || !id_estado ){
            logger.warn("POST /compras → Faltan datos obligatorios");
            return res.status(400).json({ message: "Faltan datos obligatorios"});
        }
        if(!productos || !Array.isArray(productos) || productos.length === 0){
            logger.warn("POST /compras → La Compra debe contener productos");
            return res.status(400).json({ message: "Debe incluir al menos un producto"});
}
        console.log("PRODUCTOS CONTROLLER:", productos);
        const nuevaCompra = await crearComprasService({total, id_proveedor, id_usuario, id_sucursal, id_estado, productos});
    
        logger.info("POST /compras → Compra creada exitosamente", nuevaCompra);
        res.status(201).json({ message: "Compra creada correctamente", data: nuevaCompra});       

    } catch (error){
        logger.error("Error en POST /compras:", error);
        res.status(500).json({ message: "Error al crear Compra", error: error.message});
    }
};

//Controlador para actualizar una compra
export const actualizarCompra = async (req, res) => {

    try {

        const { id } = req.params;
        const { id_estado } = req.body;

        logger.info(`PUT /compras/${id} → Datos recibidos para actualizar`, req.body);

        if (!id_estado) {
            logger.warn(`PUT /compras/${id} → Debe indicar el estado`);
            return res.status(400).json({
                message: "Debe indicar el estado de la compra"
            });
        }

        const compraActualizada =
            await actualizarCompraService(id, { id_estado });

        logger.info(`PUT /compras/${id} → Compra actualizada con éxito`);

        res.status(200).json({
            message: "Compra actualizada correctamente", data: compraActualizada
        });

    } catch (error) {
        logger.error(`Error en PUT /compras/${req.params.id}:`,error);
        res.status(500).json({
            message: "Error al actualizar Compra", error: error.message
        });

    }
};

//Controlador para eliminar una Compra

export const eliminarCompra =  async (req, res) =>{
    try{
        const {id} = req.params;
        logger.info(`DELETE /compras/${id} → Eliminando compra`);

        const compra_eliminada = await eliminarCompraService(id);

        //Validamos si existe la compra
        if(!compra_eliminada){
    return res.status(404).json({ message: "Compra no encontrada"});
}

        logger.info(`DELETE /compras/${id} → Compra eliminada correctamente`);
        res.status(200).json({ message: `Compra con el ID: ${id} eliminada correctamente`, data: compra_eliminada});

    } catch (error){
        logger.error(`Error en DELETE /compras/${req.params.id}:`, error);
        res.status(500).json({ message: "Error al eliminar la compra", error: error.message});
    }
};
