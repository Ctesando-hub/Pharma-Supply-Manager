// Controlador GET Traer todos los usuarios

export const getUsuario = async (req, res) => {
    try{
        res.status(200).json({ message: "Controlador funcionando: obteniendo toda la lista de Usuarios"});
    }catch (error) {
        res.status(500).json({ message: "Error al obtener lista de Usuarios", error: error.message});
    }
};


//Controlador GET ID -Obtener un usuario especifico
export const getUsuarioByID = async (req,res) => {
    try{
        const {id} = req.params;

        //simulamos la busqueda
        const usuarios ={nombre: "Carolina Tesando", email: "carol@ejemplo.com", password: "12345678", rol: "administrador",
                fecha_creacion:"14/10/2024"};
    

            //validamos los datos
            if(!usuarios) {
                return res.status(404).json({ message: "Usuario no encontrado"});
            }
                return res.status(200).json({ message: "Usuario simulado encontrado", data: usuarios});

        } catch (error) {
            return res.status(500).json({ message: "Error al encontrar Usuario", error: error.message});
    }   
};

// Controlador GET SEARCH - Buscar Usuario por nombre
export const searchUsuario = async (req, res) => {
    try {
       const {nombre} = req.query; // viene de ?nombre=

        if (!nombre) {
            return res.status(400).json({ message: "Debe proporcionar un parámetro de búsqueda (?nombre=...)" });
        }

        // Simular búsqueda en BD
        console.log(`Buscando productos que contengan: ${nombre}`);


    // Simulación de pedidos en memoria
    const usuariosSimulados = [
        { id: 1, nombre: "Carolina Tesando", email: "carol@ejemplo.com", password: "12345678", rol: "administrador",
                fecha_creacion:"14/10/2024"},
        { id: 12, nombre: "Sergio Ramirez", email: "serg@ejemplo.com", password: "abcd5438", rol: "empleado",
                fecha_creacion:"14/10/2025"}, 
        { id: 14, nombre: "Veronica Rivas", email: "vero@ejemplo.com", password: "5847r556t", rol: "empleado",
                fecha_creacion:"10/11/2024"},       
    
    ];

        const resultados = usuariosSimulados.filter(p =>
            p.nombre.toLowerCase().includes(nombre.toLowerCase())
        );

        if (resultados.length === 0) {
            return res.status(404).json({ message: "No se encontraron usuarios con ese nombre" });
        }

        return res.status(200).json({ message: "Resultados de búsqueda", data: resultados });
    } catch(error){
        return res.status(500).json({ message: "Error al buscar usuario", error: error.message});
    }
};


//Controlador para crear un nuevo usuario
export const crearUsuario = async (req, res) =>{
    try{
        const {nombre, email, password, fecha_creacion, rol} = req.body; //extraer los datos del body

        // Validamos que sean campos obligatorios
        if(!nombre || !email ||!password ||!fecha_creacion ||!rol){
            return res.status(400).json({ message: "Faltan datos obligatorios"});
        }


        //por ahora simulo la insercion con un mensaje

        const nuevoUsuario = {
            id: Date.now(), //simulo un id autoincremental
            nombre, email, password, rol

        };
            console.log("Usuario creado", nuevoUsuario);

        res.status(201).json({ message: "Usuario simulado creado correctamente", data: nuevoUsuario});       

    } catch (error){
        res.status(500).json({ message: "Error al crear el Usuario simulado", error: error.message});
    }
};

//Controlador para actualizar Stock
export const actualizarUsuario =  async (req, res) => {
    try{
        const {id} =  req.params;
        const {nombre, email, password, fecha_creacion, rol} =  req.body;

        //validamos los datos
        if (!nombre || !email ||!password ||!fecha_creacion ||!rol){
            return res.status(400).json({message: "Faltan datos obligatorios"});
        }

        //simulamos la actualizacion
        const usuarioActualizado = {
            id, nombre, email, password, rol, fecha_creacion
        };

        res.status(200).json({ message: "Usuario simulado actualizado correctamente", data: usuarioActualizado});

    }catch(error){
        res.status(500).json({ message: "Error al actualizar usuario simulado", error: error.message});
    }

};

//Controlador para eliminar un cliente

export const eliminarUsuario =  async (req, res) =>{
    try{
        const {id} = req.params;


      //simulamos la eliminacion de un producto especifico
        res.status(200).json({ message: `Usuario simulado con el ID: ${id} eliminado correctamente`});
    } catch (error){
        res.status(500).json({ message: "Error al eliminar el usuario", error: error.message});
    }
};