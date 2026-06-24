import { getAllComprasModel, getDetalleCompraModel, getCompraFiltrosModel, getCompraByIDModel, searchCompraModel, crearCompraModel, actualizarCompraModel, eliminarCompraModel } from "../models/compra_model.js";


export const getAllComprasService = async () =>{
    return await getAllComprasModel();
};

export const getDetalleCompraService = async (id) => {
    return await getDetalleCompraModel(id);
};

export const getComprasFiltrosService = async (filtros) => {
    return await getCompraFiltrosModel(filtros);
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

export const actualizarCompraService = async (id, compra) => {
    return await actualizarCompraModel(id, compra);
};

export const eliminarCompraService = async (id) => {
    return await eliminarCompraModel(id);
};