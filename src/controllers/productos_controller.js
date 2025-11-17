
import {actualizarProductoService, crearProductoService, eliminarProductoService, getProductoByIDService, getProductosService, searchProductosService } from "../services/productos_service.js";
import logger from "../utils/logger.js"; // Importa logger


// Controlador para obtener todos los productos
export const getProductos = async (req, res) =>{
    logger.info("GET /productos - Solicitando lista completa de productos");
    try{
        const productos = await getProductosService(); //LLama al servicio para traer todos los productos
        logger.info(`Productos obtenidos: ${productos.length}`);

        return res.status(200).json({ message: "Lista de productos obtenida correctamente", data: productos });

    } catch(error) {
        logger.error("Error al obtener productos", { error: error.message });
        res.status(500).json({message: "Error al obtener productos", error: error.message});
    }
    
};

//Controller GET ID *Obtener un producto especifico
export const getProductoByID = async (req, res) =>{
    try{
        const {id} = req.params;
        logger.info(`GET /productos/${id} - Buscando producto por ID`);

        
        const producto = await getProductoByIDService(id);

        if (!producto){
            logger.warn(`Producto ID ${id} no encontrado`);
            return res.status(404).json({ message: "producto no encontrado"});
        }
            logger.info(`Producto ID ${id} encontrado`);
            return res.status(200).json({ message: "Producto encontrado", data: producto});

    } catch(error){
        logger.error("Error al buscar producto", { error: error.message });
        return res.status(500).json({ message: "Error al buscar producto", error: error.message});
    }
};

//Controller GET SEARCH 
export const  searchProductos = async (req, res) =>{
    try{
        const {nombre} = req.query; // viene de ?nombre=
        logger.info(`GET /productos/search?nombre=${nombre}`);

        if (!nombre) {
            logger.warn("Búsqueda sin parámetro nombre");
            return res.status(400).json({ message: "Debe proporcionar un parámetro de búsqueda (?nombre=...)" });
        }

        const productosBuscados = await searchProductosService(nombre);

        if (productosBuscados.length === 0) {
            logger.warn(`No se encontraron productos con: ${nombre}`);
            return res.status(404).json({ message: "No se encontraron productos con ese nombre" });
        }
            logger.info(`Productos encontrados: ${productosBuscados.length}`);
            return res.status(200).json({ message: "Resultados de búsqueda", data: productosBuscados });

    } catch(error){
        logger.error("Error al buscar producto", { error: error.message });
        return res.status(500).json({ message: "Error al buscar producto", error: error.message});
    }
};

// Controlador para crear un nuevo producto
export const crearProducto = async (req, res) =>{
    
    try{
        logger.info("POST /productos - Creando producto", { body: req.body });
        const { nombre, descripcion, precio, id_proveedor} = req.body; //extraer los datos del body
        

        // Validamos que sean campos obligatorios
        if(!nombre || !descripcion ||!precio || !id_proveedor){
            logger.warn("POST /productos - Faltan datos obligatorios");
            return res.status(400).json({ message: "Faltan datos obligatorios"});
        }
            const nuevoProducto = await crearProductoService({nombre, descripcion, precio, id_proveedor});
            logger.info("Producto creado exitosamente", { id: nuevoProducto.id });
            res.status(201).json({ message: "Producto creado correctamente", data: nuevoProducto});       

        } catch (error){
            logger.error("Error al crear producto", { error: error.message });
            res.status(500).json({ message: "Error al crear el producto", error: error.message});
        }
};

//Controlador para actualizar un producto
export const actualizarProducto =  async (req, res) => {
    try{
        const {id} =  req.params;
        const producto = req.body;
        logger.info(`PUT /productos/${id} - Actualizando producto`, { body: req.body });

        const productoActualizado =  await actualizarProductoService(id, producto);
        
            if (!productoActualizado) {
                logger.warn(`Producto ID ${id} no encontrado`);    
                return res.status(404).json({ message: "Producto no encontrado" });
        }
            logger.info(`Producto ID ${id} actualizado`);
            res.status(200).json({ message: "Producto actualizado correctamente", data: productoActualizado});

    }catch(error){
        logger.error("Error al actualizar producto", { error: error.message });
        res.status(500).json({ message: "Error al actualizar producto", error: error.message});
    }

};

//Controlador para eliminar un producto

export const eliminarProducto =  async (req, res) =>{
    logger.info(`DELETE /productos/${id} - Eliminando producto`);
    try{
        const {id} = req.params;
        const eliminado = await eliminarProductoService(id);

        if (!eliminado){
            logger.warn(`Producto ID ${id} no encontrado para eliminar`);
            return res.status(404).json({ message:"Producto no encontrado"});
        }
        logger.info(`Producto ID ${id} eliminado`);
        res.status(200).json({ message: "Producto eliminado correctamente", data: eliminado});

    } catch (error){
        logger.error("Error al eliminar producto", { error: error.message });
        res.status(500).json({ message: "Error al eliminar el producto", error: error.message});
    }
};