
// Controlador para obtener todos los productos
export const getProductos = async (req, res) =>{
    try{
        res.send("Obteniendo lista de productos desde la DB...");
    } catch(error) {
        res.status(500).json({message: "Error al obtener productos", error: error.message});
    }
    
};

//Controller GET ID *Obtener un producto especifico
export const getProductoByID = async (req, res) =>{
    try{
        const {id} = req.params;

        // Simular la busqueda en bd
        const producto = { id, nombre: "PRODUCTO 1",  descripcion: "Medicamento", precio:100, stock: 300, id_proveedor: "4"};

        if (!producto){
            return res.status(404).json({ message: "producto simulado no encontrado"});
        }
            return res.status(200).json({ message: "Producto simulado encontrado", data: producto});
    } catch(error){
        return res.status(500).json({ message: "Error al buscar producto", error: error.message});
    }
};

// Controlador para crear un nuevo producto
export const crearProducto = async (req, res) =>{
    try{
        const { nombre, descripcion, precio,stock, id_proveedor} = req.body; //extraer los datos del body

        // Validamos que sean campos obligatorios
        if(!nombre || !descripcion ||!precio || !stock || !id_proveedor){
            return res.status(400).json({ message: "Faltan datos obligatorios"});
        }


        //por ahora simulo la insercion con un mensaje

        const nuevoProducto = {
            id: Date.now(), //simulo un id autoincremental
            nombre, descripcion, precio, stock: stock || 0, id_proveedor

        };
            console.log("Producto creado", nuevoProducto);

        res.status(201).json({ message: "Producto simulado creado correctamente", data: nuevoProducto});       

    } catch (error){
        res.status(500).json({ message: "Error al crear el producto simulado", error: error.message});
    }
};

//Controlador para actualizar un producto
export const actualizarProducto =  async (req, res) => {
    try{
        const {id} =  req.params;
        const {nombre, descripcion, precio, stock, id_proveedor } =  req.body;

        //validamos los datos
        if (!nombre || !descripcion ||!precio || !stock || !id_proveedor){
            return res.status(400).json({message: "Faltan datos obligatorios"});
        }

        //simulamos la actualizacion
        const productoActualizado = {
            id, nombre, descripcion, precio, stock, id_proveedor
        };

        res.status(200).json({ message: "Producto simulado actualizado correctamente", data: productoActualizado});

    }catch(error){
        res.status(500).json({ message: "Error al actualizar producto simulado", error: error.message});
    }

};

//Controlador para eliminar un producto

export const eliminarProducto =  async (req, res) =>{
    try{
        const {id} = req.params;


      //simulamos la eliminacion de un producto especifico
        res.status(200).json({ message: `Producto simulado con el ID: ${id} eliminado correctamente`});
    } catch (error){
        res.status(500).json({ message: "Error al eliminar el producto", error: error.message});
    }
};