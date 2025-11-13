import { getAllStockService, getStockByIDService, searchStockService, crearStockService, actualizarStockService,
    eliminarStockService} from "../services/stock_service.js";


// Controlador GET Traer todo el stock
export const getStock = async (req, res) => {
    try{
        const stock = await getAllStockService();
        res.status(200).json({ message: "Controlador funcionando: obteniendo toda la lista de Stock", data: stock});
    }catch (error) {
        res.status(500).json({ message: "Error al obtener lista de Stock", error: error.message});
    }
};


//Controlador GET ID -Obtener un pedido especifico
export const getStockByID = async (req,res) => {
    try{
        const {id} = req.params;

        const stock = await getStockByIDService(id);
    
          //validamos los datos
            if(!stock) {
                return res.status(404).json({ message: "Stock no encontrado"});
            }
                return res.status(200).json({ message: "Stock encontrado", data: stock});

        } catch (error) {
            return res.status(500).json({ message: "Error al encontrar Stock", error: error.message});
    }   
};

// Controlador GET SEARCH - Buscar stock por producto
export const searchStock = async (req, res) => {
    try {
    const {nombre } = req.query;

        if (!nombre) {
            return res.status(400).json({ message: "Debe proporcionar un parámetro de búsqueda (?nombre=...)" });
        }
    const stockBuscado = await searchStockService(nombre);

    if (stockBuscado.length === 0) {
        return res.status(404).json({ message: "No se encontraron stocks con esos criterios" });
    }

    return res.status(200).json({ message: "Stocks encontrados",data: stockBuscado});

    } catch (error) {
    return res.status(500).json({
        message: "Error al buscar Stock", error: error.message,});
    }
};

//Controlador para crear un nuevo stock
export const crearStock = async (req, res) =>{
    try{
        const {id_producto, cantidad_disponible, punto_reposicion, ultima_actualizacion} = req.body; //extraer los datos del body

        // Validamos que sean campos obligatorios
        if(!id_producto || !cantidad_disponible ||!punto_reposicion ||!ultima_actualizacion){
            return res.status(400).json({ message: "Faltan datos obligatorios"});
        }

        const nuevoStock =  await crearStockService({ id_producto, cantidad_disponible, punto_reposicion, ultima_actualizacion});
            res.status(201).json({ message: "Stock creado correctamente", data: nuevoStock});       

    } catch (error){
        res.status(500).json({ message: "Error al crear el Stock", error: error.message});
    }
};

//Controlador para actualizar Stock
export const actualizarStock =  async (req, res) => {
    try{
        const {id} =  req.params;
        const stock =  req.body;

        const stockActualizado  = await actualizarStockService(id, stock);

        //validamos los datos
        if (!stockActualizado){
            return res.status(400).json({message: "Faltan datos obligatorios"});
        }
            res.status(200).json({ message: "Stock actualizado correctamente", data: stockActualizado});

    }catch(error){
        res.status(500).json({ message: "Error al actualizar Stock", error: error.message});
    }

};

//Controlador para eliminar un cliente
export const eliminarStock =  async (req, res) =>{
    try{
        const {id} = req.params;
    
        const stockEliminado  = await eliminarStockService(id);
        
        if(!stockEliminado){
            res.status(404).json({message: "Stock no encontrado"});
        }
        res.status(200).json({ message: `Stock con el ID: ${id} eliminado correctamente`});

    } catch (error){
        res.status(500).json({ message: "Error al eliminar el Stock", error: error.message});
    }
};