import bcrypt from "bcryptjs"; //Libreria para hashear passwords

import { getUsuariosModel, getUsuarioByIDModel, searchUsuarioModel, crearUsuarioModel, actualizarUsuarioModel, eliminarUsuarioModel } from "../models/usuarios_model.js";


//---------funcion para mapear usuario-------------*
///\ Esta función convierte el valor numérico que viene de MySQL
// (0 o 1) a un booleano (true o false), que es más claro y útil


const mapUser = (user) => {
    return {
        ...user,// Copia todas las propiedades originales del objeto "user"
        activo: user.activo === 1   // Convierte 1→true y 0→false
    };
};

//-------SERVICIO GET ALL---------*
export const getUsuarioService = async () =>{
    const usuarios = await getUsuariosModel();
    return usuarios.map(mapUser);
};


//--------SERVICIO GET BY ID ------------*
export const getuUsuarioByIDService = async (id) => {
    const usuario = await getUsuarioByIDModel(id);
    return mapUser(usuario); // ahora sí ✔
};

//-----------SERVICIO GET SEARCH( nombre)--------*
export const searchUsuarioService = async (nombre) => {
    const usuario = await searchUsuarioModel(nombre);
    return usuario.map(mapUser);
};

//------------SERVICIO POST ----------*
// Flujo de este servicio:
// 1) Si viene una contraseña → se encripta con bcrypt
// 2) Se convierte el campo activo (true/false → 1/0)
// 3) Se envían los datos al model para el INSERT
export const crearUsuarioService = async (usuario) => {
    
        if (usuario.password) {
        const saltRounds = 10; //cuántas veces bcrypt aplica el algoritmo interno para hacer el hash
        usuario.password = await bcrypt.hash(usuario.password, saltRounds); //  Encriptado del password si fue enviado
    }

    //  Convertir booleano a entero para MySQL
    usuario.activo = usuario.activo ? 1 : 0;

    return await crearUsuarioModel(usuario); //) Guardarlo en la base
    
};

//---------------SERVICIO PUT USUARIOS-----------*
/*export const actualizarUsuarioService = async (id, usuario) => {

    if (usuario.password) {
        const saltRounds = 10;
        usuario.password = await bcrypt.hash(usuario.password, saltRounds); // Hash del password solo si el usuario envió uno nuevo
    }

    if (usuario.activo !== undefined) {
        usuario.activo = usuario.activo ? 1 : 0; //Si el cliente envió un cambio en "activo"
    }

    return await actualizarUsuarioModel(id, usuario); //Actualizar en MySQL
};*/
export const actualizarUsuarioService = async (id, usuario) => {
    if (usuario.activo !== undefined) {
        usuario.activo = usuario.activo == 1 ? 1 : 0;
    }

    return await actualizarUsuarioModel(id, usuario);
};

//---------SERVICIO DELETE----------*
export const eliminarUsuarioService = async (id) => {
    return await eliminarUsuarioModel(id);
};