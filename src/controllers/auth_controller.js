// auth_controller valida el usuario y password para generar el token => incluye rol

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { buscarUsuarioEmail } from "../models/auth_model.js";
import logger from "../utils/logger.js";

export const login = async (req, res) => {
    const  {email, password } = req.body;
    logger.info(`Intento de login recibido: email=${email}`);

    try{
        const user = await buscarUsuarioEmail(email); //Buscar usuario por email

        if(!user) {
            logger.warn(`Login fallido: usuario no encontrado -> ${email}`);
            return res.status(401).json({ message: "Usuario no encontrado"});
        }
         // Comparar contraseña ingresada vs hash en BD
        const passwordValida = await bcrypt.compare(password, user.password);


        if (!passwordValida) {
            logger.warn(`Login fallido: contraseña incorrecta para -> ${email}`);
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }


        // Payload del token
        const payload = {id: user.id_usuario, email: user.email, rol: user.rol.toLowerCase()
};

        // Generar token JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
            logger.info(`Token generado correctamente para el usuario ${email}`);
            return res.json({ token });

    } catch (error) {
        logger.error(`Error en login: ${error.message}`); // guarda en error.log
        return res.status(500).json({ mensaje: "Error del servidor" });
    }
};