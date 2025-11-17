import { getProductoByIDModel, getAllProductos, searchProductosModel, crearProductoModel, actualizarProductoModel,eliminarProductoModel } from "../models/productos_model.js"; 

export const getProductosService = async () =>{
    return await getAllProductos();
};

export const getProductoByIDService = async (id) => {
    return await getProductoByIDModel(id);
};

export const searchProductosService = async (nombre) => {
    return await searchProductosModel(nombre);
};

export const crearProductoService = async (producto) => {
    return await crearProductoModel(producto);
};

export const actualizarProductoService = async (id, producto) => {
    return await actualizarProductoModel(id, producto);
};

export const eliminarProductoService = async (id) => {
    return await eliminarProductoModel(id);
};

