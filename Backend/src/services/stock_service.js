import { getAllStockModel, getStockByIDModel, searchStockModel, crearStockModel, actualizarStockModel, eliminarStockModel } from "../models/stock_model.js"; 


export const getAllStockService = async () =>{
    return await getAllStockModel();
};

export const getStockByIDService = async (id) => {
    return await getStockByIDModel(id);
};

export const searchStockService = async (nombre) => {
    return await searchStockModel(nombre);
};

export const crearStockService = async (stock) => {
    return await crearStockModel(stock);
};

export const actualizarStockService = async (id, stock) => {
    return await actualizarStockModel(id, stock);
};

export const eliminarStockService = async (id) => {
    return await eliminarStockModel(id);
};