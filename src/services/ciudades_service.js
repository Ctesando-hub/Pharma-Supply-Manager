import { getCiudadesModel, searchCiudadModel, getCiudadByIDModel, getCiudadesFiltrosModel, crearCiudadModel, actualizarCiudadModel, eliminarCiudadModel  } from "../models/ciudades_model.js"; 

export const getCiudadesService = async () =>{
    return await getCiudadesModel(); // Solo llama al model y devuelve el resultado.
};

export const getCiudadByIDService = async (id) => {
    return await getCiudadByIDModel(id);
};

export const searchCiudadService = async (nombre) => {
    return await searchCiudadModel(nombre);
};

export const getCiudadesFiltrosService = async (filtros) => {
    return await getCiudadesFiltrosModel(filtros);
};

export const crearCiudadService = async (ciudad) => {
    return await crearCiudadModel(ciudad);
};

export const actualizarCiudadService = async (id, ciudad) => {
    return await actualizarCiudadModel(id, ciudad);
};

export const eliminarCiudadService = async (id) => {
    return await eliminarCiudadModel(id);
};