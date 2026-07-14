import { getProvinciasModel, getProvinciaByIDModel, searchProvinciaModel, getProvinciasFiltrosModel, crearProvinciaModel, actualizarProvinciaModel, eliminarProvinciaModel } from "../models/provincias_model.js"; 

export const getProvinciasService = async () =>{
    return await getProvinciasModel(); 
};

export const getProvinciaByIDService = async (id) => {
    return await getProvinciaByIDModel(id);
};

export const searchProvinciaService = async (nombre) => {
    return await searchProvinciaModel(nombre);
};

export const getProvinciasFiltrosService = async (filtros) => {
    return await getProvinciasFiltrosModel(filtros);
};

export const crearProvinciaService = async (nombre) => {
    return await crearProvinciaModel(nombre);
};

export const actualizarProvinciaService = async (id, provincia) => {
    return await actualizarProvinciaModel(id, provincia);
};

export const eliminarProvinciaService = async (id) => {
    return await eliminarProvinciaModel(id);
};