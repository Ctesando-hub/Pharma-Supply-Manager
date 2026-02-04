
document.addEventListener("DOMContentLoaded", () =>{  //Ejecuta el codigo cuando el HTML este cargado
    const form =document.getElementById("registerForm");
    
    form.addEventListener("submit", async (e) =>{ //Escucha el evento click de Registrar, es asincronica porque va a usar await
        e.preventDefault(); //Evita que se recarge la pag y envie datos por HTML tradicional sino el fetch no serviria

        const formData = new FormData(form); //FormData es un objeto que lee todos los inputs del form. Sirve para enviar datos por fetch

        try{  //manejo de errores
            const response =  await fetch("http://localhost:3000/api/auth/register", { //Hace una peticion HTTP al backend
                method: "POST",
                body: formData  //cuando usamos FormData no hace falta enviar header
            });
            const data = await response.json(); //lee la repuesta del servidor. Convierte a repuesta del backend en un JSON

            if (response.ok){ // status 200
                alert("Usuario registrado correctamente"); //mensaje de exito
                window.location.href = "login.html"; // lo envia al login
            }else {
                alert(data.message || "Error al registrar"); //muestra o un mensaje generico o un mensaje personalizado
            }
        } catch (error){ //captura el error
        console.error(error);
        alert("Error de conexion con el servidor");
        }

    });
});


