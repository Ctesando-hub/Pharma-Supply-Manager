// Controlador GET Traer todos los clientes

export const getPedidos = async (req, res) => {
    try{
        res.status(200).json({ message: "Controlador funcionando: obteniendo toda la lista de Pedidos"});
    }catch (error) {
        res.status(500).json({ message: "Error al obtener lista de Pedidos", error: error.message});
    }
};


//Controlador GET ID -Obtener un pedido especifico
export const getPedidosByID = async (req,res) => {
    try{
        const {id} = req.params;

        //simulamos la busqueda
        const pedidos ={id_cliente: "78", id_usuario: "011", fecha_pedido: "12/12/2002", estado: "En preparacion", total: "25.3660",
            detalles: [
        { id_producto: 1, nombre: "Paracetamol 500mg", cantidad: 2, precio_unitario: 1500 },
        { id_producto: 2, nombre: "Ibuprofeno 400mg", cantidad: 1, precio_unitario: 1200 }
        ]
    };
    

            //validamos los datos
            if(!pedidos) {
                return res.status(404).json({ message: "Pedido no encontrado"});
            }
                return res.status(200).json({ message: "Pedido simulado encontrado", data: pedidos});

        } catch (error) {
            return res.status(500).json({ message: "Error al encontrar Pedido", error: error.message});
    }   
};

// Controlador GET SEARCH - Buscar pedidos por estado o cliente
export const searchPedidos = async (req, res) => {
    try {
    const { estado, id_cliente } = req.query;

    console.log("Valor recibido en estado:", estado);
    console.log("Valor recibido en id_cliente:", id_cliente);

    // Simulación de pedidos en memoria
    const pedidos = [
        { id: 1, id_cliente: "78", id_usuario: "23", fecha_pedido: "23-09-2009", estado: "En preparación", total: 25366 },
        { id: 2, id_cliente: "79", id_usuario: "20", fecha_pedido: "03-08-2009", estado: "Entregado", total: 18000 },
        { id: 3, id_cliente: "80", id_usuario: "78", fecha_pedido: "11-09-2010", estado: "Cancelado", total: 5000 }
    ];

    let resultados = pedidos;

    // 🔎 Función para normalizar texto (quita tildes y pasa a minúsculas)
    const normalizar = (texto) =>
        texto
        ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase()
        : "";

    // Filtro por estado
    if (estado && estado.trim() !== "") {
        const estadoBuscado = normalizar(estado);
        resultados = resultados.filter((p) =>
        normalizar(p.estado).includes(estadoBuscado)
        );
    }

    // Filtro por id_cliente (numérico o string)
    if (id_cliente && id_cliente.trim() !== "") {
        resultados = resultados.filter(
        (p) => p.id_cliente.toString().trim() === id_cliente.toString().trim()
        );
    }

    if (resultados.length === 0) {
        return res.status(404).json({ message: "No se encontraron pedidos con esos criterios" });
    }

    return res.status(200).json({
        message: "Pedidos encontrados",
        data: resultados,
    });
    } catch (error) {
    return res.status(500).json({
        message: "Error al buscar pedidos",
        error: error.message,
    });
    }
};



//Controlador para crear un nuevo pedido
export const crearPedidos = async (req, res) =>{
    try{
        const { id_cliente, id_usuario, fecha_pedido, estado, total } = req.body; //extraer los datos del body

        // Validamos que sean campos obligatorios
        if(!id_cliente || !id_usuario ||!fecha_pedido || !estado || !total){
            return res.status(400).json({ message: "Faltan datos obligatorios"});
        }


        //por ahora simulo la insercion con un mensaje

        const nuevoPedido = {
            id: Date.now(), //simulo un id autoincremental
            id_cliente, id_usuario, fecha_pedido, estado, total

        };
            console.log("Pedido creado", nuevoPedido);

        res.status(201).json({ message: "Pedido simulado creado correctamente", data: nuevoPedido});       

    } catch (error){
        res.status(500).json({ message: "Error al crear el Pedido simulado", error: error.message});
    }
};

//Controlador para actualizar un cliente
export const actualizarPedido =  async (req, res) => {
    try{
        const {id} =  req.params;
        const {id_cliente, id_usuario, fecha_pedido,estado,total } =  req.body;

        //validamos los datos
        if (!id_cliente || !id_usuario ||!fecha_pedido || !estado || !total){
            return res.status(400).json({message: "Faltan datos obligatorios"});
        }

        //simulamos la actualizacion
        const pedidoActualizado = {
            id, id_cliente, id_usuario, fecha_pedido, estado, total 
        };

        res.status(200).json({ message: "Pedido simulado actualizado correctamente", data: pedidoActualizado});

    }catch(error){
        res.status(500).json({ message: "Error al actualizar Pedido simulado", error: error.message});
    }

};

//Controlador para eliminar un cliente

export const eliminarPedido =  async (req, res) =>{
    try{
        const {id} = req.params;


      //simulamos la eliminacion de un producto especifico
        res.status(200).json({ message: `Pedido simulado con el ID: ${id} eliminado correctamente`});
    } catch (error){
        res.status(500).json({ message: "Error al eliminar el pedido", error: error.message});
    }
};
