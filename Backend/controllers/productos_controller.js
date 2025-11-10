
import { getAllProductos, getProductoByIDModel, searchProductosModel, crearProductoModel, actualizarProductoModel, eliminarProductoModel } from "../models/productos_model.js";

// Controlador para obtener todos los productos
export const getProductos = async (req, res) =>{
    try{
        const productos = await getAllProductos(); //LLama al modelo para traer todos los productos
        return res.status(200).json({ message: "Lista de productos obtenida correctamente", data: productos });
    } catch(error) {
        res.status(500).json({message: "Error al obtener productos", error: error.message});
    }
    
};

//Controller GET ID *Obtener un producto especifico
export const getProductoByID = async (req, res) =>{
    try{
        const {id} = req.params;

        
        const producto = await getProductoByIDModel(id);

        if (!producto){
            return res.status(404).json({ message: "producto no encontrado"});
        }
            return res.status(200).json({ message: "Producto encontrado", data: producto});
    } catch(error){
        return res.status(500).json({ message: "Error al buscar producto", error: error.message});
    }
};

//Controller GET SEARCH 
export const  searchProductos = async (req, res) =>{
    try{
        const {nombre} = req.query; // viene de ?nombre=

        if (!nombre) {
            return res.status(400).json({ message: "Debe proporcionar un parámetro de búsqueda (?nombre=...)" });
        }

        const productosBuscados = await searchProductosModel(nombre);

        if (productosBuscados.length === 0) {
            return res.status(404).json({ message: "No se encontraron productos con ese nombre" });
        }
            return res.status(200).json({ message: "Resultados de búsqueda", data: productosBuscados });

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
            const nuevoProducto = await crearProductoModel({nombre, descripcion, precio, stock , id_proveedor});
            res.status(201).json({ message: "Producto creado correctamente", data: nuevoProducto});       

        } catch (error){
        res.status(500).json({ message: "Error al crear el producto", error: error.message});
        }
};

//Controlador para actualizar un producto
export const actualizarProducto =  async (req, res) => {
    try{
        const {id} =  req.params;
        const producto = req.body;

        const productoActualizado =  await actualizarProductoModel(id, producto);
        
            if (!productoActualizado) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.status(200).json({ message: "Producto actualizado correctamente", data: productoActualizado});

    }catch(error){
        res.status(500).json({ message: "Error al actualizar producto", error: error.message});
    }

};

//Controlador para eliminar un producto

export const eliminarProducto =  async (req, res) =>{
    try{
        const {id} = req.params;
        const eliminado = await eliminarProductoModel(id);

        if (!eliminado){
            return res.status(404).json({ message:"Producto no encontrado"});
        }
        res.status(200).json({ message: "Producto eliminado correctamente", data: eliminado});
    } catch (error){
        res.status(500).json({ message: "Error al eliminar el producto", error: error.message});
    }
};