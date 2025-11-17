import jwt from "jsonwebtoken";
import logger from "../utils/logger.js"; 

/**
 * Middleware de autenticación basado en JSON Web Tokens (JWT).
 *
 * Este middleware verifica si la petición contiene un token válido en el
 * encabezado `Authorization`. Si el token es válido, se decodifica y la
 * información del usuario se adjunta al objeto `req` para ser utilizada en
 * rutas protegidas.
 *
 * Flujo:
 * 1. Extrae el token del header `Authorization` en formato: "Bearer <token>".
 * 2. Si no existe token → responde con 401 (No autorizado).
 * 3. Verifica el token usando la clave secreta almacenada en `process.env.JWT_SECRET`.
 * 4. Si la verificación falla → responde con 403 (Token inválido o expirado).
 * 5. Si es correcto → agrega los datos decodificados a `req.user` y continúa.
 *
 * Requiere:
 * - Haber definido la variable de entorno `JWT_SECRET`.
 * - Que el cliente envíe el token en el header de autorización:
 *      Authorization: Bearer <token>
 */
export const auth = (req, res, next) => {
    // Extrae el token del header de autorización
    const token = req.headers["authorization"]?.split(" ")[1];

    // Si no se envió token, se deniega acceso
    if (!token) {
        logger.warn(`Acceso denegado: no se proporcionó token.`);
        return res.status(401).json({ message: "Token requerido" });
    }

    // Verifica el token con la clave secreta
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        // Si es inválido o expiró → 403
        if (err) {
            logger.error(`Token inválido o expirado. Ruta: ${req.originalUrl} | Error: ${err.message}`);
            return res.status(403).json({ message: "Token inválido" });
        }
            logger.info(`Token válido. Usuario: ${decoded.email} | Rol: ${decoded.rol}`);
        // Si es correcto, guarda los datos del usuario en la request
        req.user = decoded;
        
        // Pasa al siguiente middleware o controlador
        next();
    });
};
