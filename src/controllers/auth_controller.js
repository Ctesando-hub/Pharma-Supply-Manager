// auth_controller valida el usuario y password para generar el token => incluye rol

import jwt from "jsonwebtoken"; // Importa la librería jsonwebtoken para generar y verificar tokens JWT
import bcrypt from "bcryptjs"; // Importa bcryptjs para comparar contraseñas hasheadas
import { buscarUsuarioEmail, crearUsuario } from "../models/auth_model.js"; // Importa la función que busca un usuario por email en la base de datos
import logger from "../utils/logger.js"; // Importa el logger configurado (Winston) para registrar eventos
import {cloudinary} from "../config/cloudinary.js";


export const login = async (req, res) => { // Exporta la función login para que pueda ser usada como controlador
    const  {email, password } = req.body; // Extrae email y password del cuerpo de la petición
    logger.info(`Intento de login recibido: email=${email}`);

    try{
        const user = await buscarUsuarioEmail(email); //Buscar usuario por email

        if(!user) {
            logger.warn(`Login fallido: usuario no encontrado -> ${email}`);
            return res.status(401).json({ message: "Usuario no encontrado"});
        }
        if (user.eliminado !== null) {

        logger.warn(`Login bloqueado: usuario eliminado -> ${email}`
    );

        return res.status(403).json({
            message: "La cuenta se encuentra deshabilitada. Contacte al administrador."
    });
}
         // Comparar contraseña ingresada vs hash en BD
        const passwordValida = await bcrypt.compare(password, user.password);


        if (!passwordValida) {
            logger.warn(`Login fallido: contraseña incorrecta para -> ${email}`);
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }


        // Payload del token - Crea el objeto con los datos que van dentro del JWT
        const payload = {id: user.id_usuario, email: user.email, rol: user.rol.toLowerCase()
};

        // Generar token JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
            logger.info(`Token generado correctamente para el usuario ${email}`);
            return res.json({ 
                token,
                id_usuario: user.id_usuario,
                rol: user.rol.toLowerCase(),
                nombre: user.nombre,
                apellido: user.apellido
            });

    } catch (error) {
        logger.error(`Error en login: ${error.message}`); // guarda en error.log
        return res.status(500).json({ mensaje: "Error del servidor" });
    }
};


// -*-*-*-*-*-*--REGISTROS-*-*-*-*-*-**-

export const register = async (req, res) =>{
    const{ nombre, apellido, email, password, rol, sucursal} = req.body; //Desestructura los datos que vienen del frontend.

    logger.info(`Intento de registro: email=${email}`);

    try{ 
        //validar campos obligatorios
        if( !nombre || !apellido || !email || !password ||!rol){ //Verifica que no estén vacíos o undefined.
            logger.warn("Faltan campos obligatorios en registro");
            return res.status(400).json({
                message: "Faltan campos obligatorios",
            });
        }

        //verificar email existente -Consulta a la base de datos.
        const  usuarioExistente = await buscarUsuarioEmail(email);

        if(usuarioExistente){
            logger.warn(`Email ya registrado: ${email}`);

            return res.status(400).json({
                message: "El email ya esta registrado",

            });
        }

        // FOTO (con default)
        const DEFAULT_USER_IMAGE = "https://res.cloudinary.com/dr1xjwbom/image/upload/v1771856811/raphaelsilva-user-2517433_640_tt81ha.jpg"; 
        let foto_url = DEFAULT_USER_IMAGE;

        if (req.file){
            logger.info("Subierndo imagen....");

            const result =  await cloudinary.uploader.upload(req.file.path, {
                folder: "usuarios",
            });
            foto_url =  result.secure_url; //Guarda la URL segura HTTPS.
            logger.info("Imagen subida correctamente");
        }

        //password hash
        const passwordHash = await bcrypt.hash(password, 10);

        //Sucursal (puede ser null)
        const sucursalFinal =  sucursal || null;

        //guardamos en MySql
        await crearUsuario({ //Llama al modelo
            nombre, apellido, email, password: passwordHash, rol, sucursal: sucursalFinal, foto_url,
        });

        logger.info(`Usuario registrado correctamente: ${email}`);

        res.status(200).json({
            message: "Usuario registrado correctamente",
            foto: foto_url,
        });
    }catch (error){
        logger.error(`Error en registrar usuario: ${error.message}`);
        res.status(500).json({
            message: "Error al registrar usuario",
        });
    }
};
