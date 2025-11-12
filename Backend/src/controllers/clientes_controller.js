import { getClientesService, getClienteByIDService, searchClienteService, crearClienteService, actualizarClienteService,
    eliminarClienteService } from "../services/clientes_service.js";


// Controlador GET Traer todos los clientes

export const getClientes = async (req, res) => {
    try{
        const clientes =  await getClientesService();
        res.status(200).json({ message: "Controlador funcionando: obteniendo toda la lista de Clientes", data: clientes});

    }catch (error) {
        res.status(500).json({ message: "Error al obtener lista de Clientes", error: error.message});
    }
};


//Controlador GET ID -Obtener un cliente especifico
export const getClientesByID = async (req,res) => {
    try{
        const {id} = req.params;

        const clientes = await getClienteByIDService(id);

          //validamos los datos
            if(!clientes) {
                return res.status(404).json({ message: "Cliente no encontrado"});
            }
                return res.status(200).json({ message: "Cliente encontrado", data: clientes});

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

        const clienteBuscado = await searchClienteService(nombre);

        const resultados = clienteBuscado.filter(p =>
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
        const { nombre, cuit, telefono, direccion, email, id_ciudad, id_tipo} = req.body; //extraer los datos del body

        // Validamos que sean campos obligatorios
        if(!nombre ||!cuit ||!telefono ||!email || !direccion || !id_ciudad ||!id_tipo){
            return res.status(400).json({ message: "Faltan datos obligatorios"});
        }


        const nuevoCliente = await crearClienteService({nombre,cuit, telefono, direccion, email, id_ciudad, id_tipo});
        res.status(201).json({ message: "Cliente  creado correctamente", data: nuevoCliente});       

    } catch (error){
        res.status(500).json({ message: "Error al crear el cliente", error: error.message});
    }
};

//Controlador para actualizar un cliente
export const actualizarCliente =  async (req, res) => {
    try{
        const {id} =  req.params;
        const cliente =  req.body;

        const ClienteActualizado = await actualizarClienteService(id, cliente);

        res.status(200).json({ message: "Cliente actualizado correctamente", data: ClienteActualizado});

    }catch(error){
        res.status(500).json({ message: "Error al actualizar Cliente", error: error.message});
    }

};

//Controlador para eliminar un cliente
export const eliminarCliente =  async (req, res) =>{
    try{
        const {id} = req.params;
        const clienteEliminado = await eliminarClienteService(id);
    
        if (!clienteEliminado){
            return res.status(404).json({ message:"Cliente no encontrado"});
        }
        res.status(200).json({ message: `Cliente con el ID: ${id} eliminado correctamente`});
    } catch (error){
        res.status(500).json({ message: "Error al eliminar el cliente", error: error.message});
    }
};
