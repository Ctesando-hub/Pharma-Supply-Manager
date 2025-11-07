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

//Controlador GET SEARCH NOMBRE 
export const getClienteByName = async (req,res) =>{
    try{
        const {nombre} = req.params;
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

