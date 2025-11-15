import { getAllPedidosService, getPedidoByIDService, searchPedidoService, crearPedidosService, actualizarPedidoService, eliminarPedidosService } from "../services/pedidos_service.js";


// Controlador GET Traer todos los pedidos

export const getPedidos = async (req, res) => {
    try{
        const pedidos =  await getAllPedidosService();
        res.status(200).json({ message: "Controlador funcionando: obteniendo toda la lista de Pedidos", data: pedidos});
    }catch (error) {
        res.status(500).json({ message: "Error al obtener lista de Pedidos", error: error.message});
    }
};


//Controlador GET ID -Obtener un pedido especifico
export const getPedidosByID = async (req,res) => {
    try{
        const {id} = req.params;

        const pedidos = await getPedidoByIDService(id);

         //validamos los datos
            if(!pedidos) {
                return res.status(404).json({ message: "Pedido no encontrado"});
            }
                return res.status(200).json({ message: "Pedido simulado encontrado", data: pedidos});

        } catch (error) {
            return res.status(500).json({ message: "Error al encontrar Pedido", error: error.message});
    }   
};

// Controlador GET SEARCH - Buscar pedidos por cliente
export const searchPedidos = async (req, res) => {
    try {
    const { nombre } = req.query;
        if (!nombre) {
            return res.status(400).json({ message: "Debe proporcionar un parámetro de búsqueda (?nombre=...)" });
        }

    const pedidosBuscados = await searchPedidoService(nombre);

        if (pedidosBuscados.length === 0) {
        return res.status(404).json({ message: "No se encontraron pedidos con esos criterios" });
    }

    return res.status(200).json({ message: "Pedidos encontrados",data: pedidosBuscados});

    } catch (error) {
    return res.status(500).json({
        message: "Error al buscar Pedido", error: error.message,});
    }
};



//Controlador para crear un nuevo pedido
export const crearPedidos = async (req, res) =>{
    try{
        const { fecha, total, id_cliente, id_usuario, id_sucursal, id_estado } = req.body; //extraer los datos del body

        // Validamos que sean campos obligatorios
        if( !fecha ||!total ||!id_cliente || !id_usuario ||!id_sucursal || !id_estado ){
            return res.status(400).json({ message: "Faltan datos obligatorios"});
        }

        const nuevoPedido = await crearPedidosService({fecha, total, id_cliente, id_usuario, id_sucursal, id_estado});
    
        console.log("Pedido creado", nuevoPedido);
        res.status(201).json({ message: "Pedido creado correctamente", data: nuevoPedido});       

    } catch (error){
        res.status(500).json({ message: "Error al crear el Pedido", error: error.message});
    }
};

//Controlador para actualizar un pedido
export const actualizarPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const pedido = req.body; 

        // Validamos campos obligatorios
        const { fecha, total, id_cliente, id_usuario, id_sucursal, id_estado } = pedido;

        if (!fecha || !total || !id_cliente || !id_usuario || !id_sucursal || !id_estado) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        const pedidoActualizado = await actualizarPedidoService(id, pedido);

        res.status(200).json({ 
            message: "Pedido actualizado correctamente", data: pedidoActualizado });

    } catch (error) {
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

        const pedido_eliminado = await eliminarPedidosService(id);
        res.status(200).json({ message: `Pedido con el ID: ${id} eliminado correctamente`});
    } catch (error){
        res.status(500).json({ message: "Error al eliminar el pedido", error: error.message});
    }
};
