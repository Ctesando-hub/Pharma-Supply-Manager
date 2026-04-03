import { getAllComprasModel, getCompraByIDModel, searchCompraModel, crearCompraModel, actualizarCompraModel, eliminarCompraModel } from "../models/compra_model.js";


export const getAllComprasService = async () =>{
    return await getAllComprasModel();
};

export const getCompraByIDService = async (id) => {
    return await getCompraByIDModel(id);
};

export const searchCompraService = async (nombre) => {
    return await searchCompraModel(nombre);
};

export const crearComprasService = async (pedido) => {
    return await crearCompraModel(pedido);
};

export const actualizarCompraService = async (id, pedido) => {
    return await actualizarCompraModel(id, pedido);
};

export const eliminarCompraService = async (id) => {
    return await eliminarCompraModel(id);
};