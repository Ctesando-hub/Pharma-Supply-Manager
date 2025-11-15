// auth_controller valida el usuario y password para generar el token => incluye rol

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { buscarUsuarioEmail } from "../models/auth_model.js";

export const login = async (req, res) => {
    const  {email, password } = req.body;

    try{
        const user = await buscarUsuarioEmail(email);
        if(!user) {
            return res.status(401).json({ message: "Usuario no encontrado"});
        }
         // Comparar contraseña ingresada vs hash en BD
        const passwordValida = await bcrypt.compare(password, user.password);

        if (!passwordValida) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }


        // Payload del token
        const payload = {
            user: {
                id: user.id_usuario,
                email: user.email,
                rol: user.rol
            }
        };

        // Generar token JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        return res.json({ token });

    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({ mensaje: "Error del servidor" });
    }
};