
import {actualizarProductoService, crearProductoService, eliminarProductoService, getProductoByIDService, getProductosService, searchProductosService , getProductosFiltrosService} from "../services/productos_service.js";
import logger from "../utils/logger.js"; // Importa logger
import {cloudinary} from "../config/cloudinary.js";


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

// FILTROS COMBINADOS
export const getProductosFiltros = async (req, res) => {

    try {

        const { nombre, proveedor}= req.query;

        const productos = await getProductosFiltrosService({
            nombre,
            proveedor
        });
        logger.info( `Resultados encontrados: ${productos.length}`)
        return res.status(200).json({
            message: "Filtros aplicados correctamente",
            data: productos
        });

    } catch (error) {

        console.error("Error filtros:", error);
        logger.error(`Error en getProductosFiltro: ${error.message}`);
        return res.status(500).json({
            message: "Error al filtrar productos",
            error: error.message
        });
    }
};


// Controlador para crear un nuevo producto
export const crearProducto = async (req, res) => {

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    try {

        logger.info("POST /productos - Creando producto", {
            body: req.body
        });

        const { nombre, descripcion, precio, id_proveedor } = req.body;

        // ARCHIVOS RECIBIDOS POR MULTER
        const imagen = req.files?.imagen?.[0];
        const prospecto = req.files?.prospecto?.[0];

        let imagen_url = null;
        let prospecto_url = null;

        // VALIDACIONES
        if (!nombre || !descripcion || !precio || !id_proveedor) {

            logger.warn("POST /productos - Faltan datos obligatorios");

            return res.status(400).json({
                message: "Faltan datos obligatorios"
            });
        }

        // SUBIR IMAGEN DEL PRODUCTO
        if (imagen) {

            const resultadoImagen = await new Promise((resolve, reject) => {

                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "image",
                        folder: "productos"
                    },
                    (error, result) => {

                        if (error) {
                            return reject(error);
                        }

                        resolve(result);
                    }
                );

                stream.end(imagen.buffer);
            });

            imagen_url = resultadoImagen.secure_url;
        }

        // SUBIR PROSPECTO (IMAGEN O PDF)
        if (prospecto) {

            const resultadoProspecto = await new Promise((resolve, reject) => {

                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "auto",
                        folder: "prospectos"
                    },
                    (error, result) => {

                        if (error) {
                            return reject(error);
                        }

                        resolve(result);
                    }
                );

                stream.end(prospecto.buffer);
            });

            prospecto_url = resultadoProspecto.secure_url;
        }

        console.log("URL IMAGEN:", imagen_url);
        console.log("URL PROSPECTO:", prospecto_url);

        const nuevoProducto = await crearProductoService({
            nombre,
            descripcion,
            precio,
            id_proveedor,
            imagen_url,
            prospecto_url
        });

        logger.info("Producto creado exitosamente", {
            id: nuevoProducto.id
        });

        return res.status(201).json({
            message: "Producto creado correctamente",
            data: nuevoProducto
        });

    }catch (error) {
    console.error(error);
    logger.error(`Error al crear producto: ${error.message}`);
    res.status(500).json({
        message: error.message
    });
}
};
// Controlador para editar producto
export const actualizarProducto = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            nombre,
            descripcion,
            precio,
            id_proveedor
        } = req.body;

        console.log("REQ.BODY:", req.body);

        const imagen = req.files?.imagen?.[0];
        const prospecto = req.files?.prospecto?.[0];

        // IMPORTANTE: NO usar undefined
        const data = {
            nombre,
            descripcion,
            precio,
            id_proveedor
        };

        // SUBIR IMAGEN SOLO SI VIENE
        if (imagen?.buffer) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "productos" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(imagen.buffer);
            });

            data.imagen_url = result.secure_url;
        }

        // SUBIR PROSPECTO SOLO SI VIENE
        if (prospecto?.buffer) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "auto", folder: "prospectos" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(prospecto.buffer);
            });

            data.prospecto_url = result.secure_url;
        }

        const productoActualizado =
            await actualizarProductoService(id, data);

        return res.status(200).json({
            message: "Producto actualizado correctamente",
            data: productoActualizado
        });

    } catch (error) {
        console.error("ERROR UPDATE:", error);

        return res.status(500).json({
            message: "Error al actualizar producto",
            error: error.message
        });
    }
};


//Controlador para eliminar un producto

export const eliminarProducto =  async (req, res) =>{
    
    try{
        const {id} = req.params;
        logger.info(`DELETE /productos/${id} - Eliminando producto`);
        const eliminado = await eliminarProductoService(id);


        if (!eliminado){
            logger.warn(`Producto ID ${id} no encontrado para eliminar`);
            return res.status(404).json({ message:"Producto no encontrado"});
        }
        logger.info(`Producto ID ${id} eliminado`);
        res.status(200).json({ message: "Producto eliminado correctamente"});

    } catch (error){
        logger.error("Error al eliminar producto", { error: error.message });
        res.status(500).json({ message: "Error al eliminar el producto", error: error.message});
    }
};