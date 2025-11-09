// Controlador GET Traer todos los proveedores

export const getProveedores = async (req, res) => {
    try{
        res.status(200).json({ message: "Controlador funcionando: obteniendo toda la lista de Proveedores"});
    }catch (error) {
        res.status(500).json({ message: "Error al obtener lista de Proveedores", error: error.message});
    }
};


//Controlador GET ID -Obtener un cliente especifico
export const getProveedorByID = async (req,res) => {
    try{
        const {id} = req.params;
    
        //simulamos la busqueda
        const proveedores ={nombre: "Ana Carolina", cuit: "5632598545", direccion: "San Martin 33", telefono: "011-569856", email: "anacarol@ejemplo.com", 
            id_ciudad: "3" };


            //validamos los datos
            if(!proveedores) {
                return res.status(404).json({ message: "Proveedor no encontrado"});
            }
                return res.status(200).json({ message: "Proveedor simulado encontrado", data: proveedores});

        } catch (error) {
            return res.status(500).json({ message: "Error al encontrar Proveedor", error: error.message});
    }   
};

//Controller GET SEARCH 
export const searchProveedor = async (req, res) =>{
    try{
        const {nombre} = req.query; // viene de ?nombre=

        if (!nombre) {
            return res.status(400).json({ message: "Debe proporcionar un parámetro de búsqueda (?nombre=...)" });
        }

        // Simular búsqueda en BD
        console.log(`Buscando proveedores que contengan: ${nombre}`);

         // Simula una búsqueda en base de datos
    const ProveedoresSimulados = [
        {nombre: "Laboratorios Bago", cuit: "56988547", direccion: "San Martin 33", telefono: "011-569856", email: "bago@ejemplo.com", 
            id_ciudad: "3"},
        {nombre: "Labortaorios Roemmers", cuit: "1112254", direccion: "Belgrano 987", telefono: "011-569888", email: "roemm@ejemplo.com", 
            id_ciudad: "3"},  
        {nombre: "Laboratorio Elea", cuit: "55896541", direccion: "Jamaica 765", telefono: "011-111452", email: "elea@ejemplo.com", 
        id_ciudad: "3"} 
    ];

        const resultados = ProveedoresSimulados.filter(p =>
            p.nombre.toLowerCase().includes(nombre.toLowerCase())
        );

        if (resultados.length === 0) {
            return res.status(404).json({ message: "No se encontraron proveedores con ese nombre" });
        }

        return res.status(200).json({ message: "Resultados de búsqueda", data: resultados });
    } catch(error){
        return res.status(500).json({ message: "Error al buscar proveedor", error: error.message});
    }
};

//Controlador para crear un nuevo proveedor
export const crearProveedor = async (req, res) =>{
    try{
        const { nombre, cuit, direccion, telefono, email, id_ciudad} = req.body; //extraer los datos del body

        // Validamos que sean campos obligatorios
        if(!nombre  ||!cuit ||!telefono ||!email ||!direccion ||!id_ciudad){
            return res.status(400).json({ message: "Faltan datos obligatorios"});
        }


        //por ahora simulo la insercion con un mensaje

        const nuevoProveedor = {
            id: Date.now(), //simulo un id autoincremental
            nombre,cuit, direccion, telefono, email, id_ciudad

        };
            console.log("Proveedor creado", nuevoProveedor);

        res.status(201).json({ message: "Proveedor simulado creado correctamente", data: nuevoProveedor});       

    } catch (error){
        res.status(500).json({ message: "Error al crear el proveedor simulado", error: error.message});
    }
};

//Controlador para actualizar un cliente
export const actualizarProveedor =  async (req, res) => {
    try{
        const {id} =  req.params;
        const {nombre, cuit, direccion, telefono, email, id_ciudad } =  req.body;

        //validamos los datos
        if (!nombre ||!cuit || !telefono ||!email || !direccion || !id_ciudad){
            return res.status(400).json({message: "Faltan datos obligatorios"});
        }

        //simulamos la actualizacion
        const proveedorActualizado = {
            id, nombre, cuit, direccion, telefono, email, id_ciudad
        };

        res.status(200).json({ message: "Proveedor simulado actualizado correctamente", data: proveedorActualizado});

    }catch(error){
        res.status(500).json({ message: "Error al actualizar Proveedor simulado", error: error.message});
    }

};

//Controlador para eliminar un proveedor

export const eliminarProveedor =  async (req, res) =>{
    try{
        const {id} = req.params;


      //simulamos la eliminacion de un proveedor especifico
        res.status(200).json({ message: `Proveedor simulado con el ID: ${id} eliminado correctamente`});
    } catch (error){
        res.status(500).json({ message: "Error al eliminar el proveedor", error: error.message});
    }
};
