

/**
 * ALERTA DE ÉXITO
 */
export const alertSuccess = (title, text = "") => {
    return Swal.fire({
        icon: "success",
        title,
        text,
        width: "320px",
        confirmButtonColor: "#e20074",
        customClass: {
            popup: "swal-small"
        }
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
        width: "320px",
        confirmButtonColor: "#e20074",
        customClass: {
            popup: "swal-small"
        }
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
        width: "320px",
        showCancelButton: true,
        confirmButtonColor: "#e20074",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        customClass: {
            popup: "swal-small"
        }
    });
};