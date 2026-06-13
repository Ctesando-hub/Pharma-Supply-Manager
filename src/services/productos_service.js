import { getProductoByIDModel, getAllProductos, searchProductosModel,getProductosFiltrosModel, crearProductoModel, actualizarProductoModel,eliminarProductoModel } from "../models/productos_model.js"; 
import { crearStockService } from "./stock_service.js";


export const getProductosService = async () =>{
    return await getAllProductos();
};

export const getProductoByIDService = async (id) => {
    return await getProductoByIDModel(id);
};

export const searchProductosService = async (nombre) => {
    return await searchProductosModel(nombre);
};

//-----------SERVICIO GET FILTROS------------*
export const getProductosFiltrosService = async (filtros) => {
    return await getProductosFiltrosModel(filtros);
};

//export const crearProductoService = async (producto) => {
   // return await crearProductoModel(producto);
//};
export const crearProductoService = async (producto) => {

    const nuevoProducto = await crearProductoModel(producto);

    // Crear stock inicial
    await crearStockService(nuevoProducto.id);

    return nuevoProducto;
};

export const actualizarProductoService = async (id, producto) => {
    return await actualizarProductoModel(id, producto);
};

export const eliminarProductoService = async (id) => {
    return await eliminarProductoModel(id);
};

