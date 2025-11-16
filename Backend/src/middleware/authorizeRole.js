export const authorizeRole = (...rolesPermitidos) => {
    return (req, res, next) => {

        if (!req.user){  //verifica que auth() ya ha pasado
            return res.status(401).json({ message: "No autenticado"});
        }

        //verificar si el rol del usuario esta entre los roles permitidos
        if(!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({message: "Permisos insuficientes"});
        }

        next();
    }
}