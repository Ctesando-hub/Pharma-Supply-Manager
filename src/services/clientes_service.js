// Importa todas las funciones del modelo relacionadas con clientes.
// Estas funciones son las que realmente hacen las consultas SQL a la base de datos.

import { getClientesModel, getClienteByIDModel, searchClienteModel, crearClienteModel, actualizarClienteModel, 
    eliminarClienteModel } from "../models/clientes_model.js"; 

export const getClientesService = async () =>{
    return await getClientesModel(); // Solo llama al model y devuelve el resultado.
};

export const getClienteByIDService = async (id) => {
    return await getClienteByIDModel(id);
};

export const searchClienteService = async (nombre) => {
    return await searchClienteModel(nombre);
};

export const crearClienteService = async (cliente) => {
    return await crearClienteModel(cliente);
};

export const actualizarClienteService = async (id, cliente) => {
    return await actualizarClienteModel(id, cliente);
};

export const eliminarClienteService = async (id) => {
    return await eliminarClienteModel(id);
};