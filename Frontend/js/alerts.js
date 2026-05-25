

/**
 * ALERTA DE ÉXITO
 */
export const alertSuccess = (title, text = "") => {
    return Swal.fire({
        icon: "success",
        title,
        text,
        confirmButtonColor: "#e20074"
    });
};

/**
 * ALERTA DE ERROR
 */
export const alertError = (title, text = "") => {
    return Swal.fire({
        icon: "error",
        title,
        text,
        confirmButtonColor: "#e20074"
    });
};

/**
 * CONFIRMACIÓN DE ELIMINACIÓN
 */
export const confirmDelete = (text = "¿Estás seguro?") => {
    return Swal.fire({
        title: "Confirmación",
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e20074",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });
};