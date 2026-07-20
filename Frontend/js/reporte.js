import { alertSuccess, alertError } from "./alerts.js";

const token = localStorage.getItem("token");
const rol = localStorage.getItem("rol");
const nombre = localStorage.getItem("nombre");
const apellido = localStorage.getItem("apellido");

const API_URL = "http://localhost:3000";

console.log("Reportes cargado");

let graficoVentas;
let mesesVentas = [];
let datosVentas = [];

document.addEventListener("DOMContentLoaded", () => {

    // Seguridad básica
    if (!token || !rol) {
        window.location.href = "login.html";
        return;
    }

    configurarPermisos();

    mostrarUsuario();
    cargarResumen();

    // Evento para cambiar el tipo de gráfico
    document.getElementById("tipoGrafico").addEventListener("change", function () {

        crearGraficoVentas(
            mesesVentas,
            datosVentas,
            this.value
        );

    });

    cargarVentasMensuales();
    cargarProductosTop();
    cargarClientesTop();
    cargarStockCritico();

});
function mostrarUsuario() {

    document.getElementById("usuarioLogueado").textContent =
        `${nombre} ${apellido}`;

}

function configurarPermisos() {
    if (rol !== "admin" && rol !== "gerente") {
        alertError("No tienes permisos para acceder a esta página.");
        window.location.href = "panel.html";

    }

}
//Funcion cargar resumen
async function cargarResumen() {
    try {
        const respuesta = await fetch(`${API_URL}/api/reportes/resumen`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!respuesta.ok) {
        throw new Error("No se pudo obtener el resumen de reportes.");
}

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.message);
        }
        mostrarResumen(resultado.data);

    } catch (error) {
        console.error(error);
        alertError(error.message);

    }

}
function mostrarResumen(datos) {

    document.getElementById("ventasTotales").textContent =`$${Number(datos.ventas_totales).toLocaleString("es-AR")}`;

    document.getElementById("cantidadPedidos").textContent =datos.cantidad_pedidos;

    document.getElementById("cantidadProductos").textContent =datos.cantidad_productos;

    document.getElementById("cantidadDetalles").textContent =datos.cantidad_detalles_pedidos;

    document.getElementById("cantidadClientes").textContent = datos.cantidad_clientes;

}

async function cargarVentasMensuales() {
    try {
        const respuesta = await fetch(`${API_URL}/api/reportes/ventas-mensuales`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las ventas mensuales.");
        }
        const resultado = await respuesta.json();
        console.log("Ventas mensuales:", resultado);

        mesesVentas = resultado.data.meses;
        datosVentas = resultado.data.ventas;

        crearGraficoVentas(mesesVentas,datosVentas);

    } catch(error) {
        console.error(error);
        alertError(error.message);

    }

}
function crearGraficoVentas(meses, ventas, tipo = "line") {
    const ctx = document.getElementById("graficoVentas");

    if(graficoVentas){
        graficoVentas.destroy();
    }

    graficoVentas = new Chart(ctx, {
        type: tipo,
        data: {
            labels: meses,
            datasets: [
                {
                    label: "Ventas mensuales",
                    data: ventas,
                    tension: 0.4
                }
            ]

        },

    options: {

    responsive: true,

    interaction: {
        intersect: false,
        mode: "index"
    },

    plugins: {

        legend: {
            display: true
        },

        tooltip: {
            callbacks: {

                label: function(context) {
                    return "$ " + context.raw.toLocaleString("es-AR");
                }
            }
        }

    },

    scales: {

        y: {
            beginAtZero: true,
            ticks: {
                callback: function(value) {
                    return "$ " + value.toLocaleString("es-AR");
                }
            }
        }

    },

    animation: {
        duration: 1500,
        easing: "easeOutQuart"
    }

}
    });

}

//Funcion carga los productos con mas ventas
async function cargarProductosTop() {
    try {
        const respuesta = await fetch(`${API_URL}/api/reportes/productos-mas-vendidos`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los productos más vendidos.");
        }

        const resultado = await respuesta.json();
        console.log(resultado.data.productos);
        mostrarProductosTop(resultado.data.productos);

    } catch (error) {
        console.error(error);
        alertError(error.message);
    }

}
function mostrarProductosTop(productos) {
    const tbody = document.getElementById("tablaProductosTop");
    tbody.innerHTML = "";
    productos.forEach((producto, index) => {

        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${producto.nombre}</td>
                <td class="text-end">${producto.cantidad}</td>
            </tr>
        `;
    });

}

async function cargarClientesTop() {
    try {
        const respuesta = await fetch(`${API_URL}/api/reportes/clientes-top`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los clientes.");
        }
        const resultado = await respuesta.json();
        mostrarClientesTop(resultado.data.clientes);

    } catch (error) {
        console.error(error);
        alertError(error.message);
    }

}

function mostrarClientesTop(clientes) {
    const tbody = document.getElementById("tablaClientesTop");
    tbody.innerHTML = "";
    clientes.forEach(cliente => {
        tbody.innerHTML += `
            <tr>
                <td>${cliente.nombre}</td>
                <td class="text-end">
                    $${Number(cliente.total).toLocaleString("es-AR")}
                </td>
            </tr>`;
    });

}

//Funcion cargar stock critico
async function cargarStockCritico() {
    try {

        const respuesta = await fetch(`${API_URL}/api/reportes/stock-critico`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo obtener el stock crítico.");
        }

        const resultado = await respuesta.json();
        mostrarStockCritico(resultado.data.productos);

    } catch (error) {
        console.error(error);
        alertError(error.message);
    }

}
 //Funcion mostrar Stock Critico
function mostrarStockCritico(productos) {
    const lista = document.getElementById("listaStockCritico");
    const badge = document.getElementById("cantidadAlertas");
    lista.innerHTML = "";
    badge.textContent = productos.length;
    productos.forEach(producto => {
        lista.innerHTML += `
            <div class="d-flex justify-content-between align-items-center border-bottom border-light py-2">
                <div>
                    <strong>${producto.nombre}</strong><br>
                    <small>Reposición: ${producto.punto_reposicion}</small>
                </div>
                <span class="badge bg-warning text-dark">${producto.cantidad_disponible}</span>

            </div>`;
    });

}