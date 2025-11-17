import logger from "../utils/logger.js";

/**
 * Middleware para autorización por roles.
 *
 * Este middleware se utiliza después de `auth()` (que valida el JWT).
 * Su función es permitir o denegar el acceso a una ruta dependiendo
 * del rol que tenga el usuario autenticado.
 *
 * Flujo:
 * 1. Recibe una lista de roles permitidos (admin, gerente, empleado, etc)
 * 2. Verifica que `auth()` haya adjuntado un usuario en req.user
 * 3. Compara el rol del usuario con la lista de roles permitidos
 * 4. Si coincide → next()
 * 5. Si no coincide → 403 (permiso denegado)
 *
 * Ejemplo de uso:
 *      router.get("/admin", auth, authorizeRole("admin"), controller)
 */
export const authorizeRole = (...rolesPermitidos) => {
    return (req, res, next) => { // Retorna un middleware

        if (!req.user){  //verifica que auth() ya ha pasado
            logger.warn("Intento de acceso sin autenticación detectado");
            return res.status(401).json({ message: "No autenticado"});
        }

        // Loguea el rol que intenta acceder
        logger.info(`Usuario con rol "${req.user.rol}" intentando acceder a una ruta protegida`);

        //verificar si el rol del usuario esta entre los roles permitidos
        if(!rolesPermitidos.includes(req.user.rol)) {
            logger.warn(`Acceso denegado: el rol "${req.user.rol}" no está permitido. `);
            return res.status(403).json({message: "Permisos insuficientes"});
        }

         // Si pasa todas las validaciones, permite continuar
        logger.info(`Acceso permitido al rol "${req.user.rol}"`);
        next();
    }
}