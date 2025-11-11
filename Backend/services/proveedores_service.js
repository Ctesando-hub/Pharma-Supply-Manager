import { getProveedoresModel,getProveedorByIDModel,searchProveedoresModel, crearProveedorModel, actualizarProveedorModel,

    eliminarProveedorModel} from "../models/proveedores_model.js";

export const getProveedoresService = async () =>{
    return await getProveedoresModel();
};

export const getProveedorByIDService = async (id) => {
    return await getProveedorByIDModel(id);
};

export const searchProveedorService = async (nombre) => {
    return await searchProveedoresModel(nombre);
};

export const crearProveedorService = async (producto) => {
    return await crearProveedorModel(producto);
};

export const actualizarProveedorService = async (id, producto) => {
    return await actualizarProveedorModel(id, producto);
};

export const eliminarProveedorService = async (id) => {
    return await eliminarProveedorModel(id);
};