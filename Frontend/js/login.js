
document.addEventListener("DOMContentLoaded", () =>{  //Ejecuta el codigo cuando el HTML este cargado
    const form =document.getElementById("formLogin");
    const btnvolver = document.getElementById("boton-volver");
    
    //BOTON VOLVER INDEX
    btnvolver.addEventListener("click", () =>{
        window.location.href = "index.html";
    });
    
    form.addEventListener("submit", async (e) =>{ //Escucha el evento click de Registrar, es asincronica porque va a usar await
        e.preventDefault(); //Evita que se recarge la pag y envie datos por HTML tradicional sino el fetch no serviria
        console.log(" SUBMIT EJECUTADO");  
        const email =  document.getElementById("email").value ;
        const password = document.getElementById("password").value;

        try{  //manejo de errores
            const response =  await fetch("http://localhost:3000/api/auth/login", { //Hace una peticion HTTP al backend
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({email, password})
                
            });
            console.log(" RESPUESTA RECIBIDA");
            const data = await response.json(); //lee la repuesta del servidor. Convierte a repuesta del backend en un JSON
            console.log("DATA BACKEND:", data);

            if (response.ok){ // status 200
                localStorage.setItem("token", data.token)
                localStorage.setItem("rol", data.rol);
                localStorage.setItem("nombre", data.nombre);
                localStorage.setItem("apellido", data.apellido);
                window.location.href = "panel.html"; // lo envia al panel
            }else {
                alert(data.message || "Error al Iniciar Sesion"); //muestra o un mensaje generico o un mensaje personalizado
            }
        } catch (error){ //captura el error
        console.error(error);
        alert("Error de conexion con el servidor");
        }

    });
});


