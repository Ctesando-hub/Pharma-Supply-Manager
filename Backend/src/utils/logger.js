// Importamos la librería Winston
import winston from "winston";

// -----------------------------
// CONFIGURACIÓN DE FORMATOS
// -----------------------------

// Creamos un formato personalizado para mostrar fecha + nivel + mensaje
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// -----------------------------
// CREAMOS EL LOGGER PRINCIPAL
// -----------------------------

const logger = winston.createLogger({
    level: "info",   // Nivel mínimo de logs que se van a registrar
                     // (error < warn < info < http < verbose < debug < silly)

    format: winston.format.combine(
        winston.format.timestamp(),  // Agrega fecha y hora a cada log
        logFormat                    // Aplica nuestro formato personalizado
    ),

    transports: [
        // -------------------------
        // 1) Mostrar logs en consola
        // -------------------------
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), // Colores bonitos en consola
                winston.format.timestamp(),
                logFormat
            )
        }),

        // -------------------------
        // 2) Guardar logs en archivo
        // -------------------------
        new winston.transports.File({
            filename: "logs/error.log",  // Archivo donde se guardan los errores
            level: "error"               // Solo registra errores
        }),

        new winston.transports.File({
            filename: "logs/app.log"     // Archivo para todos los logs
        })
    ]
});

// Exportamos el logger para usarlo en controllers, services, etc.
export default logger;
