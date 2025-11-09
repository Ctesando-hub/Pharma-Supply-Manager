// Controlador GET Traer todos los clientes

export const getClientes = async (req, res) => {
    try{
        res.status(200).json({ message: "Controlador funcionando: obteniendo toda la lista de Clientes"});
    }catch (error) {
        res.status(500).json({ message: "Error al obtener lista de Clientes", error: error.message});
    }
};


//Controlador GET ID -Obtener un cliente especifico
export const getClientesByID = async (req,res) => {
    try{
        const {id} = req.params;

        //simulamos la busqueda
        const clientes ={nombre: "Ana Carolina", telefono: "011-569856", email: "anacarol@ejemplo.com", direccion: "San Martin 33",
            id_ciudad: "3" };


            //validamos los datos
            if(!clientes) {
                return res.status(404).json({ message: "Cliente no encontrado"});
            }
                return res.status(200).json({ message: "Cliente simulado encontrado", data: clientes});

        } catch (error) {
            return res.status(500).json({ message: "Error al encontrar Cliente", error: error.message});
    }   
};

//Controller GET SEARCH 
export const searchClientes = async (req, res) =>{
    try{
        const {nombre} = req.query; // viene de ?nombre=

        if (!nombre) {
            return res.status(400).json({ message: "Debe proporcionar un parámetro de búsqueda (?nombre=...)" });
        }

        // Simular búsqueda en BD
        console.log(`Buscando clientes que contengan: ${nombre}`);

         // Simula una búsqueda en base de datos
    const clientesSimulados = [
        {nombre: "Ana Carolina", telefono: "011-569856", email: "anacarol@ejemplo.com", direccion: "San Martin 33",
            id_ciudad: "3"},
        {nombre: "Raul Gutierrez", telefono: "011-569888", email: "raul@ejemplo.com", direccion: "Belgrano 987",
            id_ciudad: "3"},  
        {nombre: "Sofia Marti", telefono: "011-111452", email: "sofia@ejemplo.com", direccion: "Jamaica 765",
        id_ciudad: "3"} 
    ];

        const resultados = clientesSimulados.filter(p =>
            p.nombre.toLowerCase().includes(nombre.toLowerCase())
        );

        if (resultados.length === 0) {
            return res.status(404).json({ message: "No se encontraron clientes con ese nombre" });
        }

        return res.status(200).json({ message: "Resultados de búsqueda", data: resultados });
    } catch(error){
        return res.status(500).json({ message: "Error al buscar cliente", error: error.message});
    }
};

//Controlador para crear un nuevo cliente
export const crearCliente = async (req, res) =>{
    try{
        const { nombre, telefono, email, direccion, id_ciudad} = req.body; //extraer los datos del body

        // Validamos que sean campos obligatorios
        if(!nombre || !telefono ||!email || !direccion || !id_ciudad){
            return res.status(400).json({ message: "Faltan datos obligatorios"});
        }


        //por ahora simulo la insercion con un mensaje

        const nuevoCliente = {
            id: Date.now(), //simulo un id autoincremental
            nombre, telefono, email, direccion, id_ciudad

        };
            console.log("Cliente creado", nuevoCliente);

        res.status(201).json({ message: "Cliente simulado creado correctamente", data: nuevoCliente});       

    } catch (error){
        res.status(500).json({ message: "Error al crear el cliente simulado", error: error.message});
    }
};

//Controlador para actualizar un cliente
export const actualizarCliente =  async (req, res) => {
    try{
        const {id} =  req.params;
        const {nombre, telefono, email, direccion, id_ciudad } =  req.body;

        //validamos los datos
        if (!nombre || !telefono ||!email || !direccion || !id_ciudad){
            return res.status(400).json({message: "Faltan datos obligatorios"});
        }

        //simulamos la actualizacion
        const ClienteActualizado = {
            id, nombre, telefono, email, direccion, id_ciudad
        };

        res.status(200).json({ message: "Cliente simulado actualizado correctamente", data: ClienteActualizado});

    }catch(error){
        res.status(500).json({ message: "Error al actualizar Cliente simulado", error: error.message});
    }

};

//Controlador para eliminar un cliente

export const eliminarCliente =  async (req, res) =>{
    try{
        const {id} = req.params;


      //simulamos la eliminacion de un producto especifico
        res.status(200).json({ message: `Cliente simulado con el ID: ${id} eliminado correctamente`});
    } catch (error){
        res.status(500).json({ message: "Error al eliminar el cliente", error: error.message});
    }
};
