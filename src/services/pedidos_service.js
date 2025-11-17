import { getAllPedidosModel, getPedidoByIDModel, searchPedidoModel, crearPedidoModel, actualizarPedidoModel, eliminarPedidoModel } from "../models/pedidos_model.js";


export const getAllPedidosService = async () =>{
    return await getAllPedidosModel();
};

export const getPedidoByIDService = async (id) => {
    return await getPedidoByIDModel(id);
};

export const searchPedidoService = async (nombre) => {
    return await searchPedidoModel(nombre);
};

export const crearPedidosService = async (pedido) => {
    return await crearPedidoModel(pedido);
};

export const actualizarPedidoService = async (id, pedido) => {
    return await actualizarPedidoModel(id, pedido);
};

export const eliminarPedidosService = async (id) => {
    return await eliminarPedidoModel(id);
};