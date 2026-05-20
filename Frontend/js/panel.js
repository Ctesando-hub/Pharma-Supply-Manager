    const token = localStorage.getItem("token"); // Obtiene el token de autenticación guardado en el navegador
    const rol = localStorage.getItem("rol"); // Obtiene el rol del usuario guardado en el navegador
    const nombre = localStorage.getItem("nombre"); //Obtiene el nombre del usuario y apellido
    const apellido = localStorage.getItem("apellido");
    const API_URL = "http://localhost:3000";


document.addEventListener("DOMContentLoaded", () =>{ // Espera a que todo el HTML del documento esté cargado antes de ejecutar el JS
    //Seguridad basica del frontend
    if(!token ||!rol){ // si no existe token o rol, redirige al login 
        window.location.href = "login.html"; 
        return;
    }
    configurarPanel(rol);

    mostrarUsuario();

    registrarEventos();

});


function configurarPanel(rol){ // Configura el panel según el rol del usuario 
    console.log("ROL:", rol);

    switch (rol) {
        case "admin":
            configurarAdmin();
            break;

        case "empleado":
            configurarEmpleado();
            break;
            
        case "gerente":
            configurarGerente();
            break;
        default:
            cerrarSesion();  // Si el rol no coincide con ninguno, cierra sesión
            break;        
    }
};

   //PERMISOS
const permisos = { // Objeto que define qué módulos puede ver cada rol

    empleado: [
        "clientes",
        "productos",
        "pedidos",
        "ventas",
        "stock",
        "proveedores"
    ],

    gerente: [
        "clientes",
        "productos",
        "pedidos",
        "compras",
        "ventas",
        "stock",
        "proveedores",
        "sucursales"
        
    ],

    admin: [
        "usuarios",
        "clientes",
        "productos",
        "pedidos",
        "compras",
        "ventas",
        "proveedores",
        "stock",
        "sucursales",
        "ubicaciones",
        "ciudades",
        "provincias"
    ]
};

//PANEL ADMINISTRADOR

function configurarAdmin(){

    const rolElement = document.querySelector(".sidebar-user-role");

    if (rolElement) {
        rolElement.innerText = "Administrador";
    }

    document.querySelector(".user-box span.fw-bold")
    .innerText = "Administrador";

    aplicarPermisos(permisos.admin);
};


//Panel EMPLEADO
function configurarEmpleado() {
    

    document.querySelector(".manager-role").innerText = "EMPLEADO";
    document.querySelector(".user-box span.fw-bold").innerText = "Empleado";

    aplicarPermisos(permisos.empleado);
}

function configurarGerente(){
    document.querySelector(".manager-role").innerText = "GERENTE";
    document.querySelector(".user-box span.fw-bold").innerText = "Gerente";

    aplicarPermisos(permisos.gerente);
}

//FUNCION CENTRAL PERMISOS
function aplicarPermisos(modulosPermitidos){ // Oculta o muestra módulos según permisos del rol
       document.querySelectorAll("[data-module]").forEach(el => {  // Selecciona todos los elementos del menú
        const modulo = el.getAttribute("data-module");

        const permitido = modulosPermitidos.includes(modulo);
        
        if (!permitido){ // Si no está permitido, lo oculta
            el.style.display = "none";
        }
    });
}

//CERRAR SESION
function cerrarSesion(){// Elimina datos de sesión y redirige al login
    localStorage.removeItem("token");
    localStorage.removeItem("rol");

    window.location.href = "login.html";
}

// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-

function mostrarUsuario(){
    //Mostrar nombre y apellido del Usuario en el Panel
    document.querySelector(".user-box span.fw-bold")
    .innerText = `${nombre} ${apellido}`;

    //Iniciales avatar
    const iniciales =
    (nombre.charAt(0) || "") +
    (apellido.charAt(0) || "");

    document.querySelector(".user-avatar")
    .innerText = iniciales.toUpperCase();

}

//Mostrar seccion usuarios
function mostrarSeccion(seccion) {

    document.querySelectorAll(".module-section").forEach(s => {
        s.classList.add("d-none");
    });

    document.getElementById(seccion).classList.remove("d-none");
}



//MANEJAR MODULO
function manejarModulo(modulo) {

    switch (modulo) {

        case "usuarios":
            mostrarSeccion("usuariosSection");
            cargarUsuarios();
            break;

        case "clientes":
            console.log("Clientes aún no implementado");
            break;

        case "productos":
            console.log("Productos aún no implementado");
            break;

            case "proveedores":
            console.log("Productos aún no implementado");
            break;

            case "stock":
            console.log("Stock aún no implementado");
            break;

            case "ubicaciones":
            console.log("Ubicaciones aún no implementado");
            break;

            case "transacciones":
            console.log("Transacciones aún no implementado");
            break;
    }
} 

function registrarEventos(){

    document.addEventListener("click", (e) => {
        // MODULOS (SIDEBAR + NAV)
        const moduloBtn = e.target.closest("[data-module]");
        if (moduloBtn) {
            e.preventDefault();

            const modulo = moduloBtn.getAttribute("data-module");
            manejarModulo(modulo);
        }

        //BOTON VOLVER
        if (e.target.closest(".btn-volver-panel")) {
            volverHomePanel();
        }

        // BOTON EDITAR
        if (e.target.classList.contains("btn-editar")) {
            const id = e.target.dataset.id;
            editarUsuario(id);
        }

        // BOTON ELIMINAR
        if (e.target.classList.contains("btn-eliminar")) {
            const id = e.target.dataset.id;
            eliminarUsuario(id);
        }

        // NUEVO USUARIO
        if (e.target.id === "btnNuevoUsuario") {
            abrirModalNuevoUsuario();
        }

        // GUARDAR USUARIO
        if (e.target.id === "btnGuardarUsuario") {
            guardarUsuario();
        }
    });
}
// TRAER USUARIOS
async function cargarUsuarios() {

    try {
        const res = await fetch(`${API_URL}/api/usuarios`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        console.log("USUARIOS:", data);

        const tbody = document.getElementById("tablaUsuarios");

        if (!tbody) return;

        tbody.innerHTML = "";

        data.data.forEach(u => {
            tbody.innerHTML += `
                <tr>
                    <td>${u.id_usuario}</td>
                    <td>${u.nombre} ${u.apellido}</td>
                    <td>${u.email}</td>
                    <td>${u.rol}</td>
                    <td>${u.sucursal}</td>
                    <td>${u.activo ? "Activo" : "Inactivo"}</td>
                    <td>
                        <button class="btn btn-sm btn-editar" data-id="${u.id_usuario}">Editar</button>
                        <button class="btn btn-sm btn-eliminar" data-id="${u.id_usuario}">Eliminar</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error cargando usuarios:", error);
    }
}

//SALIR DE SECCION USUARIOS
function volverHomePanel() {

    console.log("CLICK VOLVER OK");

    // OCULTAR TODAS LAS SECCIONES
    document.querySelectorAll(".module-section").forEach(s => {
        s.classList.add("d-none");
    });

    // MOSTRAR DASHBOARD
    document.getElementById("dashboardSection")
        .classList.remove("d-none");
}

//FUNCION ELIMINAR USUARIOS
async function eliminarUsuario(id) {
    try{ // manejo de bloque 
        const confirmar = confirm("¿Seguro que querés eliminar este usuario?"); //muestra un poup del navegador con mensaje

        if(!confirmar) return;
        const res = await fetch(`${API_URL}/api/usuarios/${id}`, { //peticion al backend
            method: "DELETE",
            headers: { // cabecera HTTP, metaddata del la request
                "Content-Type": "application/json", //lo que se envia es json
                "Authorization": `Bearer ${token}` //envio del token (Bearer es el esquema de autenticacion y token esta guardado en el localStorage)
            }
        });
        const data = await res.json(); //convierte la repuesta del backend en un objeto JS

        if(!res.ok){ //si hay error muestra el mensaje
            alert(data.message || "Error al eliminar usuario");
            return; //corta la ejecucion si hubo error
        }

        alert(data.message); //mensaje de exito

        //refrescar tabla
        cargarUsuarios();

    }catch (error){ //captura el error
        console.error("Error eliminando usuario:", error); //mensaje debbug
        alert("Error de conexión con el servidor");
    }
};

//FUNCION MOSTRAR FORMULARIO NUEVO USUARIO
function abrirModalNuevoUsuario() {

    // limpiar formulario
    limpiarFormulario();

    // cambiar título
    document.querySelector("#usuarioModal .modal-title").innerText = "Nuevo Usuario";

    // abrir modal
    const modal = new bootstrap.Modal(document.getElementById("usuarioModal"));
    modal.show();
}
 //FUNCION LIMPIAR FORMULARIO
function limpiarFormulario() {
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("rol").value = "1";
    document.getElementById("sucursal").value = "1";
}
    //FUNCION OBTENER VALORES DEL FORMULARIO
function obtenerUsuarioFormulario() {
    return {
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        id_rol: document.getElementById("rol").value,
        id_sucursal: document.getElementById("sucursal").value,
        activo: 1
    };
}
async function guardarUsuario() {

    try {

        const usuario = obtenerUsuarioFormulario();

        const res = await fetch(`${API_URL}/api/usuarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(usuario)
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Error al crear usuario");
            return;
        }

        alert("Usuario creado correctamente");

        // cerrar modal
        const modalEl = document.getElementById("usuarioModal");
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        // recargar tabla
        cargarUsuarios();

    } catch (error) {
        console.error("Error creando usuario:", error);
        alert("Error de conexión");
    }
}