// Controlador GET Traer todo el stock

export const getStock = async (req, res) => {
    try{
        res.status(200).json({ message: "Controlador funcionando: obteniendo toda la lista de Stock"});
    }catch (error) {
        res.status(500).json({ message: "Error al obtener lista de Stock", error: error.message});
    }
};


//Controlador GET ID -Obtener un pedido especifico
export const getStockByID = async (req,res) => {
    try{
        const {id} = req.params;

        //simulamos la busqueda
        const stock ={id_producto: "78", cantidad_disponible: "11", punto_reposicion: "500", ultima_actualizacion: "12/12/2002"};
    

            //validamos los datos
            if(!stock) {
                return res.status(404).json({ message: "Stock no encontrado"});
            }
                return res.status(200).json({ message: "Stock simulado encontrado", data: stock});

        } catch (error) {
            return res.status(500).json({ message: "Error al encontrar Stock", error: error.message});
    }   
};

// Controlador GET SEARCH - Buscar stock por producto
export const searchStock = async (req, res) => {
    try {
    const {id_producto } = req.query;


    // Simulación de pedidos en memoria
    const stock = [
        { id: 1, id_producto: "78", cantidad_disponible: "23", punto_reposicion:"100",ultima_actualizacion: "23/08/2024" },
        {id: 3, id_producto: "65", cantidad_disponible: "201", punto_reposicion:"150",ultima_actualizacion: "07/09/2024" },
        {id: 10, id_producto: "80", cantidad_disponible: "879", punto_reposicion:"500",ultima_actualizacion: "23/08/2025" },
    ];

    let resultados = stock;

    // Filtro por id_cliente (numérico o string)
    if (id_producto && id_producto.trim() !== "") {
        resultados = resultados.filter(
        (p) => p.id_producto.toString().trim() === id_producto.toString().trim()
        );
    }

    if (resultados.length === 0) {
        return res.status(404).json({ message: "No se encontraron stocks con esos criterios" });
    }

    return res.status(200).json({
        message: "Stocks encontrados",
        data: resultados,
    });
    } catch (error) {
    return res.status(500).json({
        message: "Error al buscar Stock",
        error: error.message,
    });
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


        //por ahora simulo la insercion con un mensaje

        const nuevoStock = {
            id: Date.now(), //simulo un id autoincremental
            id_producto, cantidad_disponible, punto_reposicion, ultima_actualizacion

        };
            console.log("Stock creado", nuevoStock);

        res.status(201).json({ message: "Stock simulado creado correctamente", data: nuevoStock});       

    } catch (error){
        res.status(500).json({ message: "Error al crear el Stock simulado", error: error.message});
    }
};

//Controlador para actualizar Stock
export const actualizarStock =  async (req, res) => {
    try{
        const {id} =  req.params;
        const {id_producto, cantidad_disponible, punto_reposicion, ultima_actualizacion} =  req.body;

        //validamos los datos
        if (!id_producto || !cantidad_disponible ||!punto_reposicion || !ultima_actualizacion){
            return res.status(400).json({message: "Faltan datos obligatorios"});
        }

        //simulamos la actualizacion
        const StockActualizado = {
            id, id_producto, cantidad_disponible, punto_reposicion, ultima_actualizacion
        };

        res.status(200).json({ message: "Stock simulado actualizado correctamente", data: StockActualizado});

    }catch(error){
        res.status(500).json({ message: "Error al actualizar Stock simulado", error: error.message});
    }

};

//Controlador para eliminar un cliente

export const eliminarStock =  async (req, res) =>{
    try{
        const {id} = req.params;


      //simulamos la eliminacion de un producto especifico
        res.status(200).json({ message: `Stock simulado con el ID: ${id} eliminado correctamente`});
    } catch (error){
        res.status(500).json({ message: "Error al eliminar el Stock", error: error.message});
    }
};